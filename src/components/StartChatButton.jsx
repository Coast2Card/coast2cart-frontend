import React, { useState } from "react";
import { useChatRoomCreator } from "./ChatRoomCreator";
import { useChatContext } from "../contexts/ChatContext";
import LoginRequiredModal from "../modals/LoginRequiredModal";

const StartChatButton = ({
  userId,
  username,
  className = "px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors",
  children,
  onChatStarted,
  productInfo, // New prop for product details
}) => {
  const { startChat, isCreatingChat } = useChatRoomCreator();
  const { openChat } = useChatContext();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartChat = async () => {
    // Prevent multiple rapid clicks
    if (isProcessing || isCreatingChat) {
      console.log("⏳ Already processing, ignoring click");
      return;
    }

    if (!userId) {
      alert("User ID is required to start a chat");
      return;
    }

    // Check if user is logged in
    const isLoggedIn = Boolean(localStorage.getItem("auth_token"));
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    setIsProcessing(true);
    console.log("🚀 StartChatButton: Starting chat with productInfo:", productInfo);

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
      console.error("Failed to start chat in StartChatButton:", error);
      // If it's an auth error, show the login modal
      if (error?.status === 401) {
        setShowLoginModal(true);
      }
    } finally {
      // Reset processing state after a delay to prevent rapid clicks
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    }
  };

  if (children) {
    return (
      <>
        <button
          onClick={handleStartChat}
          disabled={isCreatingChat || isProcessing}
          className={`${className} ${
            (isCreatingChat || isProcessing) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isCreatingChat || isProcessing ? "Processing..." : children}
        </button>
        <LoginRequiredModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          message="Please log in to start a chat with the seller."
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleStartChat}
        disabled={isCreatingChat || isProcessing}
        className={`${className} ${
          (isCreatingChat || isProcessing) ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <svg
          className="w-4 h-4 mr-2 inline"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {isCreatingChat || isProcessing
          ? "Processing..."
          : `Chat with ${username || "User"}`}
      </button>
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Please log in to start a chat with the seller."
      />
    </>
  );
};

export default StartChatButton;
