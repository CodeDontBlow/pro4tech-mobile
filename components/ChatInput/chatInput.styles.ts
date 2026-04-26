import { StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.white[500],
    backgroundColor: Colors.white[300],
    gap: 8,
  },
  attachButton: {
    padding: 4,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.white[500],
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.black.base,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: Colors.teal.base,
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});