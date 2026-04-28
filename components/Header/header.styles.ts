import { StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white.base,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  left: {
    width: 40,
    alignItems: 'flex-start',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    color: Colors.teal[500],
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    padding: 4,
  },
  icon: {
    color: Colors.teal[500],
  },
});