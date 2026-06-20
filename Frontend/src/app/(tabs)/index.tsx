import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

export default function Home() {
  const router = useRouter();
  const theme = Colors.dark; // Forçar visual escuro premium conforme mockups

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Sticky Top Bar / Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={[styles.avatarBorder, { borderColor: theme.primary }]}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" }}
              style={styles.avatar}
            />
          </View>
          <View>
            <Text style={[styles.welcomeText, { color: theme.text }]}>Olá, Rafael! 👋</Text>
            <Text style={[styles.subWelcomeText, { color: theme.textSecondary }]}>Que venham os jogos!</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={theme.textSecondary} />
          <View style={[styles.notificationBadge, { backgroundColor: theme.secondary }]} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats Bento Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Sua pontuação</Text>
            <View style={styles.statNumberContainer}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>125</Text>
              <Text style={[styles.statUnit, { color: theme.primary }]}>pontos</Text>
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Sua posição</Text>
            <View style={styles.statNumberContainer}>
              <Text style={[styles.statNumber, { color: theme.secondary }]}>12º</Text>
              <Text style={[styles.statUnit, { color: theme.secondary }]}>de 1.234</Text>
            </View>
          </View>
        </View>

        {/* Featured Match Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Próximas partidas</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/partidas")}>
            <Text style={[styles.seeAllButton, { color: theme.primary }]}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Match Card */}
        <View style={[styles.featuredCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <View style={styles.badgeContainer}>
            <Text style={[styles.featuredBadge, { backgroundColor: theme.secondary, color: theme.text }]}>
              EM DESTAQUE
            </Text>
          </View>

          <View style={styles.teamsRow}>
            {/* Team A */}
            <View style={styles.teamContainer}>
              <Image
                source={{ uri: "https://flagcdn.com/w160/br.png" }}
                style={styles.flag}
              />
              <Text style={[styles.teamName, { color: theme.text }]}>BRASIL</Text>
            </View>

            {/* VS Box */}
            <View style={styles.vsContainer}>
              <View style={[styles.scoreBox, { backgroundColor: theme.border }]}>
                <Text style={[styles.scoreText, { color: theme.textSecondary }]}>—</Text>
              </View>
              <Text style={[styles.vsText, { color: theme.primary }]}>VS</Text>
              <View style={[styles.scoreBox, { backgroundColor: theme.border }]}>
                <Text style={[styles.scoreText, { color: theme.textSecondary }]}>—</Text>
              </View>
            </View>

            {/* Team B */}
            <View style={styles.teamContainer}>
              <Image
                source={{ uri: "https://flagcdn.com/w160/ar.png" }}
                style={styles.flag}
              />
              <Text style={[styles.teamName, { color: theme.text }]}>ARGENTINA</Text>
            </View>
          </View>

          <View style={styles.matchMeta}>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}> 21/06 • 16:00</Text>
            </View>
            <Text style={[styles.groupText, { color: theme.primary }]}>Grupo C</Text>
          </View>

          <TouchableOpacity
            style={[styles.palpiteButton, { backgroundColor: theme.secondary }]}
            onPress={() => router.push("/partidas/1")}
          >
            <Ionicons name="create-outline" size={20} color={theme.background} />
            <Text style={[styles.palpiteButtonText, { color: theme.background }]}>FAZER PALPITE</Text>
          </TouchableOpacity>
        </View>

        {/* Secondary Match List */}
        <View style={styles.listContainer}>
          {/* Match 2 */}
          <TouchableOpacity
            style={[styles.matchRow, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
            onPress={() => router.push("/partidas/2")}
          >
            <View style={styles.rowTeam}>
              <Image source={{ uri: "https://flagcdn.com/w80/fr.png" }} style={styles.smallFlag} />
              <Text style={[styles.rowTeamText, { color: theme.text }]}>França</Text>
            </View>

            <View style={styles.rowInfo}>
              <Text style={[styles.rowDate, { color: theme.text }]}>21/06 • 13:00</Text>
              <Text style={[styles.rowGroup, { color: theme.textSecondary }]}>Grupo D</Text>
            </View>

            <View style={[styles.rowTeam, styles.alignRight]}>
              <Text style={[styles.rowTeamText, { color: theme.text }]}>Alemanha</Text>
              <Image source={{ uri: "https://flagcdn.com/w80/de.png" }} style={styles.smallFlag} />
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} style={styles.chevron} />
          </TouchableOpacity>

          {/* Match 3 */}
          <TouchableOpacity
            style={[styles.matchRow, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
            onPress={() => router.push("/partidas/3")}
          >
            <View style={styles.rowTeam}>
              <Image source={{ uri: "https://flagcdn.com/w80/pt.png" }} style={styles.smallFlag} />
              <Text style={[styles.rowTeamText, { color: theme.text }]}>Portugal</Text>
            </View>

            <View style={styles.rowInfo}>
              <Text style={[styles.rowDate, { color: theme.text }]}>22/06 • 10:00</Text>
              <Text style={[styles.rowGroup, { color: theme.textSecondary }]}>Grupo E</Text>
            </View>

            <View style={[styles.rowTeam, styles.alignRight]}>
              <Text style={[styles.rowTeamText, { color: theme.text }]}>Espanha</Text>
              <Image source={{ uri: "https://flagcdn.com/w80/es.png" }} style={styles.smallFlag} />
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} style={styles.chevron} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 15,
    paddingBottom: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarBorder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "700",
  },
  subWelcomeText: {
    fontSize: 12,
    marginTop: 1,
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginTop: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 6,
  },
  statNumberContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
  },
  statUnit: {
    fontSize: 12,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: "600",
  },
  featuredCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    position: "relative",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  badgeContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    overflow: "hidden",
    borderTopRightRadius: 19,
    borderBottomLeftRadius: 12,
  },
  featuredBadge: {
    fontSize: 9,
    fontWeight: "800",
    paddingHorizontal: 12,
    paddingVertical: 6,
    letterSpacing: 0.8,
  },
  teamsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  teamContainer: {
    alignItems: "center",
    flex: 1,
  },
  flag: {
    width: 60,
    height: 40,
    borderRadius: 6,
    resizeMode: "cover",
  },
  teamName: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },
  vsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  scoreBox: {
    width: 32,
    height: 38,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "700",
  },
  vsText: {
    fontSize: 12,
    fontWeight: "700",
    fontStyle: "italic",
  },
  matchMeta: {
    alignItems: "center",
    gap: 4,
    marginBottom: 18,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    fontWeight: "500",
  },
  groupText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  palpiteButton: {
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  palpiteButtonText: {
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  listContainer: {
    gap: 12,
  },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  rowTeam: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  alignRight: {
    justifyContent: "flex-end",
  },
  smallFlag: {
    width: 30,
    height: 20,
    borderRadius: 3,
  },
  rowTeamText: {
    fontSize: 13,
    fontWeight: "600",
  },
  rowInfo: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  rowDate: {
    fontSize: 11,
    fontWeight: "700",
  },
  rowGroup: {
    fontSize: 9,
    marginTop: 1,
  },
  chevron: {
    marginLeft: 6,
  },
});
