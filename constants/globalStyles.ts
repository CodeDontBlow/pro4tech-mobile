import { StyleSheet } from 'react-native';
import { fonts } from './fonts';

export const globalStyles = StyleSheet.create({
    title1: {
        fontFamily: fonts.martel.extraBold,
        fontSize: 48,
        lineHeight: 50,
    },
    title2: {
        fontFamily: fonts.martel.bold,
        fontSize: 36,
        lineHeight: 42,
    },

    subtitle: {
        fontFamily: fonts.martel.regular,
        fontSize: 22,
        lineHeight: 32,
    },

    text1: {
        fontFamily: fonts.ibmPlex.regular,
        fontSize: 18,
        lineHeight: 22,
    },
    text2: {
        fontFamily: fonts.ibmPlex.regular,
        fontSize: 16,
        lineHeight: 20,
    },

    label1: {
        fontFamily: fonts.ibmPlex.regular,
        fontSize: 14,
        lineHeight: 16,
    },
    label2: {
        fontFamily: fonts.ibmPlex.light,
        fontSize: 14,
        lineHeight: 16,
    },
});