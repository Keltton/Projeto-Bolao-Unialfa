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
      paddingBottom: 5,
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
      marginTop: 24,
      fontSize: 14,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
      flexGrow: 1,
    },
    headerContainer: {
      alignItems: "center",
      marginTop: 20,
      marginBottom: 10,
    },
    podiumWrapper: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "center",
      width: "100%",
      height: 190,
      marginBottom: 35,
    },
    podiumSeat: {
      alignItems: "center",
      width: "30%",
    },
    seat1: {
      width: "38%",
      zIndex: 10,
    },
    seat2: {
      marginRight: -10,
    },
    seat3: {
      marginLeft: -10,
    },
    avatarWrapper: {
      width: 66,
      height: 66,
      borderRadius: 33,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      overflow: "hidden",
    },
    avatar1: {
      width: 90,
      height: 90,
      borderRadius: 45,
      borderWidth: 3,
      elevation: 8,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },
    podiumAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    avatarImg1: {
      width: 82,
      height: 82,
      borderRadius: 41,
    },
    badgeMedal: {
      position: "absolute",
      bottom: -6,
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#091421",
    },
    medalText: {
      fontSize: 9,
      fontWeight: "800",
      color: "#FFF",
    },
    podiumName: {
      fontSize: 12,
      fontWeight: "700",
      marginTop: 14,
      textAlign: "center",
    },
    name1: {
      fontSize: 15,
      fontWeight: "800",
      marginTop: 16,
    },
    podiumPoints: {
      fontSize: 11,
      marginTop: 2,
    },
    columnTitles: {
      flexDirection: "row",
      width: "100%",
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    colTitle: {
      fontSize: 9,
      fontWeight: "700",
      letterSpacing: 0.8,
    },
    colPos: {
      width: 35,
    },
    colUser: {
      flex: 1,
    },
    colPoints: {
      width: 65,
      textAlign: "center",
    },
    colExatos: {
      width: 55,
      textAlign: "right",
    },
    rowItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
    },
    rowPos: {
      width: 35,
      fontSize: 14,
      fontWeight: "800",
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    rowAvatar: {
      width: 38,
      height: 38,
      borderRadius: 19,
    },
    rowNome: {
      fontSize: 13,
      fontWeight: "700",
    },
    statusLogadoText: {
      fontSize: 8,
      fontWeight: "800",
      marginTop: 2,
      letterSpacing: 0.5,
    },
    rowPontos: {
      width: 65,
      fontSize: 14,
      fontWeight: "800",
      textAlign: "center",
    },
    rowExatos: {
      width: 55,
      fontSize: 13,
      fontWeight: "600",
      textAlign: "right",
    },
});