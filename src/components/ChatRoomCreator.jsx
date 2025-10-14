import { useState } from 'react';
import { useCreateOrGetChatRoomMutation, useSendMessageMutation } from '../services/api';
import toast from 'react-hot-toast';

export const useChatRoomCreator = () => {
  const [createOrGetChatRoom, { isLoading }] = useCreateOrGetChatRoomMutation();
  const [sendMessage] = useSendMessageMutation();

  const startChat = async (participantId, productInfo = null) => {
    try {
      const result = await createOrGetChatRoom(participantId).unwrap();
      
      // If product info is provided, send it as the first message
      if (productInfo && result) {
        try {
          await sendMessage({
            chatRoomId: result._id || result.id,
            messageType: 'product',
            content: {
              product: {
                productId: productInfo.id || productInfo._id,
                name: productInfo.name || productInfo.itemName,
                description: productInfo.description,
                price: productInfo.price || productInfo.itemPrice,
                image: productInfo.image || productInfo.imageUrl
              }
            }
          }).unwrap();
        } catch (messageError) {
          console.error('Failed to send product message:', messageError);
          // Don't show error to user, just log it
        }
      }
      
      toast.success('Chat started successfully!');
      return result;
    } catch (error) {
      let errorMessage = 'Failed to start chat. Please try again.';
      
      if (error?.status === 500) {
        errorMessage = `Server error: ${error?.data?.message || 'Please try again later.'}`;
      } else if (error?.status === 401) {
        errorMessage = 'Please log in to start a chat.';
      } else if (error?.status === 404) {
        errorMessage = 'User not found. Please check the user ID.';
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    startChat,
    isCreatingChat: isLoading
  };
};

const ChatRoomCreator = ({ participantId, participantName, onChatStarted, children }) => {
  const { startChat, isCreatingChat } = useChatRoomCreator();
  const [isOpen, setIsOpen] = useState(false);

  const handleStartChat = async () => {
    try {
      const chatRoom = await startChat(participantId);
      setIsOpen(false);
      if (onChatStarted) {
        onChatStarted(chatRoom);
      }
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  if (children) {
    return (
      <button
        onClick={handleStartChat}
        disabled={isCreatingChat}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {children}
      </button>
    );
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Start Chat
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3>Start Chat with {participantName}</h3>
            <p>Are you sure you want to start a conversation?</p>
            <button onClick={handleStartChat} disabled={isCreatingChat}>
              {isCreatingChat ? 'Starting...' : 'Start Chat'}
            </button>
            <button onClick={() => setIsOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatRoomCreator;

