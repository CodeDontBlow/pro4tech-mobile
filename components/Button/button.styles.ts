import { globalStyles } from '@/constants/globalStyles';
import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export default StyleSheet.create({
  button: {
    backgroundColor: Colors.teal.base,
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    width: '100%',
  },
  buttonLight: {
    backgroundColor: Colors.white[300],
  },
  buttonDisabled: {
    backgroundColor: Colors.teal[300],
    opacity: 0.6,
  },
  buttonError: {
    backgroundColor: Colors.red.base,
  },
  buttonText: {
    color: Colors.white[300],
    ...globalStyles.buttonText,
  },
  buttonTextLight: {
    color: Colors.teal.base,
    fontWeight: 'bold',
  },
});