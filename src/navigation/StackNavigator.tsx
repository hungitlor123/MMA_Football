import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import PlayerDetailsScreen from '../screens/PlayerDetailsScreen';
import { RootStackParamList } from '../types';
import { colors } from '../styles/colors';

const Stack = createStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        },
        headerTintColor: colors.text.primary,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PlayerDetails" 
        component={PlayerDetailsScreen}
        options={({ route }) => ({ 
          title: 'Player Details',
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
} 