import Colors from '@/constants/colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    backgroundColor: Colors.white[700],
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 8,
    elevation: 2,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    color: Colors.teal[500],
    fontWeight: '600',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  status: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  open: {
    backgroundColor: '#E6F6F0',
    color: '#00897B',
  },
  closed: {
    backgroundColor: '#F6E6E6',
    color: '#C62828',
  },
});