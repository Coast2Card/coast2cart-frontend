import React from 'react';
import { useChatRoomCreator } from './ChatRoomCreator';
import { useChatContext } from '../contexts/ChatContext';

const StartChatButton = ({ 
  userId, 
  username, 
  className = "px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors",
  children,
  onChatStarted,
  productInfo // New prop for product details
}) => {
  const { startChat, isCreatingChat } = useChatRoomCreator();
  const { openChat } = useChatContext();

  const handleStartChat = async () => {
    if (!userId) {
      alert('User ID is required to start a chat');
      return;
    }

    try {
      const chatRoom = await startChat(userId, productInfo);
      
      // Automatically open the chat popup with the new chat
      if (chatRoom) {
        openChat(chatRoom._id || chatRoom.id);
      }
      
      if (onChatStarted) {
        onChatStarted(chatRoom);
      }
      return chatRoom;
    } catch (error) {
      console.error('Failed to start chat in StartChatButton:', error);
    }
  };

  if (children) {
    return (
      <button
        onClick={handleStartChat}
        disabled={isCreatingChat}
        className={`${className} ${isCreatingChat ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={handleStartChat}
      disabled={isCreatingChat}
      className={`${className} ${isCreatingChat ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      {isCreatingChat ? 'Starting Chat...' : `Chat with ${username || 'User'}`}
    </button>
  );
};

export default StartChatButton;

