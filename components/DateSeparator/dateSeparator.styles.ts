import { StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

export default StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: Colors.teal[300],
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginVertical: 12,
  },
  label: {
    color: Colors.white[300],
  },
});