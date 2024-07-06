import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const commonColors = {
  primary: "#4A90E2",
  secondary: "#F5A623",
  background: "#F8F8F8",
  text: "#333333",
  lightText: "#777777",
  border: "#E0E0E0",
  white: "#FFFFFF",
  error: "#FF3B30",
};

export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonColors.background,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: commonColors.text,
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    color: commonColors.text,
    lineHeight: 24,
  },
  input: {
    backgroundColor: commonColors.white,
    borderWidth: 1,
    borderColor: commonColors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: commonColors.text,
  },
  button: {
    backgroundColor: commonColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: commonColors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: commonColors.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: commonColors.white,
  },
  messageInput: {
    ...sharedStyles.input,
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
  },
  sendButton: {
    marginLeft: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: commonColors.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  sendButtonText: {
    color: commonColors.white,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 24,
    paddingTop: 5,
  },
});

export const homeStyles = StyleSheet.create({
  searchInput: {
    ...sharedStyles.input,
    marginBottom: 16,
  },
  chatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: commonColors.border,
    backgroundColor: commonColors.white,
  },
  chatName: {
    ...sharedStyles.text,
    fontWeight: "bold",
  },
  renameButton: {
    color: commonColors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  newChatInput: {
    ...sharedStyles.input,
    flex: 1,
    marginRight: 10,
  },
});

export const navigationStyles = StyleSheet.create({
  headerStyle: {
    backgroundColor: commonColors.primary,
  },
  headerTitleStyle: {
    color: commonColors.white,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    flex: 1,
  },
  headerTitleContainerStyle: {
    paddingTop: 15,
    left: 0,
    right: 0,
  },
});

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: commonColors.background,
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: commonColors.text,
    marginBottom: 32,
  },
  welcomeButton: {
    backgroundColor: commonColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: width * 0.7,
  },
  welcomeButtonText: {
    color: commonColors.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: width,
    height: height,
  },
  modalContainer: {
    backgroundColor: commonColors.white,
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalTitle: {
    ...sharedStyles.heading,
    fontSize: 24,
    marginBottom: 24,
  },
  modalInput: {
    ...sharedStyles.input,
    marginBottom: 24,
    width: "100%",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    ...sharedStyles.button,
    paddingHorizontal: 24,
    width: "45%",
  },
  modalButtonText: {
    ...sharedStyles.buttonText,
    fontSize: 16,
  },
});

export const messageItemStyles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: "80%",
  },
  ownMessage: {
    alignSelf: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ownBubble: {
    backgroundColor: commonColors.primary,
  },
  otherBubble: {
    backgroundColor: commonColors.white,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownText: {
    color: commonColors.white,
  },
  otherText: {
    color: commonColors.text,
  },
  timestamp: {
    fontSize: 12,
    color: commonColors.lightText,
    marginTop: 4,
    alignSelf: "flex-end",
  },
});
