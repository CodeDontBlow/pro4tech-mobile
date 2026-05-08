import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Alert from '@/components/Alert/Alert';
import Header from '@/components/Header/Header';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import api, { storage } from '@/services/api';
import { authService } from '@/services/authService';

type UserInfo = {
  name: string;
  email: string;
  companyId: string;
};

export default function Profile() {
  const [user, setUser] = useState<UserInfo>({ name: '', email: '', companyId: '' });
  const [notifications, setNotifications] = useState(true);
  const [photo, setPhoto] = useState<string | null>(null);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  useEffect(() => {
    loadUser();
    loadPhoto();
  }, []);

  const loadUser = async () => {
    try {
      const token = await authService.getToken();
      const response = await api.get('/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setUser({
        name: data.name,
        email: data.email,
        companyId: data.companyId,
      });
    } catch (err) {
      console.warn('Erro ao carregar usuário:', err);
    }
  };

  const loadPhoto = async () => {
    try {
      const saved = await storage.getItem('orbita_profile_photo');
      if (saved) setPhoto(saved);
    } catch {}
  };

  const handlePickPhoto = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setPhoto(uri);
      await storage.setItem('orbita_profile_photo', uri);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      await storage.deleteItem('orbita_profile_photo');
    } catch (err) {
      console.warn('Erro ao fazer logout:', err);
    } finally {
      setShowLogoutAlert(false);
      router.replace('/auth/login');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="ORBITA"
        showBack
        showProfile={false}
        onBack={() => router.replace('/(user)/(tabs)')}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <TouchableOpacity style={styles.avatarContainer} onPress={handlePickPhoto}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={56} color={Colors.white[300]} />
            </View>
          )}
          <View style={styles.avatarEditBadge}>
            <Ionicons name="camera" size={14} color={Colors.white[300]} />
          </View>
        </TouchableOpacity>

        <Text style={[globalStyles.title2, styles.userName]}>{user.name}</Text>

        <Text style={[globalStyles.title2, styles.sectionTitle]}>Informações</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={[globalStyles.text1, styles.infoLabel]}>Empresa:</Text>
            <Text style={[globalStyles.text1, styles.infoValue]} numberOfLines={1}>{user.companyId}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={[globalStyles.text1, styles.infoLabel]}>Email:</Text>
            <Text style={[globalStyles.text1, styles.infoValue]} numberOfLines={1}>{user.email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={[globalStyles.text1, styles.infoLabel]}>Senha:</Text>
            <View style={styles.passwordRow}>
              <Text style={[globalStyles.text1, styles.infoValue]}>••••••••••</Text>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="create-outline" size={16} color={Colors.teal.base} />
                <Text style={[globalStyles.label1, styles.editText]}>Alterar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={[globalStyles.title2, styles.sectionTitle]}>Configurações</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={[globalStyles.text1, styles.settingLabel]}>Notificações</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.white[500], true: Colors.teal.base }}
              thumbColor={Colors.white[300]}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <Text style={[globalStyles.text1, styles.settingLabel]}>Sobre o ORBITA</Text>
            <Text style={[globalStyles.label1, styles.infoValue]}>v1.0.0 - Code Don't Blow</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => setShowLogoutAlert(true)}>
          <Ionicons name="log-out-outline" size={20} color={Colors.red.base} />
          <Text style={[globalStyles.text1, styles.logoutText]}>Sair</Text>
        </TouchableOpacity>

      </ScrollView>

      <Alert
        visible={showLogoutAlert}
        title="Sair da conta"
        message="Tem certeza que deseja sair?"
        confirmLabel="Sair"
        cancelLabel="Cancelar"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutAlert(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[300],
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    marginTop: 16,
    marginBottom: 12,
    position: 'relative',
    width: 100,
    height: 100,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.teal.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.teal[700],
    borderRadius: 50,
    padding: 6,
  },
  userName: {
    color: Colors.teal.base,
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.teal[700],
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginTop: 8,
  },
  card: {
    backgroundColor: Colors.white[300],
    borderRadius: 12,
    padding: 16,
    width: '100%',
    gap: 12,
    elevation: 3,
    shadowColor: Colors.black.base,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.white[500],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: Colors.black.base,
    fontWeight: '700',
    flex: 1,
  },
  infoValue: {
    color: Colors.black[300],
    flex: 2,
    textAlign: 'left',
  },
  passwordRow: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    color: Colors.teal.base,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  settingLabel: {
    color: Colors.black.base,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.red.base,
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
    marginTop: 8,
    gap: 8,
  },
  logoutText: {
    color: Colors.red.base,
    fontWeight: '700',
  },
});