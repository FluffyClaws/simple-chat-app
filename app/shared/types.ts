import { NavigationProp, RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Chat: { chatId: string };
};

export type NavigationProps<T extends keyof RootStackParamList> = {
  navigation: NavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};
