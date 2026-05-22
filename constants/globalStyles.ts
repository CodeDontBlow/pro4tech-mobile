import { StyleSheet } from 'react-native';
import Colors from './colors';
import { fonts } from './fonts';

export const globalStyles = StyleSheet.create({
    title1: {
        fontFamily: fonts.martel.extraBold,
        fontSize: 48,
        lineHeight: 50,
    },
    title2: {
        fontFamily: fonts.martelSans.bold,
        fontSize: 36,
        lineHeight: 43.5,
        includeFontPadding: false,
        textAlignVertical: 'center',
        paddingTop: 10,
    },

    subtitle: {
        fontFamily: fonts.martelSans.regular,
        fontSize: 30,
        lineHeight: 32,
    },

    subtitle2: {
        fontFamily: fonts.martel.regular,
        fontSize: 20,
        lineHeight: 28,
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
    imgWrapper: {
        backgroundColor: Colors.white[700],
        borderColor: Colors.white[700],
        borderRadius: 9999,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    wrappedImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    }
});