import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { fetchChatsAsync } from "../core/chat/chatSlice";
import { AppDispatch } from "../store";

type RootStackParamList = {
  Home: undefined;
};

type WelcomeScreenNavigationProp = NavigationProp<RootStackParamList, "Home">;

const WelcomeScreen = ({
  navigation,
}: {
  navigation: WelcomeScreenNavigationProp;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenChatList = async () => {
    try {
      await dispatch(fetchChatsAsync()).unwrap();
      navigation.navigate("Home");
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      alert("Failed to fetch chats. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        This is a simple chat app written with React Native.
      </Text>
      <Button title="Open Chat List" onPress={handleOpenChatList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
  },
});

export default WelcomeScreen;
