import Button from '@/components/Button/Button';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Image } from 'react-native';

export default function Triagem() {
  const [node, setNode] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchFirstQuestion = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3333/triage-rules/root');
      
      if (!response.ok) throw new Error("Falha ao buscar raiz");
      
      const data = await response.json();
      setNode(data);
    } catch (err) {
      console.error("Erro ao carregar início:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (option: any) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3333/triage-rules/${node.id}/traverse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answerTrigger: option.answerTrigger })
      });

      const data = await response.json();

      if (data.isLeaf) {
        router.push({ 
          pathname: '/(tabs)/history', 
          params: { groupId: data.targetGroupId } 
        });
      } else {
        setNode(data);
      }
    } catch (err) {
      console.error("Erro ao responder:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFirstQuestion(); }, []);

  if (loading && !node) {
    return <View style={styles.center}><ActivityIndicator size="large" color={Colors.teal.base} /></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logos/Orbi.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
        <Text style={[globalStyles.title2, styles.question]}>
          {node?.question || "Carregando..."}
        </Text>

        <View style={styles.options}>
          {node?.children?.map((option: any) => (
            <Button 
              key={option.id} 
              label={option.answerTrigger} 
              onPress={() => handleAnswer(option)} 
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: Colors.white[300], 
    paddingHorizontal: 32, 
    paddingVertical: 40 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: Colors.white[300] 
  },
  content: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 150,
    height: 150,
  },
  question: { 
    color: Colors.teal.base, 
    textAlign: 'center', 
    marginBottom: 40 
  },
  options: { 
    width: '100%', 
    gap: 12 
  }
});