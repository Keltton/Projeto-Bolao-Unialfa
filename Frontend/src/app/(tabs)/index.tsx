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
import { ActivityIndicator, Image, ImageStyle, SafeAreaView, ScrollView, StyleProp, Text, TouchableOpacity, View, Alert, Platform, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "@/styles/tabs/indexStyle";
import { listarNotificacoes, Notificacao } from "@/services/notificacaoService";

export default function Home() {
  const router = useRouter();
  const theme = Colors.dark;
  const { user, isAuthenticated  } = useAuth();

  const [proximas, setProximas] = useState<Partida[]>([]);
  const [palpites, setPalpites] = useState<Palpite[]>([]);
  const [posicao, setPosicao] = useState<number | null>(null);
  const [totalParticipantes, setTotalParticipantes] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [mostrarBadge, setMostrarBadge] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [idsExcluidos, setIdsExcluidos] = useState<string[]>([]);

  const carregarHome = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const excluidosJson = await AsyncStorage.getItem("notificacoes_excluidas");
      const excluidos: string[] = excluidosJson ? JSON.parse(excluidosJson) : [];
      setIdsExcluidos(excluidos);

      const [partidasData, palpitesData, rankingData, notificacoesData] = await Promise.all([
        listarProximasPartidas(),
        listarMeusPalpites(),
        obterRanking(0, 50),
        listarNotificacoes(),
      ]);

      setProximas(partidasData);
      setPalpites(palpitesData);
      setPosicao(rankingData.posicaoUsuarioAutenticado);
      setTotalParticipantes(rankingData.totalElementos);

      // Filtra as notificacoes que foram excluidas localmente
      const ativas = notificacoesData.filter((n) => !excluidos.includes(n.id));
      setNotificacoes(ativas);
      setMostrarBadge(ativas.length > 0);

      const euNoRanking = rankingData.ranking.find((r) => r.id === user?.id);
      setPontuacao(euNoRanking?.pontuacaoTotal ?? user?.pontuacaoTotal ?? 0);
    } catch (error) {
      console.error(getApiErrorMessage(error, "Erro ao carregar home."));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, user?.pontuacaoTotal]);

  const handleExibirNotificacoes = () => {
    setModalVisivel(true);
    setMostrarBadge(false);
  };

  const handleExcluirNotificacao = async (id: string) => {
    try {
      const novosExcluidos = [...idsExcluidos, id];
      setIdsExcluidos(novosExcluidos);
      await AsyncStorage.setItem("notificacoes_excluidas", JSON.stringify(novosExcluidos));
      const ativas = notificacoes.filter((n) => n.id !== id);
      setNotificacoes(ativas);
      setMostrarBadge(ativas.length > 0);
    } catch (error) {
      console.error("Erro ao excluir notificação:", error);
    }
  };

  const handleLimparTudo = async () => {
    try {
      const novosExcluidos = [...idsExcluidos, ...notificacoes.map((n) => n.id)];
      setIdsExcluidos(novosExcluidos);
      await AsyncStorage.setItem("notificacoes_excluidas", JSON.stringify(novosExcluidos));
      setNotificacoes([]);
      setMostrarBadge(false);
    } catch (error) {
      console.error("Erro ao limpar notificações:", error);
    }
  };

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
        <TouchableOpacity style={styles.notificationButton} onPress={handleExibirNotificacoes}>
          <Ionicons name="notifications-outline" size={24} color={theme.textSecondary} />
          {mostrarBadge && (
            <View style={[styles.notificationBadge, { backgroundColor: theme.secondary }]} />
          )}
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
              <Text style={[styles.featuredBadge, { backgroundColor: theme.secondary, color: theme.background }]}>
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

      <Modal
        visible={modalVisivel}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Notificações</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={true}>
              {notificacoes.length === 0 ? (
                <Text style={[styles.modalEmptyText, { color: theme.textSecondary }]}>
                  Você não possui novas notificações.
                </Text>
              ) : (
                notificacoes.map((n) => (
                  <View key={n.id} style={[styles.notificationCard, { borderBottomColor: theme.border }]}>
                    <View style={styles.notificationHeaderRow}>
                      <Text style={[styles.notificationTitle, { color: theme.text }]}>
                        {n.titulo}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Text style={[styles.notificationDate, { color: theme.textSecondary }]}>
                          {n.data}
                        </Text>
                        <TouchableOpacity onPress={() => handleExcluirNotificacao(n.id)}>
                          <Ionicons name="trash-outline" size={16} color="#FF4D4D" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={[styles.notificationMsg, { color: theme.textSecondary }]}>
                      {n.mensagem}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              {notificacoes.length > 0 && (
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#FF4D4D", marginRight: 8 }]}
                  onPress={handleLimparTudo}
                >
                  <Text style={styles.modalButtonText}>Limpar Tudo</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
