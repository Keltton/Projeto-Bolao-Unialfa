import { Colors } from "@/constants/theme";
import { guestGateStyles as styles } from "@/styles/shared/guestGateStyle";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

type GuestGateProps = {
  title: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  message: string;
  primaryLabel?: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export function GuestGate({
  title,
  icon,
  message,
  primaryLabel = "Entrar",
  onPrimary,
  secondaryLabel = "Criar conta",
  onSecondary,
}: GuestGateProps) {
  const theme = Colors.dark;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text>
      </View>

      <View style={styles.centerContent}>
        <Ionicons name={icon} size={52} color={theme.textSecondary} />

        <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>

        <TouchableOpacity
          style={[styles.primaryButton, { borderColor: theme.secondary, backgroundColor: theme.secondary }]}
          onPress={onPrimary}
        >
          <Text style={[styles.primaryButtonText, { color: theme.background }]}>{primaryLabel}</Text>
        </TouchableOpacity>

        {onSecondary && (
          <TouchableOpacity style={styles.secondaryButton} onPress={onSecondary}>
            <Text style={[styles.secondaryButtonText, { color: theme.secondary }]}>{secondaryLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
