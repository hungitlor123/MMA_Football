import { ParamListBase } from "@react-navigation/native";

// Football Player interfaces
export interface Feedback {
  rating: number;
  comment: string;
  author: string;
  date: string;
}

export interface Player {
  id: string;
  playerName: string;
  MinutesPlayed: number;
  YoB: number;
  position: string;
  isCaptain: boolean;
  image: string;
  team: string;
  PassingAccuracy: number;
  feedbacks: Feedback[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export interface TabParamList extends ParamListBase {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
}

export interface RootStackParamList extends ParamListBase {
  Main: undefined;
  PlayerDetails: { playerId: string };
}

// Team filter interface
export interface TeamFilter {
  name: string;
  count: number;
}

// Re-export navigation types
export * from "./navigation";
