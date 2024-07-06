import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchChats,
  createChat,
  updateChat,
  deleteChat,
  addMessage,
} from "./chatService";
import { Chat, Message } from "./chatTypes";
import { AxiosError } from "axios";

export interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
  error: string | null;
  currentUserId: string;
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  loading: false,
  error: null,
  currentUserId: "admin",
};

export const fetchChatsAsync = createAsyncThunk(
  "chat/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchChats();
      return response.chats;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const addChatAsync = createAsyncThunk(
  "chat/addChat",
  async (chat: { name: string; createdBy: string }, { rejectWithValue }) => {
    try {
      const response = await createChat(chat);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        // If it's a 404 error, create a new chat object locally
        if (error.response && error.response.status === 404) {
          return {
            id: Date.now().toString(), // Generate a temporary ID
            name: chat.name,
            messages: [],
            createdBy: chat.createdBy,
          };
        }
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateChatAsync = createAsyncThunk(
  "chat/updateChat",
  async (
    args: { chatId: string; chat: { name: string } },
    { rejectWithValue }
  ) => {
    try {
      const { chatId, chat } = args;
      const response = await updateChat(chatId, chat);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        // If it's a 404 error, update the chat locally
        if (error.response && error.response.status === 404) {
          return { id: args.chatId, ...args.chat };
        }
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const deleteChatAsync = createAsyncThunk(
  "chat/deleteChat",
  async (chatId: string, { rejectWithValue }) => {
    try {
      await deleteChat(chatId);
      return chatId;
    } catch (error) {
      if (error instanceof AxiosError) {
        // If it's a 404 error, still remove the chat from the local state
        if (error.response && error.response.status === 404) {
          return chatId;
        }
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const addMessageAsync = createAsyncThunk(
  "chat/addMessage",
  async (args: { chatId: string; message: Message }, { rejectWithValue }) => {
    try {
      const { chatId, message } = args;
      const response = await addMessage(chatId, message);
      return { chatId, message: response };
    } catch (error) {
      if (error instanceof AxiosError) {
        // If it's a 404 error, use the original message
        if (error.response && error.response.status === 404) {
          return args;
        }
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChatsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch chats";
      })
      .addCase(addChatAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addChatAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.chats.push(action.payload);
      })
      .addCase(addChatAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create chat";
      })
      .addCase(updateChatAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChatAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedChat = action.payload;
        const index = state.chats.findIndex(
          (chat) => chat.id === updatedChat.id
        );
        if (index !== -1) {
          state.chats[index] = { ...state.chats[index], ...updatedChat };
        }
        if (state.currentChat && state.currentChat.id === updatedChat.id) {
          state.currentChat = { ...state.currentChat, ...updatedChat };
        }
      })
      .addCase(updateChatAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update chat";
      })
      .addCase(deleteChatAsync.fulfilled, (state, action) => {
        state.chats = state.chats.filter((chat) => chat.id !== action.payload);
        if (state.currentChat?.id === action.payload) {
          state.currentChat = null;
        }
      })
      .addCase(deleteChatAsync.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete chat";
      })
      .addCase(addMessageAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMessageAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { chatId, message } = action.payload;
        const chat = state.chats.find((c) => c.id === chatId);
        if (chat && message) {
          chat.messages.push(message);
        }
        if (state.currentChat && state.currentChat.id === chatId && message) {
          state.currentChat.messages.push(message);
        }
      })
      .addCase(addMessageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to add message";
      });
  },
});

export const { setCurrentChat } = chatSlice.actions;
export default chatSlice.reducer;
