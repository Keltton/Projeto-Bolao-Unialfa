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

scroll: {
  flexGrow: 1,
  paddingHorizontal: 24,
  paddingVertical: 20,
  justifyContent: "center",
},

    brandContainer: {
      alignItems: "center",
      marginTop: 40,
    },
    logoIcon: {
      marginBottom: 8,
      shadowColor: "#ffe243",
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
    title: {
      fontSize: 26,
      fontWeight: "900",
      textAlign: "center",
      lineHeight: 30,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 2.5,
      marginTop: 6,
    },
    cardContainer: {
      marginVertical: 20,
    },
    cardHeader: {
      alignItems: "center",
      marginBottom: 20,
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
      gap: 16,
    },
    inputGroup: {
      gap: 8,
    },
    labelRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    label: {
      fontSize: 13,
      fontWeight: "600",
      paddingLeft: 4,
    },
    forgotPassword: {
      fontSize: 12,
      fontWeight: "600",
      textDecorationLine: "underline",
    },
    glassInput: {
      height: 54,
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
      marginTop: 10,
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
    loginBtn: {
      height: 54,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 3,
    },
    loginBtnText: {
      fontSize: 15,
      fontWeight: "800",
      letterSpacing: 0.5,
    },
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      opacity: 0.2,
    },
    dividerText: {
      fontSize: 11,
      fontWeight: "700",
      marginHorizontal: 16,
      letterSpacing: 1.5,
    },
    registerBtn: {
      height: 54,
      borderRadius: 14,
      borderWidth: 1.5,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    registerBtnText: {
      fontSize: 15,
      fontWeight: "800",
      letterSpacing: 0.5,
    },
    footerContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    footerText: {
      fontSize: 10,
      textAlign: "center",
      lineHeight: 14,
      opacity: 0.6,
    },
});