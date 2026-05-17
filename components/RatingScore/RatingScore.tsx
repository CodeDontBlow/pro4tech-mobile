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

interface StarProps {
  filled: boolean;
  onPress: () => void;
  onHoverIn: () => void;
  onHoverOut: () => void;
  animatedValue: Animated.Value;
}

function Star({ filled, onPress, onHoverIn, onHoverOut, animatedValue }: StarProps) {
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.25],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onHoverIn}
      onPressOut={onHoverOut}
      hitSlop={6}
      style={styles.starWrapper}
    >
      <Animated.Text
        style={[
          styles.starText,
          {
            transform: [{ scale }],
            color: filled ? Colors.orange.base : Colors.white[700],
          },
        ]}
      >
        ★
      </Animated.Text>
    </Pressable>
  );
}

const SCORE_LABELS = ['', 'Muito ruim', 'Ruim', 'Regular', 'Bom', 'Excelente'] as const;

export default function RatingModal({ visible, onSubmit, onDismiss }: RatingModalProps) {
  const [score, setScore] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const starAnimations = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(0))
  ).current;

  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setScore(0);
      setComment('');
      setError(null);
      setLoading(false);
      starAnimations.forEach(anim => anim.setValue(0));
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

  const animateStar = (index: number, toValue: number) => {
    Animated.spring(starAnimations[index], {
      toValue,
      useNativeDriver: false,
      speed: 30,
      bounciness: 10,
    }).start();
  };

  const handleStarPress = (index: number) => {
    setScore(index + 1);
    setError(null);
    starAnimations.forEach((_, i) => animateStar(i, i <= index ? 1 : 0));
  };

  const isCommentRequired = score > 0 && score <= 3;
  const commentEmpty = comment.trim().length === 0;

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
            <OrbiAvatar variant="default" size={72} />
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

            <View style={styles.starsRow}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  filled={i < score || i <= hoveredIndex}
                  onPress={() => handleStarPress(i)}
                  onHoverIn={() => setHoveredIndex(i)}
                  onHoverOut={() => setHoveredIndex(-1)}
                  animatedValue={starAnimations[i]}
                />
              ))}
            </View>

            <View style={styles.scoreLabelContainer}>
              {score > 0 && (
                <Text style={styles.scoreLabel}>{SCORE_LABELS[score]}</Text>
              )}
            </View>

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
              onFocus={() => {}}
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