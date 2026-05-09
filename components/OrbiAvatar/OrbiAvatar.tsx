import React from 'react';
import { Image, View } from 'react-native';
import styles from './orbiAvatar.styles';

type Variant = 'default' | 'sleep' | 'elipse' | 'camera' | 'white';

type Props = {
  variant?: Variant;
  size?: number;
};

const IMAGES = {
  default: require('@/assets/logos/Orbi.png'),
  elipse: require('@/assets/logos/orbi_welcome.svg'),
  camera: require('@/assets/logos/orbi_camera.svg'),
  white: require('@/assets/logos/orbi_elipse_white.svg'),
  sleep: require('@/assets/logos/Orbi Sleep.png'),
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