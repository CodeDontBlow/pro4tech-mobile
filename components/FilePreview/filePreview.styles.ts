import { StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: Colors.white[300],
    borderRadius: 20,
    padding: 16,
    maxHeight: '75%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black.base,
  },
  list: {
    gap: 10,
    paddingBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.white[500],
    borderRadius: 12,
    padding: 10,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white[700],
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.black.base,
  },
  meta: {
    fontSize: 10,
    color: Colors.black[300],
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.white[700],
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.black.base,
    fontWeight: '600',
  },
  sendButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.teal.base,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendText: {
    color: Colors.white[300],
    fontWeight: '600',
  },
});
