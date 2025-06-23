# Football Players App - React Native with Expo

A modern mobile application for exploring football players, built with React Native, Expo, and Redux Toolkit. Browse players by team, search for your favorites, and manage your favorite players list.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx       # Customizable button component
│   ├── Input.tsx        # Input component with validation
│   ├── Card.tsx         # Card container component
│   ├── SimilarPlayers.tsx # Player similarity component
│   └── index.ts         # Component exports
├── screens/            # Screen components
│   ├── HomeScreen.tsx         # Main screen with player grid & filters
│   ├── SearchScreen.tsx       # Search players functionality
│   ├── FavoritesScreen.tsx    # Manage favorite players
│   ├── ProfileScreen.tsx      # User profile (placeholder)
│   └── PlayerDetailsScreen.tsx # Detailed player information
├── navigation/         # Navigation configuration
│   ├── TabNavigator.tsx       # Bottom tab navigation
│   └── StackNavigator.tsx     # Stack navigation
├── service/           # State management and API
│   ├── api/           # API services
│   │   ├── playersApi.ts      # Players API integration
│   │   ├── geminiApi.ts       # AI service integration
│   │   └── imageService.ts    # Image handling service
│   ├── constants/     # App constants
│   │   ├── apiConstants.ts    # API endpoints and config
│   │   └── appConstants.ts    # App-wide constants
│   ├── slices/        # Redux slices
│   │   ├── playersSlice.ts    # Players state management
│   │   ├── favoritesSlice.ts  # Favorites with AsyncStorage
│   │   ├── profileSlice.ts    # User profile state
│   │   └── appSlice.ts        # General app settings
│   └── store/         # Redux store configuration
│       ├── index.ts           # Store setup
│       └── hooks.ts           # Typed Redux hooks
├── hooks/             # Custom React hooks
│   └── useAppNavigation.ts    # Navigation helper hook
├── styles/            # Design system
│   ├── colors.ts      # Color palette
│   └── spacing.ts     # Spacing constants
├── types/             # TypeScript type definitions
│   ├── index.ts       # Core types (Player, Feedback, etc.)
│   └── navigation.ts  # Navigation parameter types
└── utils/             # Utility functions
    ├── storage.ts     # AsyncStorage helpers
    └── helpers.ts     # General utility functions
```

## ✨ Features

- **Player Database**: Browse football players from multiple teams
- **Team Filtering**: Filter players by their respective teams
- **Search Functionality**: Search players by name, team, or position
- **Favorites Management**: Save favorite players with AsyncStorage persistence
- **Player Details**: Detailed view with statistics, ratings, and feedback
- **Modern UI**: Clean, responsive design with consistent styling
- **Pull to Refresh**: Refresh player data with pull gesture
- **Captain Badges**: Visual indicators for team captains
- **Statistics Display**: Age calculation, playing time formatting, ratings

## 🏈 Player Data Structure

The app displays players with the following information:

- **Basic Info**: Name, age (calculated from Year of Birth), position
- **Team Details**: Team name, captain status
- **Statistics**: Minutes played, passing accuracy percentage
- **Media**: Player images
- **Feedback**: User ratings and comments

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd MobileApp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on specific platform**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

## 🔧 Tech Stack

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Navigation** - Navigation library
- **React Native Gesture Handler** - Gesture recognition
- **React Native Reanimated** - Animations
- **Async Storage** - Local storage for favorites
- **Mock API** - External data source for players

## 🎯 App Screens

### Home Screen

- Grid view of all players
- Team filter buttons with player counts
- Favorites toggle
- Pull-to-refresh functionality
- Player statistics preview

### Search Screen

- Search input with real-time filtering
- Search by player name, team, or position
- Results displayed in scrollable list
- Direct navigation to player details

### Favorites Screen

- List of saved favorite players
- Remove individual favorites
- Clear all favorites option
- Empty state messaging
- Quick access to player details

### Player Details Screen

- Complete player information
- Statistics display with formatted data
- Star ratings from feedback
- Feedback comments list
- Add/remove from favorites

### Profile Screen

- User profile placeholder
- Future user-specific features

## 📊 State Management

The app uses Redux Toolkit with the following slices:

- **playersSlice**: Manages player data, filtering, and search
- **favoritesSlice**: Handles favorite players with AsyncStorage persistence
- **profileSlice**: User profile state management
- **appSlice**: General app settings and theme

```typescript
// Using typed hooks
import { useAppDispatch, useAppSelector } from "../service/store/hooks";

// In component
const dispatch = useAppDispatch();
const { players, loading } = useAppSelector((state) => state.players);
const favorites = useAppSelector((state) => state.favorites.items);
```

## 🌐 API Integration

The app fetches data from a mock API:

- **Base URL**: `https://67dfef5a7635238f9aabc98e.mockapi.io/books/books`
- **Data Format**: JSON array of player objects
- **Real-time Updates**: Pull-to-refresh capability

## 🎨 Design System

### Colors

- Primary: Modern blue palette
- Secondary: Complementary colors
- Text: High contrast for readability
- Background: Clean, neutral tones

### Typography

- Headers: Bold, prominent sizing
- Body: Readable, consistent spacing
- Captions: Subtle, informative text

### Components

- Cards: Consistent shadows and borders
- Buttons: Multiple variants (primary, secondary, danger)
- Inputs: Validation states and feedback
- Lists: Optimized for mobile scrolling

## 🔧 Customization

### Adding New Team Filters

Update the team list in `src/service/slices/playersSlice.ts`

### Modifying Player Data Structure

Update types in `src/types/index.ts` and corresponding API integration

### Styling Changes

Update design tokens in:

- `src/styles/colors.ts`
- `src/styles/spacing.ts`

## 🚀 Future Enhancements

- User authentication and profiles
- Player comparison features
- Advanced statistics and analytics
- Social features and sharing
- Offline data caching
- Push notifications

## 📖 Contributing

1. Follow the existing folder structure
2. Use TypeScript for all new files
3. Follow the component patterns established
4. Update types when adding new features
5. Test on both iOS and Android
6. Maintain consistent styling with design system

## 📄 License

This project is licensed under the MIT License.
