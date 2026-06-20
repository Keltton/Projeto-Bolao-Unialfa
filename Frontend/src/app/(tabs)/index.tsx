import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  ImageStyle,
  StyleProp,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { listarProximasPartidas } from "@/services/partidaService";
import { listarMeusPalpites } from "@/services/palpiteService";
import { obterRanking } from "@/services/rankingService";
import { getApiErrorMessage } from "@/services/api";
import { Partida } from "@/types/Partida";
import { Palpite } from "@/types/Palpite";
import { formatarDataPartida } from "@/util/formatDate";
import { resolveImageUrl } from "@/util/imageUrl";

export default function Home() {
  const router = useRouter();
  const theme = Colors.dark;
  const { user } = useAuth();

  const [proximas, setProximas] = useState<Partida[]>([]);
  const [palpites, setPalpites] = useState<Palpite[]>([]);
  const [posicao, setPosicao] = useState<number | null>(null);
  const [totalParticipantes, setTotalParticipantes] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [loading, setLoading] = useState(true);

  const carregarHome = useCallback(async () => {
    setLoading(true);
    try {
      const [partidasData, palpitesData, rankingData] = await Promise.all([
        listarProximasPartidas(),
        listarMeusPalpites(),
        obterRanking(0, 50),
      ]);

      setProximas(partidasData);
      setPalpites(palpitesData);
      setPosicao(rankingData.posicaoUsuarioAutenticado);
      setTotalParticipantes(rankingData.totalElementos);

      const euNoRanking = rankingData.ranking.find((r) => r.id === user?.id);
      setPontuacao(euNoRanking?.pontuacaoTotal ?? user?.pontuacaoTotal ?? 0);
    } catch (error) {
      console.error(getApiErrorMessage("Erro ao carregar home."));
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.pontuacaoTotal]);

  useFocusEffect(
    useCallback(() => {
      carregarHome();
    }, [carregarHome])
  );

  const destaque = proximas[0] ?? null;
  const outras = proximas.slice(1, 3);
  const primeiroNome = user?.nome?.split(" ")[0] ?? "Jogador";
  const avatarUri = resolveImageUrl(user?.avatarUrl);

  const buscarPalpite = (partidaId: number) =>
    palpites.find((p) => p.partida.id === partidaId);

  const renderBandeira = (url?: string | null, style: StyleProp<ImageStyle> = styles.flag) => {
    const uri = resolveImageUrl(url);
    if (!uri) {
      return <View style={[style, { backgroundColor: theme.border }]} />;
    }
    return <Image source={{ uri }} style={style} resizeMode="cover" />;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={[styles.avatarBorder, { borderColor: theme.primary }]}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: theme.border, justifyContent: "center", alignItems: "center" },
                ]}
              >
                <Ionicons name="person" size={20} color={theme.textSecondary} />
              </View>
            )}
          </View>
          <View>
            <Text style={[styles.welcomeText, { color: theme.text }]}>
              Olá, {primeiroNome}! 👋
            </Text>
            <Text style={[styles.subWelcomeText, { color: theme.textSecondary }]}>
              Que venham os jogos!
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={theme.textSecondary} />
          <View style={[styles.notificationBadge, { backgroundColor: theme.secondary }]} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Sua pontuação</Text>
            <View style={styles.statNumberContainer}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>{pontuacao}</Text>
              <Text style={[styles.statUnit, { color: theme.primary }]}>pontos</Text>
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Sua posição</Text>
            <View style={styles.statNumberContainer}>
              <Text style={[styles.statNumber, { color: theme.secondary }]}>
                {posicao != null ? `${posicao}º` : "—"}
              </Text>
              <Text style={[styles.statUnit, { color: theme.secondary }]}>
                de {totalParticipantes}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Próximas partidas</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/partidas")}>
            <Text style={[styles.seeAllButton, { color: theme.primary }]}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 40 }} />
        ) : destaque ? (
          <View style={[styles.featuredCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <View style={styles.badgeContainer}>
              <Text style={[styles.featuredBadge, { backgroundColor: theme.secondary, color: theme.text }]}>
                EM DESTAQUE
              </Text>
            </View>

            <View style={styles.teamsRow}>
              <View style={styles.teamContainer}>
                {renderBandeira(destaque.selecaoA.bandeiraUrl)}
                <Text style={[styles.teamName, { color: theme.text }]}>
                  {destaque.selecaoA.nome.toUpperCase()}
                </Text>
              </View>

              <View style={styles.vsContainer}>
                {(() => {
                  const palpite = buscarPalpite(destaque.id);
                  return (
                    <>
                      <View style={[styles.scoreBox, { backgroundColor: theme.border }]}>
                        <Text style={[styles.scoreText, { color: theme.textSecondary }]}>
                          {palpite ? palpite.golsSelecaoA : "—"}
                        </Text>
                      </View>
                      <Text style={[styles.vsText, { color: theme.primary }]}>VS</Text>
                      <View style={[styles.scoreBox, { backgroundColor: theme.border }]}>
                        <Text style={[styles.scoreText, { color: theme.textSecondary }]}>
                          {palpite ? palpite.golsSelecaoB : "—"}
                        </Text>
                      </View>
                    </>
                  );
                })()}
              </View>

              <View style={styles.teamContainer}>
                {renderBandeira(destaque.selecaoB.bandeiraUrl)}
                <Text style={[styles.teamName, { color: theme.text }]}>
                  {destaque.selecaoB.nome.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.matchMeta}>
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                  {" "}{formatarDataPartida(destaque.dataHora)}
                </Text>
              </View>
              {destaque.grupo && (
                <Text style={[styles.groupText, { color: theme.primary }]}>
                  Grupo {destaque.grupo}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.palpiteButton, { backgroundColor: theme.secondary }]}
              onPress={() => router.push(`/partidas/${destaque.id}`)}
            >
              <Ionicons name="create-outline" size={20} color={theme.background} />
              <Text style={[styles.palpiteButtonText, { color: theme.background }]}>
                {buscarPalpite(destaque.id) ? "EDITAR PALPITE" : "FAZER PALPITE"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={{ color: theme.textSecondary, textAlign: "center", marginVertical: 24 }}>
            Nenhuma partida próxima agendada.
          </Text>
        )}

        <View style={styles.listContainer}>
          {outras.map((partida) => (
            <TouchableOpacity
              key={partida.id}
              style={[styles.matchRow, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
              onPress={() => router.push(`/partidas/${partida.id}`)}
            >
              <View style={styles.rowTeam}>
                {renderBandeira(partida.selecaoA.bandeiraUrl, styles.smallFlag)}
                <Text style={[styles.rowTeamText, { color: theme.text }]} numberOfLines={1}>
                  {partida.selecaoA.nome}
                </Text>
              </View>

              <View style={styles.rowInfo}>
                <Text style={[styles.rowDate, { color: theme.text }]}>
                  {formatarDataPartida(partida.dataHora)}
                </Text>
                {partida.grupo && (
                  <Text style={[styles.rowGroup, { color: theme.textSecondary }]}>
                    Grupo {partida.grupo}
                  </Text>
                )}
              </View>

              <View style={[styles.rowTeam, styles.alignRight]}>
                <Text style={[styles.rowTeamText, { color: theme.text }]} numberOfLines={1}>
                  {partida.selecaoB.nome}
                </Text>
                {renderBandeira(partida.selecaoB.bandeiraUrl, styles.smallFlag)}
              </View>

              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} style={styles.chevron} />
            </TouchableOpacity>
          ))}
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