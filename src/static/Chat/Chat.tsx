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
import { RootState } from "../../store";
import { addMessage, deleteChat } from "../../core/chat/chatSlice";

const Chat = () => {
  const [newMessage, setNewMessage] = useState("");
  const currentChat = useSelector((state: RootState) => state.chat.currentChat);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    if (currentChat) {
      setCurrentChatId(currentChat.id);
    } else {
      setCurrentChatId(null);
    }
  }, [currentChat]);

  const handleLongPress = (chatId: string) => {
    setChatToDelete(chatId);
    setModalVisible(true);
  };

  const handleDeleteChat = () => {
    if (chatToDelete) {
      dispatch(deleteChat(chatToDelete));
      setModalVisible(false);
      setChatToDelete(null);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && currentChat) {
      const message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: "user",
        timestamp: Date.now(),
      };
      dispatch(addMessage(message));
      setNewMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Chat: {currentChat?.name}</Text>
      <TouchableOpacity onLongPress={() => handleLongPress(currentChatId!)}>
        <FlatList
          data={currentChat?.messages || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.messageContainer}>
              <Text style={styles.sender}>{item.sender}</Text>
              <Text>{item.text}</Text>
            </View>
          )}
        />
      </TouchableOpacity>
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
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleDeleteChat}
            >
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
