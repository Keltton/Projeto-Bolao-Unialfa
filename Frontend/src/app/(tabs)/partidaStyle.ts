import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
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
    filterBar: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      gap: 8,
    },
    filterItem: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
    },
    filterText: {
      fontSize: 12,
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
      flexGrow: 1,
    },
    centerContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    emptyContainer: {
      paddingVertical: 40,
      alignItems: "center",
    },
    errorText: {
      color: "#ff6b6b",
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 12,
    },
    retryBtn: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 1,
    },
    retryText: {
      fontSize: 13,
      fontWeight: "700",
    },
    emptyText: {
      fontSize: 14,
      textAlign: "center",
    },
    matchCard: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 3,
    },
    matchHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    phaseText: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 0.8,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    statusText: {
      fontSize: 9,
      fontWeight: "700",
    },
    teamsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 10,
    },
    teamContainer: {
      alignItems: "center",
      flex: 1,
    },
    flag: {
      width: 44,
      height: 30,
      borderRadius: 4,
      resizeMode: "cover",
    },
    teamName: {
      fontSize: 13,
      fontWeight: "700",
      marginTop: 6,
      textAlign: "center",
    },
    vsContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
    },
    vsBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    vsText: {
      fontSize: 11,
      fontWeight: "700",
    },
    scoreRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    scoreNumber: {
      fontSize: 22,
      fontWeight: "800",
    },
    matchFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: "rgba(255, 255, 255, 0.05)",
      paddingTop: 12,
      marginTop: 12,
    },
    footerInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    footerText: {
      fontSize: 11,
      flexShrink: 1,
    },
});