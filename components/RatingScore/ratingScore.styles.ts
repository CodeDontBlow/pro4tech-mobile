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
    color: Colors.black.base,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fonts.ibmPlex.light,
    fontSize: 16,
    color: Colors.black[300],
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  orbisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orbiOptionWrapper: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  orbiOptionAvatar: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  orbiOptionLabel: {
    fontFamily: fonts.ibmPlex.regular,
    fontSize: 10,
    color: Colors.black[300],
    opacity: 0.4,
    textAlign: 'center',
  },
  scoreLabelContainer: {
    height: 8,
    marginBottom: 14
  },
  commentLabel: {
    fontFamily: fonts.ibmPlex.medium,
    fontSize: 14,
    color: Colors.black.base,
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
    fontFamily: fonts.ibmPlex.regular,
    fontSize: 14,
    color: Colors.black.base,
    minHeight: 96,
    marginBottom: 8,
  },
  textInputError: {
    borderColor: Colors.red.base,
  },
  errorText: {
    fontFamily: fonts.ibmPlex.regular,
    fontSize: 12,
    color: Colors.red.base,
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 12,
  },
});