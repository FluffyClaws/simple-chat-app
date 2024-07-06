import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { addMessageAsync, setCurrentChat } from "../../core/chat/chatSlice";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Chat: { chatId: string };
};
type ChatRouteProp = RouteProp<RootStackParamList, "Chat">;
type ChatNavigationProp = StackNavigationProp<RootStackParamList, "Chat">;

const Chat = ({
  route,
}: {
  route: ChatRouteProp;
  navigation: ChatNavigationProp;
}) => {
  const [newMessage, setNewMessage] = useState("");
  const currentChat = useSelector((state: RootState) => state.chat.currentChat);
  const dispatch = useDispatch<AppDispatch>();
  const [modalVisible, setModalVisible] = useState(false);
  const chats = useSelector((state: RootState) => state.chat.chats);
  const { chatId } = route.params ?? {};
  const currentUserId = useSelector(
    (state: RootState) => state.chat.currentUserId
  );

  useEffect(() => {
    if (chatId) {
      const currentChat = chats.find((chat) => chat.id === chatId);
      if (currentChat) {
        dispatch(setCurrentChat(currentChat));
      }
    }
  }, [chatId, chats, dispatch]);

  const handleSendMessage = () => {
    if (newMessage.trim() && currentChat) {
      const userMessage = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: currentUserId,
        timestamp: Date.now(),
      };
      dispatch(
        addMessageAsync({ chatId: currentChat.id, message: userMessage })
      )
        .unwrap()
        .then((result) => {
          console.log("Message sent:", result);
          setNewMessage("");
        })
        .catch((error) => {
          console.error("Failed to send message:", error);
          // The message is already added locally due to our error handling in the slice
          setNewMessage("");
          alert("Failed to send message to server. Message added locally.");
        });
    } else {
      alert("Please enter a message.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Chat: {currentChat ? currentChat.name : ""}
      </Text>
      <FlatList
        data={currentChat?.messages || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => currentChat && currentChat.id}>
            <View style={styles.messageContainer}>
              <Text style={styles.sender}>{item.sender}</Text>
              <Text>{item.text}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        extraData={currentChat?.messages}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 16 }}>
            No messages yet.
          </Text>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Delete Chat?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  messageContainer: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  sender: {
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 16,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ccc",
    marginHorizontal: 8,
    borderRadius: 4,
  },
});

export default Chat;
