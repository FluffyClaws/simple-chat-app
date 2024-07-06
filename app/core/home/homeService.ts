import { AppDispatch } from "../../store";
import {
  addChatAsync,
  deleteChatAsync,
  fetchChatsAsync,
  setCurrentChat,
  updateChatAsync,
} from "../chat/chatSlice";
import { Chat } from "../chat/chatTypes";

export const homeService = {
  createChat: (
    dispatch: AppDispatch,
    newChatName: string,
    currentUserId: string
  ) => {
    if (newChatName.trim()) {
      const newChat = {
        name: newChatName.trim(),
        createdBy: currentUserId,
      };
      return dispatch(addChatAsync(newChat)).unwrap();
    } else {
      throw new Error("Please enter a chat name.");
    }
  },

  deleteChat: (
    dispatch: AppDispatch,
    chatId: string,
    chats: Chat[],
    currentUserId: string
  ) => {
    const chat = chats.find((chat) => chat.id === chatId);
    if (chat && chat.createdBy === currentUserId) {
      return dispatch(deleteChatAsync(chatId)).unwrap();
    } else {
      throw new Error("You can only delete chats created by you");
    }
  },

  renameChat: (
    dispatch: AppDispatch,
    chatId: string,
    newName: string,
    chats: Chat[],
    currentUserId: string
  ) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat && chat.createdBy === currentUserId) {
      if (newName.trim()) {
        return dispatch(
          updateChatAsync({ chatId, chat: { name: newName.trim() } })
        ).unwrap();
      } else {
        throw new Error("Please enter a valid chat name.");
      }
    } else {
      throw new Error("You can only rename chats created by you");
    }
  },

  filterChats: (chats: Chat[], searchQuery: string) => {
    return chats.filter((chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },

  navigateToChat: (dispatch: AppDispatch, chat: Chat, navigation: any) => {
    dispatch(setCurrentChat(chat));
    navigation.navigate("Chat", { chatId: chat.id });
  },

  retryFetchChats: (dispatch: AppDispatch) => {
    return dispatch(fetchChatsAsync());
  },
};
