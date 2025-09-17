import { useState } from 'react';
import bangusImage from '../assets/images/bangus.png';
import fisherManImage from '../assets/images/fisher_man.png';

// Mock user data - replace with real user context later
const currentUser = {
  id: 'user_1',
  username: 'You',
  profilePicture: null
};

const mockUsers = {
  'user_2': {
    id: 'user_2',
    username: 'Juan Dela Cruz',
    profilePicture: fisherManImage,
    isOnline: true
  }
};

// Mock chat rooms data
const mockChatRooms = [
  {
    id: 'chat_1',
    participants: ['user_1', 'user_2'],
    lastMessage: 'Hello!',
    unreadCount: { 'user_1': 1 },
    updatedAt: new Date()
  }
];

const ChatPopup = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [selectedChatId, setSelectedChatId] = useState('chat_1');
  const [messages, setMessages] = useState([
    {
      id: 'msg_1',
      chatRoomId: 'chat_1',
      senderId: 'user_2',
      messageType: 'product',
      content: {
        product: {
          productId: 'prod_1',
          name: 'Bangus',
          description: 'Fresh Chilled Milkfish All Sizes',
          price: '₱289/kg',
          image: bangusImage
        }
      },
      timestamp: new Date(),
      readBy: ['user_1']
    },
    {
      id: 'msg_2',
      chatRoomId: 'chat_1',
      senderId: 'user_1',
      messageType: 'text',
      content: {
        text: 'Hi :)'
      },
      timestamp: new Date(),
      readBy: ['user_1', 'user_2']
    },
    {
      id: 'msg_3',
      chatRoomId: 'chat_1',
      senderId: 'user_2',
      messageType: 'text',
      content: {
        text: 'Hello!'
      },
      timestamp: new Date(),
      readBy: ['user_1', 'user_2']
    }
  ]);

  // Helper functions
  const getSenderInfo = (senderId) => {
    return senderId === currentUser.id ? currentUser : mockUsers[senderId];
  };

  const getCurrentChat = () => {
    return mockChatRooms.find(chat => chat.id === selectedChatId);
  };

  const getCurrentChatMessages = () => {
    return messages.filter(msg => msg.chatRoomId === selectedChatId);
  };

  const getTotalUnreadCount = () => {
    return mockChatRooms.reduce((total, chat) => {
      return total + (chat.unreadCount[currentUser.id] || 0);
    }, 0);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: `msg_${Date.now()}`,
        chatRoomId: selectedChatId,
        senderId: currentUser.id,
        messageType: 'text',
        content: {
          text: message
        },
        timestamp: new Date(),
        readBy: [currentUser.id]
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // TODO: Send to backend API
      // await sendMessageAPI(newMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
       <div 
         className="bg-white rounded-2xl w-full max-w-4xl h-[600px] flex overflow-hidden shadow-2xl"
         style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 1.0)' }}
         onClick={(e) => e.stopPropagation()}
       >
         {/* Left Panel - Chat List */}
         <div className="w-1/3 border-r border-gray-200 flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-orange-500">Chat <span className="text-black text-sm">({getTotalUnreadCount()})</span></h2>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search...."
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
            <div className="p-2">
              {mockChatRooms.map((chat) => {
                const otherParticipantId = chat.participants.find(id => id !== currentUser.id);
                const otherUser = mockUsers[otherParticipantId];
                const isSelected = chat.id === selectedChatId;
                
                return (
                  <div 
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={`rounded-lg p-3 cursor-pointer hover:bg-gray-300 transition-colors ${
                      isSelected ? 'bg-gray-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={otherUser.profilePicture}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-black truncate">{otherUser.username}</h3>
                          <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500">Today</span>
                        {chat.unreadCount[currentUser.id] > 0 && (
                          <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1">
                            {chat.unreadCount[currentUser.id]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel - Conversation */}
        <div className="w-2/3 flex flex-col" style={{ backgroundColor: '#f8f8f8' }}>
          {/* Chat Header - Fixed */}
          <div className="p-4 flex-shrink-0">
            <div className="rounded-lg p-3 border border-gray-200 bg-white">
            {(() => {
              const currentChat = getCurrentChat();
              const otherParticipantId = currentChat.participants.find(id => id !== currentUser.id);
              const otherUser = mockUsers[otherParticipantId];
              
              return (
                <div className="flex items-center space-x-3">
                  <img
                    src={otherUser.profilePicture}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-black">{otherUser.username}</h3>
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm text-green-500">• {otherUser.isOnline ? 'Active' : 'Offline'}</p>
                  </div>
                </div>
              );
            })()}
            </div>
          </div>

          {/* Messages Area - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Date Separator */}
            <div className="flex justify-center">
              <span className="bg-gray-200 text-black px-3 py-1 rounded-full text-xs font-bold">
                TODAY
              </span>
            </div>

            {/* Messages */}
            {getCurrentChatMessages().map((msg) => {
              const sender = getSenderInfo(msg.senderId);
              const isCurrentUser = msg.senderId === currentUser.id;
              
              return (
                <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : msg.messageType === 'product' ? 'justify-center' : 'justify-start'}`}>
                   {msg.messageType === 'product' ? (
                     <div className="rounded-2xl p-4 max-w-sm shadow-lg" style={{ backgroundColor: '#007A3F' }}>
                       <div className="flex space-x-3">
                         <img
                           src={msg.content.product.image}
                           alt={msg.content.product.name}
                           className="w-20 h-24 rounded-lg object-cover"
                         />
                         <div className="text-white flex flex-col justify-between">
                           <div>
                             <h4 className="font-bold text-lg">{msg.content.product.name}</h4>
                             <p className="text-xs opacity-90">{msg.content.product.description}</p>
                           </div>
                           <p className="font-bold text-lg mt-1">{msg.content.product.price}</p>
                         </div>
                       </div>
                     </div>
                   ) : (
                     <div
                       className={`rounded-2xl px-4 py-2 max-w-xs shadow-lg ${
                         isCurrentUser
                           ? 'bg-blue-500 text-white'
                           : 'bg-white border border-gray-300 text-black'
                       }`}
                     >
                       <p>{msg.content.text}</p>
                     </div>
                   )}
                </div>
              );
            })}
          </div>

          {/* Message Input - Fixed */}
          <div className="p-4 flex-shrink-0">
            <div className="rounded-lg p-3 border border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
               <input
                 type="text"
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 placeholder="Type a message"
                 className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm ${
                   message ? 'text-left' : 'text-center'
                 }`}
               />
               <button
                 type="submit"
                 className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
               >
                 <svg className="w-8 h-8 rotate-90 text-orange-500" fill="currentColor" stroke="white" strokeWidth="1" viewBox="0 0 24 24">
                   <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                 </svg>
               </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
