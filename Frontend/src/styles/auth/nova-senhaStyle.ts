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
      marginBottom: 20,
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
      marginVertical: 15,
    },
    cardHeader: {
      alignItems: "center",
      marginBottom: 20,
    },
    welcomeTitle: {
      fontSize: 18,
      fontWeight: "800",
      marginBottom: 6,
    },
    welcomeSubtitle: {
      fontSize: 13,
      textAlign: "center",
      lineHeight: 18,
    },
    form: {
      gap: 16,
    },
    inputGroup: {
      gap: 8,
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
      marginTop: 10,
      gap: 12,
    },
    saveBtn: {
      height: 52,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 3,
    },
    saveBtnText: {
      fontSize: 15,
      fontWeight: "800",
      letterSpacing: 0.5,
    },
    backToLoginBtn: {
      alignItems: "center",
      paddingVertical: 10,
    },
    backText: {
      fontSize: 13,
      fontWeight: "600",
      textDecorationLine: "underline",
    },
});