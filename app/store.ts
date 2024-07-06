import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import chatReducer from "./core/chat/chatSlice";
import { mockChats } from "./utils/mockData";

const preloadedState = {
  chat: {
    chats: mockChats,
    currentChat: null,
    loading: false,
    error: null,
    currentUserId: "admin",
  },
};

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  preloadedState,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
