import { Colors } from '@/constants/theme';
import { resolveImageUrl } from '@/util/imageUrl';
import { getAvatarColor, getUserInitials } from '@/util/userInitials';
import { Image, ImageStyle, StyleProp, Text, View, ViewStyle } from 'react-native';

type UserAvatarProps = {
  nome: string;
  avatarUrl?: string | null;
  size?: number;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  fontSize?: number;
};

export function UserAvatar({
  nome,
  avatarUrl,
  size = 40,
  style,
  containerStyle,
  fontSize,
}: UserAvatarProps) {
  const theme = Colors.dark;
  const uri = resolveImageUrl(avatarUrl);
  const borderRadius = size / 2;
  const initials = getUserInitials(nome);
  const labelSize = fontSize ?? Math.max(12, Math.round(size * 0.36));

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[
          {
            width: size,
            height: size,
            borderRadius,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: getAvatarColor(nome),
          justifyContent: 'center',
          alignItems: 'center',
        },
        containerStyle,
      ]}
    >
      <Text
        style={{
          color: theme.text,
          fontSize: labelSize,
          fontWeight: '800',
          letterSpacing: 0.5,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
