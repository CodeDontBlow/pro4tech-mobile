import { Image } from 'expo-image';
const orbi = require('../../assets/logos/Orbi.png') as any;
const orbiUser = require('../../assets/logos/orbi-user.png') as any;

type AvatarProps = {
    bot?: boolean;
    ratio?: number;
    src?: string | null;
    alt?: string;
    style?: { [key: string]: any;};
};

export function getAvatarUrl(src?: string | null, bot?: boolean) {
  if (bot) {
    return orbi;
  }
  return src ? src : orbiUser;
}

export default function Avatar({ src, alt, style, ratio = 32, bot }: AvatarProps) {
  const final = getAvatarUrl(src, bot);

  return (
    <Image source={final} alt={alt} style={[{ width: ratio, height: ratio, borderRadius: 9999}, style]} />
  );
}
