import { StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { fonts } from '@/constants/fonts';

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  keyboardAvoid: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
  card: {
    width: '100%',
    backgroundColor: Colors.white[300],
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 40,
    shadowColor: Colors.black.base,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 12,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -36,
    marginBottom: 4,
  },
  content: {
    paddingBottom: 8,
  },
  title: {
    fontFamily: fonts.ibmPlex.medium,
    fontSize: 22,
    color: Colors.teal[700],
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fonts.ibmPlex.light,
    fontSize: 16,
    color: Colors.teal[700],
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 6,
  },
  starWrapper: {
    padding: 4,
  },
  starText: {
    fontSize: 40,
  },
  scoreLabelContainer: {
    height: 22,
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: {
    fontFamily: fonts.ibmPlex.light,
    fontSize: 13,
    color: Colors.orange.base,
  },
  commentLabel: {
    fontFamily: fonts.ibmPlex.medium,
    fontSize: 14,
    color: Colors.teal[700],
    marginBottom: 8,
  },
  required: {
    color: Colors.red.base,
    fontFamily: fonts.ibmPlex.bold,
  },
  textInput: {
    backgroundColor: Colors.white[500],
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    padding: 12,
    fontFamily: fonts.ibmPlex.light,
    fontSize: 14,
    color: Colors.black.base,
    minHeight: 96,
    marginBottom: 8,
  },
  textInputError: {
    borderColor: Colors.red.base,
  },
  errorText: {
    fontFamily: fonts.ibmPlex.bold,
    fontSize: 12,
    color: Colors.red.base,
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 12,
  },
});