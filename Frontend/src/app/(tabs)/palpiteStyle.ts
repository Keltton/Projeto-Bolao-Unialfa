import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    centerContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
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
    errorText: {
      textAlign: "center",
      paddingHorizontal: 20,
      marginBottom: 8,
      fontSize: 13,
    },
    emptyText: {
      textAlign: "center",
      marginTop: 40,
      fontSize: 14,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
      flexGrow: 1,
    },
    card: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    phaseText: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 0.8,
      flex: 1,
      marginRight: 8,
    },
    pointsBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
    },
    pointsText: {
      fontSize: 11,
      fontWeight: "800",
    },
    matchRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 6,
    },
    team: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flex: 1.2,
    },
    alignRight: {
      justifyContent: "flex-end",
    },
    flag: {
      width: 32,
      height: 22,
      borderRadius: 3,
    },
    teamName: {
      fontSize: 14,
      fontWeight: "700",
      flex: 1,
    },
    scoresContainer: {
      flex: 1.5,
      alignItems: "center",
      justifyContent: "center",
    },
    predictionBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    scoreNumber: {
      fontSize: 20,
      fontWeight: "800",
    },
    labelPrediction: {
      fontSize: 9,
      fontWeight: "500",
      textTransform: "uppercase",
    },
    realBox: {
      marginTop: 6,
    },
    realScore: {
      fontSize: 11,
      fontWeight: "600",
    },
    cardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopWidth: 1,
      paddingTop: 12,
      marginTop: 14,
    },
    footerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      flex: 1,
    },
    criterioText: {
      fontSize: 12,
      fontWeight: "600",
    },
    editButton: {
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    editButtonText: {
      fontSize: 12,
      fontWeight: "700",
    },
});