import { Chat } from "../core/chat/chatTypes";

export const mockChats: Chat[] = [
  {
    id: "1",
    name: "Chat 1",
    messages: [
      {
        id: "1",
        text: "Hello, this is the first message in Chat 1.",
        sender: "user",
        timestamp: 1685714000000,
      },
      {
        id: "2",
        text: "Hi there, this is a simulated message in Chat 1.",
        sender: "otherUser",
        timestamp: 1685717600000,
      },
    ],
    createdBy: "otherUserId",
  },
  {
    id: "2",
    name: "Chat 2",
    messages: [
      {
        id: "3",
        text: "This is the first message in Chat 2.",
        sender: "user",
        timestamp: 1685804400000,
      },
    ],
    createdBy: "otherUserId",
  },
  {
    id: "3",
    name: "user created",
    messages: [],
    createdBy: "admin",
  },
];

export const mockWebSocketResponses = {
  connect: true,
  disconnect: true,
  sendMessage: true,
};
