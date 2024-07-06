import axios from "axios";
import { Chat, Message } from "./chatSlice";

const API_URL =
  "https://c3a2dcba-a1c5-4a7f-896c-a292d8427caf.mock.pstmn.io/chats";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const addMessage = async (chatId: string, message: Message) => {
  try {
    console.log("Adding message:", message);
    console.log("Chat ID:", chatId);

    // Use a static URL for the mock server
    const response = await axiosInstance.post(`/messages`, {
      ...message,
      chatId,
    });

    console.log("Add message response:", response.data);

    // Use the sent message data, but keep the server-generated id
    return {
      ...message,
      id: response.data.id,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error adding message:",
        error.response?.status,
        error.response?.data
      );
    } else {
      console.error("Error adding message:", error);
    }
    throw error;
  }
};

export const fetchChats = async (): Promise<{ chats: Chat[] }> => {
  try {
    const response = await axiosInstance.get("");
    console.log("Fetch chats response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching chats:",
        error.response?.status,
        error.response?.data
      );
    } else {
      console.error("Error fetching chats:", error);
    }
    throw error;
  }
};

export const createChat = async (chat: { name: string; createdBy: string }) => {
  try {
    console.log("Creating chat with data:", chat);
    console.log("API URL:", API_URL);

    const response = await axiosInstance.post("", chat);

    console.log("Create chat response:", response.data);

    // Use the response data, but ensure the name and createdBy match the input
    return {
      ...response.data,
      name: chat.name,
      createdBy: chat.createdBy,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error creating chat:",
        error.response?.status,
        error.response?.data
      );
    } else {
      console.error("Error creating chat:", error);
    }
    throw error;
  }
};

export const updateChat = async (chatId: string, chat: { name: string }) => {
  try {
    console.log("Updating chat:", chatId, chat);
    // Use a static URL for the mock server
    const response = await axiosInstance.put(`/update`, { chatId, ...chat });
    console.log("Update chat response:", response.data);

    // If the response contains placeholders, replace them with actual values
    const updatedChat = {
      ...response.data,
      id:
        response.data.id === "{{$!request.body.chatId}}"
          ? chatId
          : response.data.id,
      name:
        response.data.name === "{{$!request.body.name}}"
          ? chat.name
          : response.data.name,
    };

    return updatedChat;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error updating chat:",
        error.response?.status,
        error.response?.data
      );
    } else {
      console.error("Error updating chat:", error);
    }
    throw error;
  }
};

export const deleteChat = async (chatId: string) => {
  try {
    // Use a static URL for the mock server
    const response = await axiosInstance.delete(`/delete`, {
      data: { chatId },
    });
    console.log("Delete chat response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error deleting chat:",
        error.response?.status,
        error.response?.data
      );
    } else {
      console.error("Error deleting chat:", error);
    }
    throw error;
  }
};
