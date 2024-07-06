import React from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./app/static/Home/Home";
import Chat from "./app/static/Chat/Chat";
import store from "./app/store";
import WelcomeScreen from "./app/static/WelcomeScreen/WelcomeScreen";
import { navigationStyles } from "./app/shared/styles";
import { RootStackParamList } from "./app/shared/types";

const Stack = createStackNavigator<RootStackParamList>();

const screenOptions = {
  headerStyle: navigationStyles.headerStyle,
  headerTitleStyle: navigationStyles.headerTitleStyle,
  headerTitleContainerStyle: navigationStyles.headerTitleContainerStyle,
  headerTitleAlign: "center" as const,
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ title: "Simple chat application" }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: "Simple chat application" }}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{ title: "Simple chat application" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
