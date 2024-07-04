import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
  Home: undefined;
};

type WelcomeScreenNavigationProp = NavigationProp<RootStackParamList, "Home">;
const WelcomeScreen = ({
  navigation,
}: {
  navigation: WelcomeScreenNavigationProp;
}) => {
  const handleOpenChatList = () => {
    navigation.navigate("Home", undefined);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        This is a simple chat app written with React Native.
      </Text>
      <Button title="Open Chat List" onPress={handleOpenChatList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
  },
});

export default WelcomeScreen;
