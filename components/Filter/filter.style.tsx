import { StyleSheet } from "react-native";
import Colors from '@/constants/colors';

export const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 1,
  },

  triggerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: '100%',
  },

  triggerButtonOpen: {
    backgroundColor: "#FFFFFF",
    borderColor: "#C8C8C8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  triggerLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    letterSpacing: 0.1,
    flex: 1,
    textAlign: 'left',
  },

  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 6,
    minWidth: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
    zIndex: 999,
  },

  option: {
    paddingVertical: 13,
    paddingHorizontal: 18,
  },

  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  optionLabel: {
    fontSize: 15,
    fontWeight: "400",
    color: "#333333",
  },

  optionLabelActive: {
    color: "#3DAA6D",
    fontWeight: "600",
  },
});