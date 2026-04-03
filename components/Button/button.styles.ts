import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import { globalStyles } from '@/constants/globalStyles';

export default StyleSheet.create({
  button: {
    backgroundColor: Colors.teal.base,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: Colors.teal[300],
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.white[300],
    ...globalStyles.subtitle,
  },
});