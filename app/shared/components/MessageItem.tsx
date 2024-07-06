import React from "react";
import { View, Text } from "react-native";
import { Message } from "../../core/chat/chatTypes";
import { messageItemStyles } from "../styles";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const currentUserId = useSelector(
    (state: RootState) => state.chat.currentUserId
  );
  const isOwnMessage = message.sender === currentUserId;

  return (
    <View
      style={[
        messageItemStyles.container,
        isOwnMessage
          ? messageItemStyles.ownMessage
          : messageItemStyles.otherMessage,
      ]}
    >
      <View
        style={[
          messageItemStyles.bubble,
          isOwnMessage
            ? messageItemStyles.ownBubble
            : messageItemStyles.otherBubble,
        ]}
      >
        <Text
          style={[
            messageItemStyles.text,
            isOwnMessage
              ? messageItemStyles.ownText
              : messageItemStyles.otherText,
          ]}
        >
          {message.text}
        </Text>
      </View>
      <Text style={messageItemStyles.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );
};

export default MessageItem;
