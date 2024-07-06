import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { RouteProp } from "@react-navigation/native";
import { chatStyles, sharedStyles } from "../../shared/styles";
import MessageItem from "../../shared/components/MessageItem";
import {
  useChatInitialization,
  useChatWebSocket,
  useSendMessage,
} from "../../core/chat/chatHooks";
import { NavigationProps, RootStackParamList } from "../../shared/types";

type ChatScreenProps = NavigationProps<"Chat"> & {
  route: RouteProp<RootStackParamList, "Chat">;
};

const Chat: React.FC<ChatScreenProps> = ({ route }) => {
  const [newMessage, setNewMessage] = useState("");
  const { chatId } = route.params ?? {};
  const currentChat = useSelector((state: RootState) => state.chat.currentChat);
  const { connectionStatus } = useChatWebSocket();
  const sendMessage = useSendMessage();

  useChatInitialization(chatId);

  const handleSendMessage = async () => {
    try {
      await sendMessage(newMessage);
      setNewMessage("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  if (!currentChat) {
    return (
      <View style={sharedStyles.container}>
        <Text>Loading chat...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={chatStyles.container}>
      <KeyboardAvoidingView style={chatStyles.container}>
        <FlatList
          style={chatStyles.messageList}
          data={currentChat.messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageItem message={item} />}
          ListEmptyComponent={
            <Text style={sharedStyles.text}>No messages yet.</Text>
          }
        />
        <View style={chatStyles.inputContainer}>
          <TextInput
            style={chatStyles.messageInput}
            placeholder="Type a message"
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity
            style={chatStyles.sendButton}
            onPress={handleSendMessage}
          >
            <Text style={chatStyles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
