import { StyleSheet } from "react-native";

export const formStyles = StyleSheet.create({
  formCard: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    paddingLeft: 4,
  },
  glassInput: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  textInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
  },
  primaryButton: {
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
