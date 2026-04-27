import Colors from '@/constants/colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.teal.base,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  icon: {
    color: Colors.white[300],
  },
});