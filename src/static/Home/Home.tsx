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
import {
  addChatAsync,
  deleteChatAsync,
  fetchChatsAsync,
  setCurrentChat,
  updateChatAsync,
} from "../../core/chat/chatSlice";
import { AppDispatch, RootState } from "../../store";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Home: undefined;
  Chat: { chatId: string };
};

type HomeNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const Home = ({ navigation }: { navigation: HomeNavigationProp }) => {
  const [newChatName, setNewChatName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const [modalVisible, setModalVisible] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [chatToRename, setChatToRename] = useState<string | null>(null);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const currentUserId = useSelector(
    (state: RootState) => state.chat.currentUserId
  );
  const chats = useSelector((state: RootState) => state.chat.chats);
  const loading = useSelector((state: RootState) => state.chat.loading);
  const error = useSelector((state: RootState) => state.chat.error);
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateChat = () => {
    if (newChatName.trim()) {
      const newChat = {
        name: newChatName.trim(),
        createdBy: currentUserId,
      };
      dispatch(addChatAsync(newChat))
        .unwrap()
        .then((result) => {
          setNewChatName("");
          console.log("Chat created:", result);
        })
        .catch((error) => {
          console.error("Failed to create chat:", error);
          alert("Failed to create chat. Using local data instead.");
        });
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
        dispatch(deleteChatAsync(chatToDelete))
          .unwrap()
          .then(() => {
            console.log("Chat deleted successfully");
          })
          .catch((error) => {
            console.error("Failed to delete chat:", error);
            alert("Failed to delete chat from server. Chat removed locally.");
          });
      } else {
        alert("You can only delete chats created by you");
      }
      setModalVisible(false);
      setChatToDelete(null);
    }
  };

  const handleRenameChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat && chat.createdBy === currentUserId) {
      setChatToRename(chatId);
      setNewChatName(chat.name);
      setRenameModalVisible(true);
    } else {
      alert("You can only rename chats created by you");
    }
  };

  const confirmRenameChat = () => {
    if (chatToRename && newChatName.trim()) {
      dispatch(
        updateChatAsync({
          chatId: chatToRename,
          chat: { name: newChatName.trim() },
        })
      )
        .unwrap()
        .then((result) => {
          console.log("Chat renamed successfully:", result);
          setRenameModalVisible(false);
          setChatToRename(null);
          setNewChatName("");
        })
        .catch((error) => {
          console.error("Failed to rename chat:", error);
          alert(
            typeof error === "string"
              ? error
              : "Failed to rename chat. Please try again."
          );
        });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading chats...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>
          Error:{" "}
          {typeof error === "string" ? error : "An unknown error occurred"}
        </Text>
        <Button title="Retry" onPress={() => dispatch(fetchChatsAsync())} />
      </View>
    );
  }

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
            onPress={() => {
              dispatch(setCurrentChat(item));
              navigation.navigate("Chat", { chatId: item.id });
            }}
          >
            <View style={styles.chatItem}>
              <Text>{item.name}</Text>
              {item.createdBy === currentUserId && (
                <TouchableOpacity onPress={() => handleRenameChat(item.id)}>
                  <Text style={styles.renameButton}>Rename</Text>
                </TouchableOpacity>
              )}
            </View>
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
      <Modal visible={renameModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Rename Chat</Text>
          <TextInput
            style={styles.input}
            value={newChatName}
            onChangeText={setNewChatName}
            placeholder="Enter new chat name"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setRenameModalVisible(false)}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={confirmRenameChat}
            >
              <Text>Rename</Text>
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
  chatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  renameButton: {
    color: "blue",
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
