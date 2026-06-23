import { Platform, StyleSheet } from "react-native";

export const guestGateStyles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 15,
    paddingBottom: 15,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 16,
  },
  primaryButton: {
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    minWidth: 220,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
