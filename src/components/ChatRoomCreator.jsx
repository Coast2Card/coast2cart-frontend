import { useState } from "react";
import {
  useCreateOrGetChatRoomMutation,
  useAddChatTransactionMutation,
} from "../services/api";
import toast from "react-hot-toast";

export const useChatRoomCreator = () => {
  const [createOrGetChatRoom, { isLoading }] = useCreateOrGetChatRoomMutation();
  const [addChatTransaction] = useAddChatTransactionMutation();

  const startChat = async (participantId, productInfo = null) => {
    try {
      console.log("=== CHAT CREATION DEBUG ===");
      console.log("Starting chat with seller:", { participantId, productInfo });
      
      // If product info is provided, include it in the chat room creation
      // This will create the first transaction automatically
      const payload = { 
        participantId,
      };
      
      // Add itemId and quantity if productInfo is provided
      if (productInfo) {
        payload.itemId = productInfo.id || productInfo._id;
        // Ensure we use the correct quantity (selected quantity, not available quantity)
        const selectedQuantity = Number(productInfo.quantity) || 1;
        payload.quantity = selectedQuantity;
        
        console.log("📦 Creating transaction with:", {
          itemId: payload.itemId,
          quantity: payload.quantity,
          selectedQuantity: selectedQuantity,
          productInfo: productInfo
        });
      }
      
      console.log("🚀 Sending payload to backend:", payload);
      console.log("📊 Payload details:", {
        participantId: payload.participantId,
        itemId: payload.itemId,
        quantity: payload.quantity,
        payloadKeys: Object.keys(payload),
        payloadSize: JSON.stringify(payload).length
      });
      
      const result = await createOrGetChatRoom(payload).unwrap();
      
      console.log("✅ Chat room result:", result);
      console.log("🔍 Result analysis:", {
        isNewChatRoom: result.isNewChatRoom,
        hasTransaction: !!result.transaction,
        transactionDetails: result.transaction ? {
          id: result.transaction._id || result.transaction.id,
          quantity: result.transaction.quantity,
          itemId: result.transaction.itemId,
          status: result.transaction.status
        } : null,
        chatRoomId: result.chatRoom?._id || result.chatRoom?.id || result._id || result.id
      });

      // If this is an existing chat room and we have product info, add a new transaction
      if (productInfo && result.isNewChatRoom === false && result.chatRoom) {
        try {
          console.log("➕ Adding transaction to existing chat room");
          const selectedQuantity = Number(productInfo.quantity) || 1;
          
          console.log("📦 Adding transaction with:", {
            chatRoomId: result.chatRoom._id || result.chatRoom.id,
            itemId: productInfo.id || productInfo._id,
            quantity: selectedQuantity
          });
          
          await addChatTransaction({
            chatRoomId: result.chatRoom._id || result.chatRoom.id,
            itemId: productInfo.id || productInfo._id,
            quantity: selectedQuantity,
          }).unwrap();
          console.log("✅ Transaction added successfully");
        } catch (transactionError) {
          console.error("❌ Failed to add transaction:", transactionError);
          // Continue even if transaction fails
        }
      }

      console.log("=== END CHAT CREATION DEBUG ===");
      
      toast.success(
        result.isNewChatRoom 
          ? "Chat started successfully!" 
          : productInfo 
            ? "Product added to existing chat!"
            : "Chat opened successfully!"
      );
      
      // Return the chat room for navigation
      return result.chatRoom || result;
    } catch (error) {
      console.error("❌ Chat creation error:", error);
      let errorMessage = "Failed to start chat. Please try again.";

      if (error?.status === 500) {
        errorMessage = `Server error: ${
          error?.data?.message || "Please try again later."
        }`;
      } else if (error?.status === 401) {
        // Don't show toast for auth errors - let the StartChatButton handle it with modal
        throw error;
      } else if (error?.status === 404) {
        errorMessage = "User not found. Please check the user ID.";
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    startChat,
    isCreatingChat: isLoading,
  };
};

const ChatRoomCreator = ({
  participantId,
  participantName,
  onChatStarted,
  children,
}) => {
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
      <button onClick={() => setIsOpen(true)}>Start Chat</button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3>Start Chat with {participantName}</h3>
            <p>Are you sure you want to start a conversation?</p>
            <button onClick={handleStartChat} disabled={isCreatingChat}>
              {isCreatingChat ? "Starting..." : "Start Chat"}
            </button>
            <button onClick={() => setIsOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatRoomCreator;
