import { useNavigation } from '@react-navigation/native';
import { AppNavigationProp } from '../types/navigation';

export const useAppNavigation = () => {
  return useNavigation<AppNavigationProp>();
}; 