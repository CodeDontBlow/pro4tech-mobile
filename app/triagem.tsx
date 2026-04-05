import Button from '@/components/Button/Button';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Triagem() {
  const [node, setNode] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadStep = async (id?: string) => {
    setLoading(true);
    try {
      const baseUrl = 'http://localhost:3333/triage-rules';      
      const endpoint = id ? `${baseUrl}/${id}/traverse` : `${baseUrl}/traverse`;

      const response = await fetch(endpoint, { method: 'POST' });
      const data = await response.json();

      if (data.isLeaf) {
        router.push({ pathname: '/(tabs)/history', params: { groupId: data.targetGroupId } });
      } else {
        setNode(data);
      }
    } catch (err) {
      console.error("Erro na triagem:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStep(); }, []);

  if (loading && !node) {
    return <View style={styles.center}><ActivityIndicator color={Colors.teal.base} /></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={[globalStyles.title2, styles.question]}>
          {node?.prompt || "Carregando..."}
        </Text>

        <View style={styles.options}>
          {node?.children?.map((option: any) => (
            <Button 
              key={option.id} 
              label={option.description} 
              onPress={() => loadStep(option.id)} 
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
    paddingVertical: 40,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, justifyContent: 'center' },
  question: {
    color: Colors.teal.base,
    textAlign: 'center',
    marginBottom: 40,
  },
  options: { width: '100%' }
});