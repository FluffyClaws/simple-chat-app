import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useWelcomeScreen } from "../../core/welcome/welcomeScreenHooks";
import { NavigationProps } from "../../shared/types";
import { welcomeStyles } from "../../shared/styles";

const WelcomeScreen: React.FC<NavigationProps<"Welcome">> = ({
  navigation,
}) => {
  const { handleOpenChatList } = useWelcomeScreen(navigation);

  const onOpenChatList = async () => {
    try {
      await handleOpenChatList();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  return (
    <View style={welcomeStyles.container}>
      <Text style={welcomeStyles.welcomeText}>
        Welcome to the Simple Chat App
      </Text>
      <TouchableOpacity
        style={welcomeStyles.welcomeButton}
        onPress={onOpenChatList}
      >
        <Text style={welcomeStyles.welcomeButtonText}>Open Chat List</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;
