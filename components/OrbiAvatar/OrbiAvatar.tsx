import { Asset } from 'expo-asset';
import React from 'react';
import { Image, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import styles from './orbiAvatar.styles';

type Variant = 'default' | 'sleep' | 'elipse' | 'camera' | 'white' | 'angry' | 'bored' | 'neutral' | 'happy' | 'love';

type Props = {
  variant?: Variant;
  size?: number;
};

const SVG_VARIANTS: Variant[] = ['elipse', 'camera', 'white'];

const IMAGES = {
  default: require('@/assets/logos/Orbi.png'),
  elipse: require('@/assets/logos/orbi_welcome.svg'),
  camera: require('@/assets/logos/orbi_camera.svg'),
  white: require('@/assets/logos/orbi_elipse_white.svg'),
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
      {SVG_VARIANTS.includes(variant) ? (
        <SvgUri
          width={size}
          height={size}
          uri={Asset.fromModule(IMAGES[variant]).uri}
        />
      ) : (
        <Image
          source={IMAGES[variant]}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      )}
    </View>
  );
}