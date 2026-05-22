import Colors from '@/constants/colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  botWrapper: {
    alignSelf: 'flex-start',
  },
  userWrapper: {
    alignSelf: 'flex-end',
  },
  bubble: {
    borderRadius: 18,
    padding: 16,
    position: 'relative',
  },
  botBubble: {
    backgroundColor: Colors.white[500],
    shadowColor: Colors.black.base,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  userBubble: {
    backgroundColor: Colors.teal.base,
  },
  text: {
    lineHeight: 22,
  },
  botText: {
    color: Colors.black.base,
  },
  userText: {
    color: Colors.white[300],
  },
  botTail: {
    position: 'absolute',
    left: -8,
    bottom: 16,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: Colors.white[500],
    borderRightWidth: 8,
    borderRightColor: 'transparent',
  },
  userTail: {
    position: 'absolute',
    right: -8,
    bottom: 16,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: Colors.teal.base,
    borderRightWidth: 8,
    borderRightColor: 'transparent',
  },
  optionsList: {
    marginTop: 12,
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  optionIndex: {
    fontWeight: '700',
    minWidth: 20,
    fontSize: 14,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  time: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeUser: {
    color: Colors.teal[300],
  },
  timeBot: {
    color: Colors.black[300],
  },
});