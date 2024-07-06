import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { homeStyles, modalStyles, sharedStyles } from "../../shared/styles";
import Modal from "../../shared/components/Modal";
import { homeService } from "../../core/home/homeService";
import { NavigationProps } from "../../shared/types";

const Home: React.FC<NavigationProps<"Home">> = ({ navigation }) => {
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
  const filteredChats = homeService.filterChats(chats, searchQuery);

  const handleCreateChat = () => {
    homeService
      .createChat(dispatch, newChatName, currentUserId)
      .then(() => setNewChatName(""))
      .catch((error) => alert(error.message));
  };

  const handleLongPress = (chatId: string) => {
    setChatToDelete(chatId);
    setModalVisible(true);
  };

  const handleDeleteChat = () => {
    if (chatToDelete) {
      homeService
        .deleteChat(dispatch, chatToDelete, chats, currentUserId)
        .then(() => {
          setModalVisible(false);
          setChatToDelete(null);
        })
        .catch((error) => alert(error.message));
    }
  };

  const handleRenameChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setChatToRename(chatId);
      setNewChatName(chat.name);
      setRenameModalVisible(true);
    }
  };

  const confirmRenameChat = () => {
    if (chatToRename) {
      homeService
        .renameChat(dispatch, chatToRename, newChatName, chats, currentUserId)
        .then(() => {
          setRenameModalVisible(false);
          setChatToRename(null);
          setNewChatName("");
        })
        .catch((error) => alert(error.message));
    }
  };

  if (loading) {
    return (
      <View style={sharedStyles.container}>
        <Text>Loading chats...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={sharedStyles.container}>
        <Text>
          Error:{" "}
          {typeof error === "string" ? error : "An unknown error occurred"}
        </Text>
        <Button
          title="Retry"
          onPress={() => homeService.retryFetchChats(dispatch)}
        />
      </View>
    );
  }

  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.heading}>Chats</Text>
      <TextInput
        style={homeStyles.searchInput}
        placeholder="Search chats"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              homeService.navigateToChat(dispatch, item, navigation)
            }
            onLongPress={() => handleLongPress(item.id)}
          >
            <View style={homeStyles.chatItem}>
              <Text style={homeStyles.chatName}>{item.name}</Text>
              {item.createdBy === currentUserId && (
                <TouchableOpacity onPress={() => handleRenameChat(item.id)}>
                  <Text style={homeStyles.renameButton}>Rename</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={homeStyles.inputContainer}>
        <TextInput
          style={homeStyles.newChatInput}
          placeholder="New chat name"
          value={newChatName}
          onChangeText={setNewChatName}
        />
        <TouchableOpacity
          style={sharedStyles.button}
          onPress={handleCreateChat}
        >
          <Text style={sharedStyles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        title="Delete Chat?"
        onConfirm={handleDeleteChat}
        onCancel={() => setModalVisible(false)}
      />
      <Modal
        visible={renameModalVisible}
        title="Rename Chat"
        onConfirm={confirmRenameChat}
        onCancel={() => setRenameModalVisible(false)}
      >
        <TextInput
          style={modalStyles.modalInput}
          value={newChatName}
          onChangeText={setNewChatName}
          placeholder="Enter new chat name"
        />
      </Modal>
    </View>
  );
};

export default Home;
