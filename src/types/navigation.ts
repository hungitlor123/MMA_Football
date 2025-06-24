import { NavigationProp, RouteProp } from "@react-navigation/native";
import { ParamListBase } from "@react-navigation/native";

// Tab Navigator Types
export interface TabParamList extends ParamListBase {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
}

// Stack Navigator Types
export interface RootStackParamList extends ParamListBase {
  Main: undefined;
  PlayerDetails: { playerId: string };
}

// Navigation Props Types
export type TabNavigationProp = NavigationProp<TabParamList>;
export type RootStackNavigationProp = NavigationProp<RootStackParamList>;

// Route Props Types
export type PlayerDetailsRouteProp = RouteProp<
  RootStackParamList,
  "PlayerDetails"
>;

// Combined Navigation Type
export type AppNavigationProp = TabNavigationProp & RootStackNavigationProp;
