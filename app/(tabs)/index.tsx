import Button from '@/components/Button/Button';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={[globalStyles.title2, styles.title]}>Chamados</Text>
      
      <View style={styles.buttonArea}>
        <Button 
          label="+ ABRIR" 
          onPress={() => router.push('/triagem')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[300],
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 20,
    color: Colors.black.base,
  },
  buttonArea: {
    width: '100%',
  }
});