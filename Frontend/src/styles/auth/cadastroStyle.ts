import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    outerContainer: {
      flex: 1,
      backgroundColor: "#091421",
    },
    container: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(9, 20, 33, 0.85)",
    },
    safeArea: {
      flex: 1,
    },
    scroll: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingVertical: 20,
    },
    brandContainer: {
      alignItems: "center",
      marginTop: 20,
      marginBottom: 15,
    },
    logoIcon: {
      marginBottom: 4,
      shadowColor: "#ffe243",
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    title: {
      fontSize: 22,
      fontWeight: "900",
      textAlign: "center",
      lineHeight: 26,
      letterSpacing: -0.5,
    },
    cardContainer: {
      marginVertical: 10,
    },
    cardHeader: {
      alignItems: "center",
      marginBottom: 16,
    },
    welcomeTitle: {
      fontSize: 18,
      fontWeight: "800",
      marginBottom: 4,
    },
    welcomeSubtitle: {
      fontSize: 13,
      textAlign: "center",
    },
    form: {
      gap: 12,
    },
    inputGroup: {
      gap: 6,
    },
    label: {
      fontSize: 12,
      fontWeight: "600",
      paddingLeft: 4,
    },
    glassInput: {
      height: 52,
      borderWidth: 1,
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      gap: 12,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    textInput: {
      flex: 1,
      height: "100%",
      fontSize: 14,
    },
    actionsContainer: {
      marginTop: 15,
      gap: 12,
    },
    errorBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: "rgba(255, 107, 107, 0.15)",
      borderWidth: 1,
      borderColor: "rgba(255, 107, 107, 0.4)",
      borderRadius: 10,
      padding: 12,
    },
    errorText: {
      flex: 1,
      color: "#ff6b6b",
      fontSize: 13,
      fontWeight: "600",
    },
    registerBtn: {
      height: 52,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 3,
    },
    registerBtnText: {
      fontSize: 15,
      fontWeight: "800",
      letterSpacing: 0.5,
    },
    backToLoginBtn: {
      alignItems: "center",
      paddingVertical: 10,
    },
    loginText: {
      fontSize: 13,
      color: "#bdcab9",
    },
    loginHighlight: {
      fontWeight: "700",
    },
});