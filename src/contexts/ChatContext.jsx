import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [shouldOpenChat, setShouldOpenChat] = useState(false);

  const openChat = (chatId = null) => {
    setSelectedChatId(chatId);
    setIsChatOpen(true);
    setShouldOpenChat(false);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedChatId(null);
    setShouldOpenChat(false);
  };

  const triggerChatOpen = (chatId = null) => {
    setSelectedChatId(chatId);
    setShouldOpenChat(true);
  };

  const value = {
    isChatOpen,
    selectedChatId,
    shouldOpenChat,
    openChat,
    closeChat,
    triggerChatOpen,
    setIsChatOpen,
    setSelectedChatId
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

