import { Colors } from "@/constants/theme";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/services/api";
import { listarMeusPalpites } from "@/services/palpiteService";
import { listarProximasPartidas } from "@/services/partidaService";
import { obterRanking } from "@/services/rankingService";
import { Palpite } from "@/types/Palpite";
import { Partida } from "@/types/Partida";
import { formatarDataPartida } from "@/util/formatDate";
import { resolveImageUrl } from "@/util/imageUrl";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, ImageStyle, SafeAreaView, ScrollView, StyleProp, Text, TouchableOpacity, View } from "react-native";
import { styles } from "@/styles/tabs/indexStyle";

export default function Home() {
  const router = useRouter();
  const theme = Colors.dark;
  const { user, isAuthenticated  } = useAuth();

  const [proximas, setProximas] = useState<Partida[]>([]);
  const [palpites, setPalpites] = useState<Palpite[]>([]);
  const [posicao, setPosicao] = useState<number | null>(null);
  const [totalParticipantes, setTotalParticipantes] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [loading, setLoading] = useState(true);

  const carregarHome = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

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
      console.error(getApiErrorMessage(error, "Erro ao carregar home."));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, user?.pontuacaoTotal]);

  useFocusEffect(
    useCallback(() => {
      carregarHome();
    }, [carregarHome])
  );

  if (!isAuthenticated) {
    return <Redirect href="/(tabs)/partidas" />;
  }

  const destaque = proximas[0] ?? null;
  const outras = proximas.slice(1, 3);
  const primeiroNome = user?.nome?.split(" ")[0] ?? "Jogador";

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
            <UserAvatar
              nome={user?.nome ?? "Jogador"}
              avatarUrl={user?.avatarUrl}
              size={36}
            />
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
