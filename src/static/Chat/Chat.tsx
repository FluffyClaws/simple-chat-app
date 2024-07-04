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
import {
  addMessage,
  deleteChat,
  simulateOtherUserMessage,
} from "../../core/chat/chatSlice";

const Chat = () => {
  const [newMessage, setNewMessage] = useState("");
  const currentChat = useSelector((state: RootState) => state.chat.currentChat);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const simulatedMessage = {
        id: Date.now().toString(),
        text: "This is a simulated message from another user.",
        sender: "otherUser",
        timestamp: Date.now(),
      };
      dispatch(simulateOtherUserMessage(simulatedMessage));
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

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
          <TouchableOpacity
            onLongPress={() => handleLongPress(currentChat?.id!)}
          >
            <View style={styles.messageContainer}>
              <Text style={styles.sender}>{item.sender}</Text>
              <Text>{item.text}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        extraData={currentChat}
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
