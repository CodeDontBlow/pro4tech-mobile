import React from 'react';
import { Image, View } from 'react-native';
import styles from './orbiAvatar.styles';

type Variant = 'default' | 'sleep' | 'angry' | 'bored' | 'neutral' | 'happy' | 'love';

type Props = {
  variant?: Variant;
  size?: number;
};

const IMAGES = {
  default: require('@/assets/logos/Orbi.png'),
  sleep:   require('@/assets/logos/Orbi Sleep.png'),
  angry:   require('@/assets/logos/Orbi Angry.png'),
  bored:   require('@/assets/logos/Orbi Bored.png'),
  neutral: require('@/assets/logos/Orbi Neutral.png'),
  happy:   require('@/assets/logos/Orbi Happy.png'),
  love:    require('@/assets/logos/Orbi Love.png'),
};

export default function OrbiAvatar({ variant = 'default', size = 120 }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={IMAGES[variant]}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}