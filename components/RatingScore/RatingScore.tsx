import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, TouchableWithoutFeedback, View,} from 'react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button/Button';
import OrbiAvatar from '@/components/OrbiAvatar/OrbiAvatar';
import { styles } from './ratingScore.styles';

interface RatingModalProps {
  visible: boolean;
  onSubmit: (score: number, comment: string) => Promise<void> | void;
  onDismiss: () => void;
}

type OrbiVariant = 'default' | 'sleep' | 'angry' | 'bored' | 'neutral' | 'happy' | 'love';

interface ScoreConfig {
  label: string;
  variant: OrbiVariant;
  activeColor: string;
}

const SCORE_CONFIG: ScoreConfig[] = [
  { label: 'Péssimo',   variant: 'angry',   activeColor: Colors.red.base    },
  { label: 'Ruim',      variant: 'bored',   activeColor: Colors.orange.base },
  { label: 'Regular',   variant: 'neutral', activeColor: Colors.orange[300] },
  { label: 'Bom',       variant: 'happy',   activeColor: Colors.teal.base   },
  { label: 'Excelente', variant: 'love',    activeColor: Colors.green.base  },
];

interface OrbiOptionProps {
  index: number;
  selected: boolean;
  onPress: () => void;
  scaleAnim: Animated.Value;
}

function OrbiOption({ index, selected, onPress, scaleAnim }: OrbiOptionProps) {
  const { label, variant, activeColor } = SCORE_CONFIG[index];

  const scale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.18],
  });

  return (
    <Pressable onPress={onPress} hitSlop={4} style={styles.orbiOptionWrapper}>
      <Animated.View
        style={[
          styles.orbiOptionAvatar,
          {
            transform: [{ scale }],
            opacity: selected ? 1 : 0.3,
          },
        ]}
      >
        <OrbiAvatar variant={variant} size={44} />
      </Animated.View>

      <Text
        style={[
          styles.orbiOptionLabel,
          selected && { color: activeColor, opacity: 1 },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function RatingModal({ visible, onSubmit, onDismiss }: RatingModalProps) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scaleAnims = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(0))
  ).current;

  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setScore(0);
      setComment('');
      setError(null);
      setLoading(false);
      scaleAnims.forEach(a => a.setValue(0));

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 340,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(60);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleOrbiPress = (index: number) => {
    setScore(index + 1);
    setError(null);
    scaleAnims.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === index ? 1 : 0,
        useNativeDriver: false,
        speed: 28,
        bounciness: 14,
      }).start();
    });
  };

  const isCommentRequired = score > 0 && score <= 3;
  const commentEmpty      = comment.trim().length === 0;

  const handleSubmit = async () => {
    if (score === 0) {
      setError('Por favor, selecione uma nota.');
      return;
    }
    if (isCommentRequired && commentEmpty) {
      setError('Um comentário é obrigatório para avaliações de até 3 estrelas.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit(score, comment.trim());
    } catch {
      setError('Ocorreu um erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const headerVariant = score > 0 ? SCORE_CONFIG[score - 1].variant : 'default';

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.card,
            { transform: [{ translateY: slideAnim }], opacity: fadeAnim },
          ]}
        >
          <View style={styles.avatarContainer}>
            <OrbiAvatar variant={headerVariant} size={72} />
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Como você avalia o atendimento?</Text>
            <Text style={styles.subtitle}>
              Sua opinião é muito importante para melhorarmos nosso suporte.
            </Text>

            <View style={styles.orbisRow}>
              {SCORE_CONFIG.map((_, i) => (
                <OrbiOption
                  key={i}
                  index={i}
                  selected={score === i + 1}
                  onPress={() => handleOrbiPress(i)}
                  scaleAnim={scaleAnims[i]}
                />
              ))}
            </View>

            <View style={styles.scoreLabelContainer} />

            <Text style={styles.commentLabel}>
              Conte mais sobre sua experiência:
              {isCommentRequired && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={[
                styles.textInput,
                error && isCommentRequired && commentEmpty && styles.textInputError,
              ]}
              placeholder="Escreva seu comentário..."
              placeholderTextColor={Colors.black[300]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={comment}
              onChangeText={text => {
                setComment(text);
                if (error) setError(null);
              }}
              editable={!loading}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              label={loading ? 'Enviando...' : 'Enviar avaliação'}
              onPress={handleSubmit}
              disabled={loading}
              variant="primary"
              style={styles.submitButton}
            />
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}