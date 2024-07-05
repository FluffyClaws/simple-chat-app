import React, { useState } from "react";
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
import { addChat, deleteChat, setCurrentChat } from "../../core/chat/chatSlice";
import { RootState } from "../../store";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Home: undefined;
  Chat: { chatId: string };
};

type HomeNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const Home = ({ navigation }: { navigation: HomeNavigationProp }) => {
  const [newChatName, setNewChatName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const chats = useSelector((state: RootState) => state.chat.chats);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const currentUserId = "currentUserId";

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateChat = () => {
    if (newChatName.trim()) {
      const newChat = {
        id: Date.now().toString(),
        name: newChatName.trim(),
        messages: [],
        createdBy: "user",
      };
      dispatch(addChat(newChat));
      dispatch(setCurrentChat(newChat));
      setNewChatName("");
    } else {
      alert("Please enter a chat name.");
    }
  };

  const handleLongPress = (chatId: string) => {
    setChatToDelete(chatId);
    setModalVisible(true);
  };

  const handleDeleteChat = () => {
    if (chatToDelete) {
      const chat = chats.find((chat) => chat.id === chatToDelete);
      if (chat && chat.createdBy === currentUserId) {
        dispatch(deleteChat(chatToDelete));
      } else {
        alert("You can only delete chats created by you");
      }
      setModalVisible(false);
      setChatToDelete(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Chats</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search chats"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => handleLongPress(item.id)}
            onPress={() => navigation.navigate("Chat", { chatId: item.id })}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New chat name"
          value={newChatName}
          onChangeText={setNewChatName}
        />
        <Button title="Create" onPress={handleCreateChat} />
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
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
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

export default Home;
