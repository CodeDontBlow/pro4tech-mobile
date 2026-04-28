import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Button from '@/components/Button/Button';
import OrbiAvatar from '@/components/OrbiAvatar/OrbiAvatar';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import api from '@/services/api';

export default function TriageEnd() {
  const { groupName, subjectName, triageNodeId } = useLocalSearchParams<{
    groupName: string,
    subjectName: string,
    groupId: string,  
    subjectId: string,
    triageNodeId: string,
  }>();

const handleFinalize = async () => {
  try {
    await api.post('/tickets', {
        triageLeafId: triageNodeId, 
    });

    router.push('/waiting');
  } catch (error: any) {
    console.error("Erro:", error);
  }
};

  return (
    <View style={styles.container}>
      <OrbiAvatar variant="default" size={120} />

      <Text style={[globalStyles.text1, styles.mainText]}>
        Aguarde um instante, vamos direcionar você ao atendente!
      </Text>

      <Text style={[globalStyles.label1, styles.subText]}>
        Seu chamado será encaminhado para um atendente do grupo{' '}
        <Text style={styles.highlightText}>{groupName}</Text>, tratando do
        assunto: <Text style={styles.highlightText}>{subjectName}</Text>
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          label="Continuar"
          onPress={handleFinalize}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.white[300],
  },
  mainText: {
    color: Colors.teal[700],
    marginBottom: 20,
    textAlign: 'center',
  },
  subText: {
    color: Colors.black.base,
    marginBottom: 20,
    textAlign: 'center',
  },
  highlightText: {
    fontWeight: '700',
    color: Colors.teal.base,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
});