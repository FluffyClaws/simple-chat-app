import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { addMessageAsync, setCurrentChat } from "./chatSlice";
import { useWebSocketConnection } from "../websocket/websocketService";
import { Message } from "./chatTypes";

export const useChatInitialization = (chatId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const chats = useSelector((state: RootState) => state.chat.chats);

  useEffect(() => {
    if (chatId) {
      const currentChat = chats.find((chat) => chat.id === chatId);
      if (currentChat) {
        dispatch(setCurrentChat(currentChat));
      }
    }
  }, [chatId, chats, dispatch]);
};

export const useChatWebSocket = () => {
  const { connect, disconnect, sendChatMessage, connectionStatus } =
    useWebSocketConnection();

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { sendChatMessage, connectionStatus };
};

export const useSendMessage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentChat = useSelector((state: RootState) => state.chat.currentChat);
  const currentUserId = useSelector(
    (state: RootState) => state.chat.currentUserId
  );
  const { sendChatMessage } = useChatWebSocket();

  return useCallback(
    async (message: string) => {
      if (!currentChat || !message.trim()) {
        throw new Error(
          "Cannot send empty message or chat is not initialized."
        );
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: currentUserId,
        timestamp: Date.now(),
      };

      try {
        await sendChatMessage(currentChat.id, message.trim());
        await dispatch(
          addMessageAsync({ chatId: currentChat.id, message: userMessage })
        ).unwrap();
        return true;
      } catch (error) {
        console.error("Failed to send message:", error);
        throw new Error("Failed to send message. Please try again.");
      }
    },
    [currentChat, currentUserId, dispatch, sendChatMessage]
  );
};
