import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

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
  chats: [],
  currentChat: null,
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
        id: nanoid(), // Generate a unique ID for the new chat
        createdBy: "currentUserId", // Replace 'currentUserId' with the actual user ID or identifier
      };
      state.chats.push(newChat);
    },
    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      if (state.currentChat) {
        state.currentChat.messages.push(action.payload);
      }
    },
    deleteChat: (state, action: PayloadAction<string>) => {
      const currentUserId = "currentUserId"; // Replace 'currentUserId' with the actual user ID or identifier
      state.chats = state.chats.filter(
        (chat) => chat.createdBy !== currentUserId || chat.id !== action.payload
      );
      if (state.currentChat?.id === action.payload) {
        state.currentChat = null;
      }
    },
  },
});

export const { setChats, addChat, setCurrentChat, addMessage, deleteChat } =
  chatSlice.actions;
export default chatSlice.reducer;
