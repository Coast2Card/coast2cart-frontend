import { useState, useEffect, useRef } from 'react';
import { 
  useGetChatRoomsQuery, 
  useGetChatMessagesQuery, 
  useSendMessageMutation, 
  useMarkMessagesAsReadMutation
} from '../services/api';
import { useChatContext } from '../contexts/ChatContext';
import bangusImage from '../assets/images/bangus.png';

const ChatPopup = () => {
  const { isChatOpen, closeChat, selectedChatId, setSelectedChatId, shouldOpenChat } = useChatContext();
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'unread', 'alphabetical'
  const [showSortMenu, setShowSortMenu] = useState(false);
  const messagesEndRef = useRef(null);

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const user = localStorage.getItem("auth_user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();
  const isLoggedIn = Boolean(localStorage.getItem("auth_token"));

  // Fetch chat rooms
  const { data: chatRooms = [], isLoading: isLoadingRooms, refetch: refetchRooms } = useGetChatRoomsQuery(undefined, {
    skip: !isLoggedIn,
    // Refetch every 5 seconds to keep chat list updated
    pollingInterval: 5000,
  });




  // Fetch messages for selected chat
  const { data: chatMessages, isLoading: isLoadingMessages, refetch: refetchMessages } = useGetChatMessagesQuery(
    { chatRoomId: selectedChatId, page: 1, limit: 50 },
    {
      skip: !selectedChatId,
      // Poll for new messages every 3 seconds when a chat is selected
      pollingInterval: selectedChatId ? 3000 : 0,
    }
  );

  // Mutations
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
  const [markAsRead] = useMarkMessagesAsReadMutation();

  // Helper functions
  const getCurrentChat = () => {
    return chatRooms.find(chat => (chat._id || chat.id) === selectedChatId);
  };

  const getCurrentChatMessages = () => {
    return chatMessages?.messages || [];
  };

  // Helper function to format date separators
  const getDateLabel = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time parts for accurate date comparison
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    messageDate.setHours(0, 0, 0, 0);

    if (messageDate.getTime() === today.getTime()) {
      return 'TODAY';
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return 'YESTERDAY';
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    let currentGroup = [];

    messages.forEach((msg) => {
      const msgDate = new Date(msg.createdAt);
      msgDate.setHours(0, 0, 0, 0);
      const msgDateString = msgDate.toDateString();

      if (currentDate !== msgDateString) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = msgDateString;
        currentGroup = [msg];
      } else {
        currentGroup.push(msg);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  };

  // Check if message should be grouped with previous message
  const shouldGroupWithPrevious = (currentMsg, previousMsg, currentIndex) => {
    if (!previousMsg || currentIndex === 0) return false;

    // Get sender IDs
    const getCurrentSenderId = (msg) => {
      if (typeof msg.senderId === 'object' && msg.senderId !== null) {
        return msg.senderId._id || msg.senderId.id;
      } else if (typeof msg.sender === 'object' && msg.sender !== null) {
        return msg.sender._id || msg.sender.id;
      }
      return msg.senderId || msg.sender;
    };

    const currentSenderId = getCurrentSenderId(currentMsg);
    const previousSenderId = getCurrentSenderId(previousMsg);

    // Don't group if different senders
    if (currentSenderId !== previousSenderId) return false;

    // Don't group product messages
    if (currentMsg.messageType === 'product' || previousMsg.messageType === 'product') return false;

    // Check time difference (group if less than 2 minutes apart)
    const currentTime = new Date(currentMsg.createdAt).getTime();
    const previousTime = new Date(previousMsg.createdAt).getTime();
    const timeDiff = (currentTime - previousTime) / 1000 / 60; // in minutes

    return timeDiff < 2;
  };

  const getTotalUnreadCount = () => {
    return chatRooms.reduce((total, chat) => {
      return total + (chat.unreadCount || 0);
    }, 0);
  };

  const filteredChatRooms = () => {
    // Create a copy of the array to avoid mutating the original
    let filtered = [...chatRooms];
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(chat => {
        const participant = chat.participants?.find(p => {
          const participantId = p._id || p.id;
          const currentUserId = currentUser?._id || currentUser?.id;
          return String(participantId) !== String(currentUserId);
        });
        return participant?.username?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    // Sort by selected option
    switch (sortBy) {
      case 'unread':
        filtered = filtered.sort((a, b) => (b.unreadCount || 0) - (a.unreadCount || 0));
        break;
      case 'alphabetical':
        filtered = filtered.sort((a, b) => {
          const participantA = a.participants?.find(p => {
            const participantId = p._id || p.id;
            const currentUserId = currentUser?._id || currentUser?.id;
            return String(participantId) !== String(currentUserId);
          });
          const participantB = b.participants?.find(p => {
            const participantId = p._id || p.id;
            const currentUserId = currentUser?._id || currentUser?.id;
            return String(participantId) !== String(currentUserId);
          });
          return (participantA?.username || '').localeCompare(participantB?.username || '');
        });
        break;
      case 'recent':
      default:
        // Sort by most recent message activity (use lastMessageAt, not updatedAt)
        filtered = filtered.sort((a, b) => {
          // Use lastMessageAt for sorting (this is the actual message time)
          const aTime = new Date(a.lastMessageAt || 0);
          const bTime = new Date(b.lastMessageAt || 0);
          
          // Handle invalid dates
          const aValid = !isNaN(aTime.getTime()) ? aTime : new Date(0);
          const bValid = !isNaN(bTime.getTime()) ? bTime : new Date(0);
          
          return bValid - aValid;
        });
        break;
    }
    
    return filtered;
  };

  // Auto-select first chat when rooms load
  useEffect(() => {
    if (chatRooms.length > 0 && !selectedChatId) {
      setSelectedChatId(chatRooms[0]._id || chatRooms[0].id);
    }
  }, [chatRooms, selectedChatId, setSelectedChatId]);

  // Handle opening chat from external trigger
  useEffect(() => {
    if (shouldOpenChat && chatRooms.length > 0) {
      if (selectedChatId) {
        console.log('Opening chat with ID:', selectedChatId);
      } else {
        setSelectedChatId(chatRooms[0]._id || chatRooms[0].id);
      }
    }
  }, [shouldOpenChat, chatRooms, selectedChatId, setSelectedChatId]);

  // Mark messages as read when chat room is selected
  useEffect(() => {
    if (selectedChatId) {
      markAsRead(selectedChatId);
    }
  }, [selectedChatId, markAsRead]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Close sort menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSortMenu && !event.target.closest('.sort-menu-container')) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSortMenu]);

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    // Validate message
    if (!trimmedMessage || !selectedChatId || sendingMessage) return;

    if (trimmedMessage.length > 1000) {
      alert('Message is too long. Maximum 1000 characters allowed.');
      return;
    }

    try {
      await sendMessage({
        chatRoomId: selectedChatId,
        messageType: 'text',
        content: { text: trimmedMessage }
      }).unwrap();

      setMessage('');
      // Refetch both messages and chat rooms to update the UI
      refetchMessages();
      refetchRooms();
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMsg = error?.data?.message || error?.message || 'Failed to send message';
      alert(`${errorMsg}. Please try again.`);
    }
  };

  if (!isChatOpen) return null;

  // Show login prompt if not authenticated
  if (!isLoggedIn) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50"
        onClick={closeChat}
      >
        <div 
          className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold mb-4">Login Required</h3>
          <p className="text-gray-600 mb-6">Please log in to use the chat feature.</p>
          <button
            onClick={closeChat}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={closeChat}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl h-[600px] flex overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Panel - Chat List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-orange-500">
                Chat {getTotalUnreadCount() > 0 && <span className="text-black text-sm">({getTotalUnreadCount()})</span>}
              </h2>
              <div className="relative sort-menu-container">
                <button 
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                {showSortMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10">
                    <button
                      onClick={() => {
                        setSortBy('recent');
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        sortBy === 'recent' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                      }`}
                    >
                      📅 Most Recent
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('unread');
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        sortBy === 'unread' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                      }`}
                    >
                      🔔 Unread First
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('alphabetical');
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        sortBy === 'alphabetical' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                      }`}
                    >
                      🔤 A-Z
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search...."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button className="absolute right-0.5 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#102F76' }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingRooms ? (
              <div className="p-4 space-y-4">
                {/* Loading skeleton for chat list */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredChatRooms().length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4">
                  <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium mb-1">
                  {searchQuery ? 'No chats found' : 'No conversations yet'}
                </p>
                <p className="text-gray-400 text-sm">
                  {searchQuery ? 'Try a different search term' : 'Start chatting with sellers!'}
                </p>
              </div>
            ) : (
              <div className="p-2">
                {filteredChatRooms().map((chat) => {
                  const chatId = chat._id || chat.id;
                  const otherParticipant = chat.participants?.find(p => {
                    const participantId = p._id || p.id;
                    const currentUserId = currentUser?._id || currentUser?.id;
                    // Convert both to strings for comparison to handle ObjectId vs string mismatches
                    return String(participantId) !== String(currentUserId);
                  });
                  const isSelected = chatId === selectedChatId;
                  
                  if (!otherParticipant) {
                    return null;
                  }
                  
                  return (
                    <div 
                      key={chatId}
                      onClick={() => setSelectedChatId(chatId)}
                      className={`rounded-lg p-3 cursor-pointer hover:bg-gray-300 transition-colors ${
                        isSelected ? 'bg-gray-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={otherParticipant.profilePicture || '/default-avatar.png'}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover bg-gray-200"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTI0IDI0QzI3LjMxMzcgMjQgMzAgMjEuMzEzNyAzMCAxOEMzMCAxNC42ODYzIDI3LjMxMzcgMTIgMjQgMTJDMjAuNjg2MyAxMiAxOCAxNC42ODYzIDE4IDE4QzE4IDIxLjMxMzcgMjAuNjg2MyAyNCAyNCAyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI0IDI2QzE5LjU4MTcgMjYgMTYgMjkuNTgxNyAxNiAzNFYzNkgzMlYzNEMzMiAyOS41ODE3IDI4LjQxODMgMjYgMjQgMjZaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-black truncate">{otherParticipant.username}</h3>
                            {otherParticipant.isOnline && (
                              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" title="Online"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {typeof chat.lastMessage === 'string'
                              ? chat.lastMessage
                              : chat.lastMessage?.content?.text ||
                                chat.lastMessage?.message ||
                                chat.lastMessage?.text ||
                                'No messages yet'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500">
                            {(() => {
                              // Use lastMessageAt (top-level field) since lastMessage is just a string
                              const timeField = chat.lastMessageAt;
                              
                              if (!timeField) return '';
                              
                              const messageTime = new Date(timeField);
                              if (isNaN(messageTime.getTime())) return '';
                              
                              const now = new Date();
                              const diffInHours = (now - messageTime) / (1000 * 60 * 60);
                              
                              if (diffInHours < 24) {
                                // Show time if less than 24 hours
                                return messageTime.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                });
                              } else {
                                // Show date if more than 24 hours
                                return messageTime.toLocaleDateString([], { 
                                  month: 'short', 
                                  day: 'numeric' 
                                });
                              }
                            })()}
                          </span>
                          {chat.unreadCount > 0 && (
                            <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Conversation */}
        <div className="w-2/3 flex flex-col" style={{ backgroundColor: '#f8f8f8' }}>
          {selectedChatId && getCurrentChat() ? (
            <>
              {/* Chat Header - Fixed */}
              <div className="p-4 flex-shrink-0">
                <div className="rounded-lg p-3 border border-gray-200 bg-white">
                  {(() => {
                    const currentChat = getCurrentChat();
                    const otherParticipant = currentChat?.participants?.find(p => {
                      const participantId = p._id || p.id;
                      const currentUserId = currentUser?._id || currentUser?.id;
                      return String(participantId) !== String(currentUserId);
                    });
                    
                    if (!otherParticipant) return null;
                    
                    return (
                      <div className="flex items-center space-x-3">
                        <img
                          src={otherParticipant.profilePicture || '/default-avatar.png'}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover bg-gray-200"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuMjM4NiAyMCAyMCAyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDIyQzE2LjY4NjMgMjIgMTQgMjQuNjg2MyAxNCAyOFYzMEgyNlYyOEMyNiAyNC42ODYzIDIzLjMxMzcgMjIgMjAgMjJaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                          }}
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-black">{otherParticipant.username}</h3>
                            <span className={`w-2 h-2 rounded-full ${otherParticipant.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} title={otherParticipant.isOnline ? 'Online' : 'Offline'}></span>
                          </div>
                          <p className={`text-sm ${otherParticipant.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                            {otherParticipant.isOnline ? 'Active now' : otherParticipant.lastSeen ? `Last seen ${new Date(otherParticipant.lastSeen).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}` : 'Offline'}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Messages Area - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4"
              >
                {isLoadingMessages ? (
                  <div className="space-y-4">
                    {/* Loading skeleton */}
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <div className="bg-gray-200 rounded-2xl px-4 py-3 max-w-xs animate-pulse">
                          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : getCurrentChatMessages().length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="mb-4">
                      <svg className="w-20 h-20 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No messages yet</p>
                    <p className="text-gray-400 text-sm mt-1">Start the conversation!</p>
                  </div>
                ) : (
                  <>
                    {/* Messages grouped by date */}
                    {groupMessagesByDate(getCurrentChatMessages()).map((group, groupIndex) => (
                      <div key={groupIndex} className="space-y-3 mb-6">
                        {/* Date Separator */}
                        <div className="flex justify-center mb-6">
                          <span className="bg-gray-200 text-black px-3 py-1 rounded-full text-xs font-bold">
                            {getDateLabel(group.messages[0].createdAt)}
                          </span>
                        </div>

                        {/* Messages for this date */}
                        {group.messages.map((msg, msgIndex) => {
                      // Extract sender ID (handles object or string)
                      let messageSenderId;
                      if (typeof msg.senderId === 'object' && msg.senderId !== null) {
                        messageSenderId = msg.senderId._id || msg.senderId.id;
                      } else if (typeof msg.sender === 'object' && msg.sender !== null) {
                        messageSenderId = msg.sender._id || msg.sender.id;
                      } else {
                        messageSenderId = msg.senderId || msg.sender;
                      }

                      const currentUserId = currentUser?._id || currentUser?.id;
                      const isCurrentUser = messageSenderId === currentUserId ||
                                          String(messageSenderId) === String(currentUserId);

                      const previousMsg = msgIndex > 0 ? group.messages[msgIndex - 1] : null;
                      const isGrouped = shouldGroupWithPrevious(msg, previousMsg, msgIndex);

                      return (
                        <div
                          key={msg._id || msg.id}
                          className={`flex ${msg.messageType === 'product' ? 'justify-center' : isCurrentUser ? 'justify-end' : 'justify-start'} ${isGrouped ? 'mt-1' : ''}`}
                        >
                          {msg.messageType === 'product' ? (
                            <div className="rounded-2xl p-4 max-w-sm shadow-lg" style={{ backgroundColor: '#007A3F' }}>
                              <div className="flex space-x-3">
                                <img
                                  src={msg.content?.product?.image || bangusImage}
                                  alt={msg.content?.product?.name || 'Product'}
                                  className="w-20 h-24 rounded-lg object-cover"
                                />
                                <div className="text-white flex flex-col justify-between">
                                  <div>
                                    <h4 className="font-bold text-lg">{msg.content?.product?.name || 'Product'}</h4>
                                    <p className="text-xs opacity-90">{msg.content?.product?.description || ''}</p>
                                  </div>
                                  <p className="font-bold text-lg mt-1">{msg.content?.product?.price || ''}</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`rounded-2xl px-4 py-3 max-w-xs shadow-lg transition-opacity ${
                                isCurrentUser
                                  ? 'bg-blue-500 text-white'
                                  : msg.isRead
                                    ? 'bg-white border border-gray-300 text-black'
                                    : 'bg-gray-50 border border-gray-400 text-black font-semibold'
                              } ${isGrouped ? 'shadow-sm' : ''}`}
                            >
                              <p className="leading-relaxed">{msg.content?.text || msg.message || ''}</p>
                              {!isGrouped && (
                                <div className="flex items-center justify-between mt-2">
                                  <span className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  {isCurrentUser && (
                                    <span className="text-xs ml-2">
                                      {msg.isRead ? (
                                        <span className="text-blue-100" title="Seen">
                                          ✓✓
                                        </span>
                                      ) : (
                                        <span className="text-blue-200" title="Delivered">
                                          ✓
                                        </span>
                                      )}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input - Fixed */}
              <div className="p-4 flex-shrink-0">
                <div className="rounded-lg p-3 border border-gray-200 bg-white">
                  {message.length > 900 && (
                    <div className="mb-2 text-right">
                      <span className={`text-xs ${message.length > 1000 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                        {message.length}/1000
                      </span>
                    </div>
                  )}
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={sendingMessage ? "Sending..." : "Type a message"}
                      disabled={sendingMessage}
                      maxLength={1000}
                      className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm ${
                        message ? 'text-left' : 'text-center'
                      } ${sendingMessage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    <button
                      type="submit"
                      disabled={sendingMessage || !message.trim()}
                      className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={sendingMessage ? "Sending..." : "Send message"}
                    >
                      {sendingMessage ? (
                        <svg className="w-6 h-6 text-orange-500 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 rotate-90 text-orange-500" fill="currentColor" stroke="white" strokeWidth="1" viewBox="0 0 24 24">
                          <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
