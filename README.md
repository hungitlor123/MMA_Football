# Football Players App - React Native with Expo

A modern mobile application for exploring football players, built with React Native, Expo, and Redux Toolkit. Browse players by team, search for your favorites, and manage your favorite players list.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx       # Customizable button component
│   ├── Input.tsx        # Input component with validation
│   ├── Card.tsx         # Card container component
│   └── index.ts         # Component exports
├── screens/            # Screen components
│   ├── HomeScreen.tsx         # Main screen with player grid & filters
│   ├── SearchScreen.tsx       # Search players functionality
│   ├── FavoritesScreen.tsx    # Manage favorite players
│   └── PlayerDetailsScreen.tsx # Detailed player information
├── navigation/         # Navigation configuration
│   ├── TabNavigator.tsx       # Bottom tab navigation
│   └── StackNavigator.tsx     # Stack navigation
├── service/           # State management and API
│   ├── api/           # API services
│   │   └── playersApi.ts      # Players API integration
│   ├── constants/     # App constants
│   │   ├── apiConstants.ts    # API endpoints and config
│   │   └── appConstants.ts    # App-wide constants
│   ├── slices/        # Redux slices
│   │   ├── playersSlice.ts    # Players state management
│   │   ├── favoritesSlice.ts  # Favorites with AsyncStorage
│   │   └── appSlice.ts        # General app settings
│   └── store/         # Redux store configuration
│       ├── index.ts           # Store setup
│       └── hooks.ts           # Redux hooks
├── styles/            # Global styles and themes
│   ├── colors.ts      # Color palette
│   └── spacing.ts     # Spacing and typography
├── types/             # TypeScript type definitions
│   ├── index.ts       # Main type definitions
│   └── navigation.ts  # Navigation types
└── utils/             # Utility functions
    ├── helpers.ts     # Helper functions
    └── storage.ts     # Storage utilities
```

## 🚀 Features

- **Player Browsing**: View all football players with detailed information
- **Search Functionality**: Search players by name, team, or position
- **Favorites Management**: Add/remove players to/from favorites with persistent storage
- **Modern UI**: Clean, responsive design with football-themed styling
- **Navigation**: Tab-based navigation with stack navigation for details
- **State Management**: Redux Toolkit for efficient state management
- **TypeScript**: Full TypeScript support for better development experience

## 🛠️ Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **React Navigation** for navigation
- **AsyncStorage** for local data persistence
- **Expo Vector Icons** for icons

## 📱 Screens

1. **Home Screen**: Display all players with filtering options
2. **Search Screen**: Search functionality with real-time results
3. **Favorites Screen**: Manage favorite players
4. **Player Details Screen**: Detailed player information with stats

## 🎨 Design System

- **Colors**: Football-themed green color palette
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standardized spacing system
- **Components**: Reusable UI components

## 🔧 Setup & Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Run on iOS: `npm run ios` or Android: `npm run android`

## 📦 Dependencies

### Core Dependencies

- `react-native`: ^0.79.4
- `expo`: ~53.0.12
- `@reduxjs/toolkit`: ^2.8.2
- `react-redux`: ^9.2.0
- `@react-navigation/native`: ^7.1.14
- `@react-navigation/bottom-tabs`: ^7.4.1
- `@react-navigation/stack`: ^7.4.1

### UI & Icons

- `@expo/vector-icons`: ^14.1.0
- `react-native-gesture-handler`: ^2.26.0
- `react-native-reanimated`: ^3.18.0
- `react-native-safe-area-context`: ^5.5.0
- `react-native-screens`: ^4.11.1

### Storage & Utilities

- `@react-native-async-storage/async-storage`: ^2.2.0
- `redux-persist`: ^6.0.0
- `react-native-uuid`: ^2.0.3

## 🏃‍♂️ Getting Started

The app is ready to run with Expo. Simply start the development server and scan the QR code with the Expo Go app on your device.

## 📄 License

This project is licensed under the MIT License.
