import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { fetchChatsAsync } from "../chat/chatSlice";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../shared/types";

export const useWelcomeScreen = (
  navigation: NavigationProp<RootStackParamList, "Welcome">
) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenChatList = useCallback(async () => {
    try {
      await dispatch(fetchChatsAsync()).unwrap();
      navigation.navigate("Home");
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      throw new Error("Failed to fetch chats. Please try again.");
    }
  }, [dispatch, navigation]);

  return { handleOpenChatList };
};
