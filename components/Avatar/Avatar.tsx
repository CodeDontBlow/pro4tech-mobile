import { Image } from 'expo-image';
const orbi = require('../../assets/logos/Orbi.png') as any;
const orbiUser = require('../../assets/logos/orbi-user.png') as any;

type AvatarProps = {
    bot?: boolean;
    fallback?: 'user' | 'orbi';
    ratio?: number;
    src?: string | null;
    alt?: string;
    style?: { [key: string]: any;};
};

export function getAvatarUrl(src?: string | null, bot?: boolean, fallback: 'user' | 'orbi' = 'user') {
  if (bot) {
    return orbi;
  }
  if (src?.trim()) {
    return src;
  }
  if (fallback === 'orbi') {
    return orbi;
  }
  return orbiUser;
}

export default function Avatar({ src, alt, style, ratio = 32, bot, fallback }: AvatarProps) {
  const final = getAvatarUrl(src, bot, fallback);

  return (
        <Image source={final} alt={alt} style={[{ width: ratio, height: ratio, borderRadius: 9999}, style]} />
  );
}
