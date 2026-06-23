import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(6, 14, 18, 0.88)",
  },

  safeArea: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#091421",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 14,
  },

  brandContainer: {
    alignItems: "center",
    marginBottom: 42,
  },

  logoCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 1.5,
    borderColor: "#9DFF00",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    backgroundColor: "rgba(9, 20, 33, 0.75)",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 36,
    fontWeight: "900",
    textAlign: "center",
    fontStyle: "italic",
  },

  titleHighlight: {
    color: "#9DFF00",
  },

  subtitle: {
    marginTop: 8,
    color: "#D6E3C4",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },

  actionsContainer: {
    width: "100%",
  },

  primaryButton: {
    height: 54,
    borderRadius: 8,
    backgroundColor: "#9DFF00",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  primaryButtonText: {
    color: "#091421",
    fontSize: 17,
    fontWeight: "800",
  },

  secondaryButton: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#9DFF00",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "rgba(9, 20, 33, 0.45)",
  },

  secondaryButtonText: {
    color: "#9DFF00",
    fontSize: 16,
    fontWeight: "800",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },

  dividerText: {
    color: "#D6E3C4",
    fontSize: 11,
    fontWeight: "700",
    marginHorizontal: 14,
  },

  visitorButton: {
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },

  visitorButtonText: {
    color: "#D6E3C4",
    fontSize: 12,
    fontWeight: "800",
  },
});