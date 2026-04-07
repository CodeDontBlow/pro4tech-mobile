import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function TriageEnd() {
  const { groupName, subjectName } = useLocalSearchParams<{
    groupName: string,
    subjectName: any,
  }>();



  return (
    <View style={styles.container}>
        <View style={styles.logoContainer}>
            <Image
                source={require('../../assets/logos/Orbi.png')}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
        
        <Text style={styles.mainText}>
            Aguarde um instante, vamos direcionar você ao atendente! 
        </Text>
        <Text style={styles.subText}>
            Seu chamado será encaminhado para um atendente do grupo 
                <Text style={styles.highlightText}> {groupName} </Text>, 
            tratando do assunto: 
                <Text style={styles.highlightText}> {subjectName} </Text>
        </Text>

    </View>

  );
}
        
const styles = StyleSheet.create({
    container: {
        maxWidth: 500,
        marginHorizontal: 'auto',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 120,
        height: 120,
    },
    mainText: {
        color: Colors.teal[700],
        ...globalStyles.text1,
        marginBottom: 20,
        textAlign: 'center',
    },
    subText: {
        color: Colors.black.base,
        ...globalStyles.label1,
        marginBottom: 20,
        textAlign: 'center',
    },
    highlightText: {
        fontWeight: 700,
        color: Colors.teal.base,
    },
});