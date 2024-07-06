import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = "https://a5676eb6-cd6a-479c-bf94-c9968c4c6807.mock.pstmn.io";

export const useWebSocketConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  const connect = useCallback(async () => {
    try {
      console.log("Attempting to connect to WebSocket...");
      const response = await axios.post(`${API_URL}/connect`);
      console.log("WebSocket connection response:", response.data);
      if (response.data.status === "connected") {
        setConnectionStatus("Connected");
        console.log("WebSocket connected successfully");
      }
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      setConnectionStatus("Disconnected");
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      console.log("Attempting to disconnect from WebSocket...");
      console.log("Disconnect URL:", `${API_URL}/disconnect`);
      const response = await axios.post(`${API_URL}/disconnect`);
      console.log("WebSocket disconnection response:", response.data);
      if (response.data.status === "disconnected") {
        setConnectionStatus("Disconnected");
        console.log("WebSocket disconnected successfully");
      }
    } catch (error) {
      console.error("Failed to disconnect from WebSocket:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error details:", error.response?.data);
        console.error("Error status:", error.response?.status);
      }
    }
  }, []);

  const sendChatMessage = useCallback(
    async (chatId: string, message: string) => {
      try {
        console.log(
          `Sending message via WebSocket: ${message} to chat ${chatId}`
        );
        const response = await axios.post(`${API_URL}/chats/messages`, {
          chatId,
          text: message,
          sender: "admin",
          timestamp: Date.now(),
        });
        console.log("WebSocket message response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Failed to send message via WebSocket:", error);
        throw error;
      }
    },
    []
  );

  return { connect, disconnect, sendChatMessage, connectionStatus };
};
