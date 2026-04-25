import { StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white[500],
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.teal.base,
  },
  text: {
    textAlign: 'center',
    color: Colors.black.base,
    lineHeight: 22,
  },
});