import { useState, useEffect, useRef } from "react";
import {
  useGetChatRoomsQuery,
  useGetChatMessagesQuery,
  useGetChatTransactionsQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
  useMarkTransactionAsSoldMutation,
} from "../services/api";
import { useChatContext } from "../contexts/ChatContext";
import LoginRequiredModal from "../modals/LoginRequiredModal";
import bangusImage from "../assets/images/bangus.png";

const ChatPopup = () => {
  const {
    isChatOpen,
    closeChat,
    selectedChatId,
    setSelectedChatId,
    shouldOpenChat,
  } = useChatContext();
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // 'recent', 'unread', 'alphabetical'
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
  const {
    data: chatRooms = [],
    isLoading: isLoadingRooms,
    refetch: refetchRooms,
  } = useGetChatRoomsQuery(undefined, {
    skip: !isLoggedIn,
    // Refetch every 5 seconds to keep chat list updated
    pollingInterval: 5000,
  });


  // Fetch messages for selected chat
  const {
    data: chatMessages,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useGetChatMessagesQuery(
    { chatRoomId: selectedChatId, page: 1, limit: 50 },
    { skip: !selectedChatId }
  );

  // Fetch transactions for selected chat
  const {
    data: chatTransactions,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useGetChatTransactionsQuery(selectedChatId, {
    skip: !selectedChatId,
    pollingInterval: 5000, // Refresh every 5 seconds
  });

  // Debug: Log transactions to identify duplicates
  useEffect(() => {
    if (chatTransactions && chatTransactions.length > 0) {
      console.log("Chat Transactions Debug:", {
        chatRoomId: selectedChatId,
        transactions: chatTransactions,
        transactionCount: chatTransactions.length,
        transactionIds: chatTransactions.map(t => t._id || t.id),
        duplicateCheck: chatTransactions.reduce((acc, t) => {
          const id = t._id || t.id;
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {})
      });
    }
  }, [chatTransactions, selectedChatId]);

  // Mutations
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
  const [markAsRead] = useMarkMessagesAsReadMutation();
  const [markTransactionAsSold, { isLoading: markingAsSold }] = useMarkTransactionAsSoldMutation();

  // State for selected transaction to mark as sold
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  // State for toggling transactions visibility
  const [showTransactions, setShowTransactions] = useState(true);
  
  // Reset transactions visibility when switching chat rooms
  useEffect(() => {
    setShowTransactions(true);
  }, [selectedChatId]);

  // Helper functions
  const getSenderInfo = (senderId) => {
    if (senderId === currentUser?._id || senderId === currentUser?.id) {
      return currentUser;
    }
    const currentChat = getCurrentChat();
    if (currentChat?.participants) {
      const participant = currentChat.participants.find(
        (p) => p._id === senderId || p.id === senderId
      );
      return participant || { username: "Unknown User", profilePicture: null };
    }
    return { username: "Unknown User", profilePicture: null };
  };

  const getCurrentChat = () => {
    return chatRooms.find((chat) => (chat._id || chat.id) === selectedChatId);
  };

  // Helper function to get unique transactions count
  const getUniqueTransactionsCount = () => {
    if (!chatTransactions || chatTransactions.length === 0) return 0;
    
    return chatTransactions.reduce((acc, transaction) => {
      const id = transaction._id || transaction.id;
      const itemId = transaction.itemId?._id || transaction.itemId?.id || transaction.itemId;
      const quantity = transaction.quantity;
      const status = transaction.status;
      
      // Check by transaction ID first
      if (!acc.find(t => (t._id || t.id) === id)) {
        // Then check for duplicate item+quantity+status combinations
        const isDuplicateItem = acc.find(t => {
          const tItemId = t.itemId?._id || t.itemId?.id || t.itemId;
          return tItemId === itemId && 
                 t.quantity === quantity && 
                 t.status === status &&
                 !t.markedSoldAt && // Don't dedupe sold items
                 !transaction.markedSoldAt;
        });
        
        if (!isDuplicateItem) {
          acc.push(transaction);
        }
      }
      return acc;
    }, []).length;
  };

  const getCurrentChatMessages = () => {
    return chatMessages?.messages || [];
  };

  const getTotalUnreadCount = () => {
    return chatRooms.reduce((total, chat) => {
      return total + (chat.unreadCount || 0);
    }, 0);
  };

  // Helper function to get the count of displayable chats (with valid participants)
  const getDisplayableChatsCount = () => {
    return filteredChatRooms().filter(chat => {
      const otherParticipant = chat.participants?.find((p) => {
        const participantId = p._id || p.id;
        const currentUserId = currentUser?._id || currentUser?.id;
        return String(participantId) !== String(currentUserId);
      });
      return otherParticipant;
    }).length;
  };

  const filteredChatRooms = () => {
    // Create a copy of the array to avoid mutating the original
    let filtered = [...chatRooms];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((chat) => {
        const participant = chat.participants?.find((p) => {
          const participantId = p._id || p.id;
          const currentUserId = currentUser?._id || currentUser?.id;
          return String(participantId) !== String(currentUserId);
        });
        return participant?.username
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
    }

    // Sort by selected option
    switch (sortBy) {
      case "unread":
        filtered = filtered.sort(
          (a, b) => (b.unreadCount || 0) - (a.unreadCount || 0)
        );
        break;
      case "alphabetical":
        filtered = filtered.sort((a, b) => {
          const participantA = a.participants?.find((p) => {
            const participantId = p._id || p.id;
            const currentUserId = currentUser?._id || currentUser?.id;
            return String(participantId) !== String(currentUserId);
          });
          const participantB = b.participants?.find((p) => {
            const participantId = p._id || p.id;
            const currentUserId = currentUser?._id || currentUser?.id;
            return String(participantId) !== String(currentUserId);
          });
          return (participantA?.username || "").localeCompare(
            participantB?.username || ""
          );
        });
        break;
      case "recent":
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
        console.log("Opening chat with ID:", selectedChatId);
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Close sort menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSortMenu && !event.target.closest(".sort-menu-container")) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSortMenu]);

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedChatId && !sendingMessage) {
      try {
        const result = await sendMessage({
          chatRoomId: selectedChatId,
          messageType: "text",
          content: { text: message },
        }).unwrap();

        setMessage("");
        // Refetch both messages and chat rooms to update the UI
        refetchMessages();
        refetchRooms();
      } catch (error) {
        console.error("Failed to send message:", error);
        alert(
          `Failed to send message: ${error?.data?.message || "Unknown error"}`
        );
      }
    }
  };

  // Handle mark transaction as sold
  const handleMarkTransactionAsSold = async (transaction) => {
    if (!transaction?._id && !transaction?.id) {
      alert("Invalid transaction");
      return;
    }

    if (!selectedChatId) {
      alert("No chat room selected");
      return;
    }

    try {
      const transactionId = transaction._id || transaction.id;
      
      const result = await markTransactionAsSold({
        chatRoomId: selectedChatId,
        transactionId: transactionId,
      }).unwrap();

      console.log("Mark as sold result:", result);
      
      alert(`Transaction marked as sold! Stock updated to ${result.updatedStock || 'updated'}`);
      
      // Refetch transactions and chat rooms to update UI
      refetchTransactions();
      refetchRooms();
      setSelectedTransaction(null);
    } catch (error) {
      console.error("Failed to mark transaction as sold:", error);
      alert(
        `Failed to mark as sold: ${error?.data?.message || error?.message || "Unknown error"}`
      );
    }
  };


  if (!isChatOpen) return null;

  // Show login prompt if not authenticated
  if (!isLoggedIn) {
    return (
      <LoginRequiredModal
        isOpen={isChatOpen}
        onClose={closeChat}
        message="Please log in to use the chat feature."
      />
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
                Chat{" "}
                <span className="text-black text-sm">
                  ({getDisplayableChatsCount()})
                </span>
              </h2>
              <div className="relative sort-menu-container">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                {showSortMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10">
                    <button
                      onClick={() => {
                        setSortBy("recent");
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        sortBy === "recent"
                          ? "bg-orange-50 text-orange-600"
                          : "text-gray-700"
                      }`}
                    >
                      📅 Most Recent
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("unread");
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        sortBy === "unread"
                          ? "bg-orange-50 text-orange-600"
                          : "text-gray-700"
                      }`}
                    >
                      🔔 Unread First
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("alphabetical");
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        sortBy === "alphabetical"
                          ? "bg-orange-50 text-orange-600"
                          : "text-gray-700"
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
              <button
                className="absolute right-0.5 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#102F76" }}
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingRooms ? (
              <div className="p-4 text-center text-gray-500">
                Loading chats...
              </div>
            ) : filteredChatRooms().length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No chats found
              </div>
            ) : (
              <div className="p-2">
                {filteredChatRooms().map((chat) => {
                  const chatId = chat._id || chat.id;
                  const otherParticipant = chat.participants?.find((p) => {
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
                        isSelected ? "bg-gray-200" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            otherParticipant.profilePicture ||
                            "/default-avatar.png"
                          }
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover bg-gray-200"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTI0IDI0QzI3LjMxMzcgMjQgMzAgMjEuMzEzNyAzMCAxOEMzMCAxNC42ODYzIDI3LjMxMzcgMTIgMjQgMTJDMjAuNjg2MyAxMiAxOCAxNC42ODYzIDE4IDE4QzE4IDIxLjMxMzcgMjAuNjg2MyAyNCAyNCAyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI0IDI2QzE5LjU4MTcgMjYgMTYgMjkuNTgxNyAxNiAzNFYzNkgzMlYzNEMzMiAyOS41ODE3IDI4LjQxODMgMjYgMjQgMjZaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-black truncate">
                              {otherParticipant.username}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {typeof chat.lastMessage === "string"
                              ? chat.lastMessage
                              : chat.lastMessage?.content?.text ||
                                chat.lastMessage?.message ||
                                chat.lastMessage?.text ||
                                "No messages yet"}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500">
                            {(() => {
                              // Use lastMessageAt (top-level field) since lastMessage is just a string
                              const timeField = chat.lastMessageAt;

                              if (!timeField) return "";

                              const messageTime = new Date(timeField);
                              if (isNaN(messageTime.getTime())) return "";

                              const now = new Date();
                              const diffInHours =
                                (now - messageTime) / (1000 * 60 * 60);

                              if (diffInHours < 24) {
                                // Show time if less than 24 hours
                                return messageTime.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                });
                              } else {
                                // Show date if more than 24 hours
                                return messageTime.toLocaleDateString([], {
                                  month: "short",
                                  day: "numeric",
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
        <div
          className="w-2/3 flex flex-col"
          style={{ backgroundColor: "#f8f8f8" }}
        >
          {selectedChatId && getCurrentChat() ? (
            <>
              {/* Chat Header - Fixed */}
              <div className="p-4 flex-shrink-0">
                <div className="rounded-lg p-3 border border-gray-200 bg-white">
                  {(() => {
                    const currentChat = getCurrentChat();
                    const otherParticipant = currentChat?.participants?.find(
                      (p) => {
                        const participantId = p._id || p.id;
                        const currentUserId =
                          currentUser?._id || currentUser?.id;
                        return String(participantId) !== String(currentUserId);
                      }
                    );

                    if (!otherParticipant) return null;

                    const isSeller = currentUser?.role === "seller";
                    const isBuyer = currentUser?.role === "buyer";

                    return (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              otherParticipant.profilePicture ||
                              "/default-avatar.png"
                            }
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover bg-gray-200"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuMjM4NiAyMCAyMCAyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDIyQzE2LjY4NjMgMjIgMTQgMjQuNjg2MyAxNCAyOFYzMEgyNlYyOEMyNiAyNC42ODYzIDIzLjMxMzcgMjIgMjAgMjJaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=";
                            }}
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-black">
                                {otherParticipant.username}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-500">
                              {otherParticipant.isOnline
                                ? "• Active"
                                : "• Offline"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>


                {/* Transactions Display with Toggle - Scrollable */}
                {chatTransactions && chatTransactions.length > 0 && (
                  <div className="mt-3 rounded-lg border border-gray-200 bg-white max-h-80 flex flex-col">
                    {/* Transactions Header with Toggle */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-black">
                          Transactions ({getUniqueTransactionsCount()})
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowTransactions(!showTransactions)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <span>{showTransactions ? "Hide" : "Show"}</span>
                          <svg
                            className={`w-4 h-4 transition-transform ${showTransactions ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Transactions Content - Scrollable */}
                    {showTransactions && (
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {(() => {
                          // Enhanced deduplication: by ID and by item+quantity+status
                          const uniqueTransactions = chatTransactions.reduce((acc, transaction) => {
                            const id = transaction._id || transaction.id;
                            const itemId = transaction.itemId?._id || transaction.itemId?.id || transaction.itemId;
                            const quantity = transaction.quantity;
                            const status = transaction.status;
                            
                            // First check by transaction ID
                            if (!acc.find(t => (t._id || t.id) === id)) {
                              // Then check for duplicate item+quantity+status combinations
                              const isDuplicateItem = acc.find(t => {
                                const tItemId = t.itemId?._id || t.itemId?.id || t.itemId;
                                return tItemId === itemId && 
                                       t.quantity === quantity && 
                                       t.status === status &&
                                       !t.markedSoldAt && // Don't dedupe sold items
                                       !transaction.markedSoldAt;
                              });
                              
                              if (!isDuplicateItem) {
                                acc.push(transaction);
                              } else {
                                console.log("🚫 Filtering duplicate transaction:", {
                                  itemId,
                                  quantity,
                                  status,
                                  transactionId: id
                                });
                              }
                            }
                            return acc;
                          }, []);
                          
                          console.log("🔍 Enhanced deduplication results:", {
                            original: chatTransactions.length,
                            unique: uniqueTransactions.length,
                            duplicates: chatTransactions.length - uniqueTransactions.length,
                            transactions: chatTransactions.map(t => ({
                              id: t._id || t.id,
                              itemId: t.itemId?._id || t.itemId?.id || t.itemId,
                              quantity: t.quantity,
                              status: t.status,
                              markedSoldAt: t.markedSoldAt
                            }))
                          });
                          
                          return uniqueTransactions.map((transaction) => {
                            const transactionId = transaction._id || transaction.id;
                            const item = transaction.itemId || {};
                            const status = transaction.status || "pending";
                            const isSold = status === "sold";
                            const isSeller = currentUser?.role === "seller";

                            return (
                              <div
                                key={transactionId}
                                className={`border rounded-lg p-3 ${
                                  isSold ? "bg-gray-100 border-gray-300" : "bg-white border-orange-200"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={item.image || bangusImage}
                                    alt={item.itemName || "Product"}
                                    className="w-16 h-16 rounded object-cover"
                                  />
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-sm">
                                      {item.itemName || "Unknown Item"}
                                    </h5>
                                    <p className="text-xs text-gray-600">
                                      {transaction.quantity} {item.unit || "units"} × ₱
                                      {transaction.priceAtTransaction || item.itemPrice || 0}
                                    </p>
                                    <p className="text-sm font-bold text-green-600">
                                      Total: ₱{transaction.totalPrice || 0}
                                    </p>
                                    {isSold && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        ✅ Sold on {new Date(transaction.markedSoldAt).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                  {isSeller && !isSold && (
                                    <button
                                      onClick={() => handleMarkTransactionAsSold(transaction)}
                                      disabled={markingAsSold}
                                      className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                                    >
                                      {markingAsSold ? "Marking..." : "Mark Sold"}
                                    </button>
                                  )}
                                </div>
                                {!isSold && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    Status: <span className="text-orange-600 font-semibold">PENDING</span>
                                  </div>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Messages Area - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingMessages ? (
                  <div className="text-center text-gray-500">
                    Loading messages...
                  </div>
                ) : getCurrentChatMessages().length === 0 ? (
                  <div className="text-center text-gray-500">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  <>
                    {/* Date Separator */}
                    <div className="flex justify-center">
                      <span className="bg-gray-200 text-black px-3 py-1 rounded-full text-xs font-bold">
                        TODAY
                      </span>
                    </div>

                    {/* Messages */}
                    {getCurrentChatMessages().map((msg) => {
                      // Extract sender ID (handles object or string)
                      let messageSenderId;
                      if (
                        typeof msg.senderId === "object" &&
                        msg.senderId !== null
                      ) {
                        messageSenderId = msg.senderId._id || msg.senderId.id;
                      } else if (
                        typeof msg.sender === "object" &&
                        msg.sender !== null
                      ) {
                        messageSenderId = msg.sender._id || msg.sender.id;
                      } else {
                        messageSenderId = msg.senderId || msg.sender;
                      }

                      const currentUserId = currentUser?._id || currentUser?.id;
                      const isCurrentUser =
                        messageSenderId === currentUserId ||
                        String(messageSenderId) === String(currentUserId);

                      return (
                        <div
                          key={msg._id || msg.id}
                          className={`flex ${
                            msg.messageType === "product"
                              ? "justify-center"
                              : isCurrentUser
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {msg.messageType === "product" ? (
                            <div className="flex flex-col items-center space-y-2">
                              <div className="relative rounded-2xl p-4 max-w-sm shadow-lg bg-green-600">
                                <div className="flex space-x-3">
                                  <img
                                    src={
                                      msg.content?.product?.image || bangusImage
                                    }
                                    alt={msg.content?.product?.name || "Product"}
                                    className="w-20 h-24 rounded-lg object-cover"
                                  />
                                  <div className="flex flex-col justify-between text-white">
                                    <div>
                                      <h4 className="font-bold text-lg">
                                        {msg.content?.product?.name || "Product"}
                                      </h4>
                                      <p className="text-xs opacity-90">
                                        {msg.content?.product?.description || ""}
                                      </p>
                                    </div>
                                    <p className="font-bold text-lg mt-1">
                                      {msg.content?.product?.price || ""}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500">
                                📦 Product inquiry - Check transactions above
                              </p>
                            </div>
                          ) : (
                            <div
                              className={`rounded-2xl px-4 py-2 max-w-xs shadow-lg ${
                                isCurrentUser
                                  ? "bg-blue-500 text-white"
                                  : "bg-white border border-gray-300 text-black"
                              }`}
                            >
                              <p>{msg.content?.text || msg.message || ""}</p>
                              <span
                                className={`text-xs ${
                                  isCurrentUser
                                    ? "text-blue-100"
                                    : "text-gray-500"
                                }`}
                              >
                                {new Date(msg.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input - Fixed */}
              <div className="p-4 flex-shrink-0">
                <div className="rounded-lg p-3 border border-gray-200 bg-white">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message"
                      disabled={sendingMessage}
                      className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm ${
                        message ? "text-left" : "text-center"
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={sendingMessage || !message.trim()}
                      className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <svg
                        className="w-8 h-8 rotate-90 text-orange-500"
                        fill="currentColor"
                        stroke="white"
                        strokeWidth="1"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
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
