import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '@/components/Button/Button';
import OrbiAvatar from '@/components/OrbiAvatar/OrbiAvatar';
import Colors from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { globalStyles } from '@/constants/globalStyles';

const supportEmail = 'suporte@pro4tech.com';

export default function Help() {
  const openEmail = () => {
    Linking.openURL(`mailto:${supportEmail}?subject=Ajuda%20com%20acesso%20ao%20Orbita`);
  };

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color={Colors.teal.base} />
        <Text style={[globalStyles.label1, styles.backText]}>Voltar</Text>
      </Pressable>

      <View style={styles.header}>
        <OrbiAvatar size={112} />
        <Text style={[globalStyles.title2, styles.title]}>Precisa de ajuda?</Text>
        <Text style={[globalStyles.text2, styles.description]}>
          Veja o que você precisa para acessar sua conta ou falar com o suporte.
        </Text>
      </View>

      <View style={styles.section}>
        <HelpItem
          icon="qr-code-outline"
          title="QR Code da empresa"
          description="Para entrar no aplicativo, você precisa do QR Code ou do código de acesso da sua empresa. Peça essa informação ao responsável pela empresa ou ao suporte."
        />
        <HelpItem
          icon="lock-closed-outline"
          title="Esqueci minha senha"
          description="Use o e-mail cadastrado na plataforma e solicite a redefinição da sua senha com o suporte."
        />
        <HelpItem
          icon="mail-outline"
          title="Não lembro meu e-mail"
          description="Confira com o responsável da sua empresa qual é o e-mail vinculado ao seu cadastro."
        />
        <HelpItem
          icon="person-add-outline"
          title="Ainda não tenho cadastro"
          description="Volte para a tela anterior e toque em Cadastrar para criar sua conta de cliente."
        />
      </View>

      <View style={styles.contactBox}>
        <Ionicons name="headset-outline" size={28} color={Colors.white[300]} />
        <View style={styles.contactTextGroup}>
          <Text style={[globalStyles.text1, styles.contactTitle]}>Fale com o suporte</Text>
          <Text style={[globalStyles.label1, styles.contactDescription]}>
            Envie uma mensagem informando seu nome, empresa e o problema encontrado.
          </Text>
        </View>
      </View>

      <Button label="Enviar e-mail ao suporte" onPress={openEmail} />

      <Text style={[globalStyles.label1, styles.footer]}>
        Atendimento em dias úteis, das 8h às 18h.
      </Text>
    </ScrollView>
  );
}

type HelpItemProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
};

function HelpItem({ icon, title, description }: HelpItemProps) {
  return (
    <View style={styles.helpItem}>
      <View style={styles.helpIcon}>
        <Ionicons name={icon} size={22} color={Colors.teal.base} />
      </View>
      <View style={styles.helpText}>
        <Text style={[globalStyles.text2, styles.helpTitle]}>{title}</Text>
        <Text style={[globalStyles.label1, styles.helpDescription]}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Colors.white[300],
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 54,
    paddingBottom: 36,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    marginBottom: 8,
  },
  backText: {
    color: Colors.teal.base,
    fontFamily: fonts.ibmPlex.semiBold,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    color: Colors.teal.base,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  description: {
    color: Colors.black[300],
    textAlign: 'center',
    maxWidth: 360,
  },
  section: {
    gap: 14,
    marginBottom: 24,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.white[700],
    borderRadius: 8,
    padding: 16,
    backgroundColor: Colors.white.base,
  },
  helpIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.beige[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  helpText: {
    flex: 1,
  },
  helpTitle: {
    color: Colors.black.base,
    fontFamily: fonts.ibmPlex.semiBold,
    marginBottom: 4,
  },
  helpDescription: {
    color: Colors.black[300],
  },
  contactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.teal[300],
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  contactTextGroup: {
    flex: 1,
  },
  contactTitle: {
    color: Colors.white[300],
    fontFamily: fonts.ibmPlex.semiBold,
    marginBottom: 4,
  },
  contactDescription: {
    color: Colors.white[300],
  },
  footer: {
    color: Colors.black[300],
    textAlign: 'center',
    marginTop: 16,
  },
});
