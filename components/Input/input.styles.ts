import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import { globalStyles } from '@/constants/globalStyles';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.teal.base,
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  containerError: {
    borderColor: Colors.red.base,
  },
  icon: {
    color: Colors.white[300],
    marginRight: 10,
  },
  input: {
    flex: 1,
      ...globalStyles.label1,
    color: Colors.white[300],
    paddingLeft: 6,
    minHeight: 20,
  },
  placeholder: {
    color: Colors.white[300],
  },
});