import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { mockChats } from "../../utils/mockData";

export interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
}

export interface Chat {
  id: string;
  name: string;
  messages: Message[];
  createdBy: string;
}

export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
}

const initialState: ChatState = {
  chats: mockChats,
  currentChat: {
    id: "",
    name: "",
    messages: [],
    createdBy: "",
  },
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      const newChat = {
        ...action.payload,
        id: nanoid(),
        createdBy: "currentUserId",
      };
      state.chats.push(newChat);
    },
    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload;
    },

    addMessage: (state, action: PayloadAction<Message>) => {
      const updatedChats = state.chats.map((chat) => {
        if (chat.id === state.currentChat?.id) {
          const updatedChat = {
            ...chat,
            messages: [...chat.messages, action.payload],
          };
          return updatedChat;
        }
        return chat;
      });

      state.chats = updatedChats;
      state.currentChat =
        updatedChats.find((chat) => chat.id === state.currentChat?.id) ||
        state.currentChat;
    },

    deleteChat: (state, action: PayloadAction<string>) => {
      const currentUserId = "currentUserId";
      const chat = state.chats.find((chat) => chat.id === action.payload);
      if (chat && chat.createdBy === currentUserId) {
        state.chats = state.chats.filter((chat) => chat.id !== action.payload);
        if (state.currentChat?.id === action.payload) {
          state.currentChat = null;
        }
      } else {
        alert("You can only delete chats created by you");
      }
    },
  },
});

export const { setChats, addChat, setCurrentChat, addMessage, deleteChat } =
  chatSlice.actions;
export default chatSlice.reducer;
