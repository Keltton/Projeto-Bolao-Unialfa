import React, { useState, useEffect } from "react";
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
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/theme";
import api from "@/services/api";

// Fallback estático caso a API esteja offline
const PROXIMAS_FALLBACK = [
  {
    id: 1,
    selecaoMandante: { nome: "Brasil", codigoFifa: "BRA", bandeiraUrl: "https://flagcdn.com/w160/br.png" },
    selecaoVisitante: { nome: "Argentina", codigoFifa: "ARG", bandeiraUrl: "https://flagcdn.com/w160/ar.png" },
    dataHora: "2026-06-21T16:00:00",
    estadio: "MetLife Stadium",
    fase: "GRUPOS",
    grupo: "C",
  },
  {
    id: 2,
    selecaoMandante: { nome: "França", codigoFifa: "FRA", bandeiraUrl: "https://flagcdn.com/w80/fr.png" },
    selecaoVisitante: { nome: "Alemanha", codigoFifa: "GER", bandeiraUrl: "https://flagcdn.com/w80/de.png" },
    dataHora: "2026-06-21T13:00:00",
    estadio: "Rose Bowl",
    fase: "GRUPOS",
    grupo: "D",
  },
  {
    id: 3,
    selecaoMandante: { nome: "Portugal", codigoFifa: "POR", bandeiraUrl: "https://flagcdn.com/w80/pt.png" },
    selecaoVisitante: { nome: "Espanha", codigoFifa: "ESP", bandeiraUrl: "https://flagcdn.com/w80/es.png" },
    dataHora: "2026-06-22T10:00:00",
    estadio: "SoFi Stadium",
    fase: "GRUPOS",
    grupo: "E",
  }
];

export default function Home() {
  const router = useRouter();
  const theme = Colors.dark; // Forçar visual escuro premium conforme mockups

  const [usuario, setUsuario] = useState<any>({
    nome: "Usuário",
    pontuacaoTotal: 0,
    posicao: "—",
  });
  const [proximasPartidas, setProximasPartidas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Formatar data hora para exibição
  const formatarData = (dataStr: string) => {
    try {
      const data = new Date(dataStr);
      const dia = String(data.getDate()).padStart(2, "0");
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const horas = String(data.getHours()).padStart(2, "0");
      const minutos = String(data.getMinutes()).padStart(2, "0");
      return `${dia}/${mes} • ${horas}:${minutos}`;
    } catch {
      return dataStr;
    }
  };

  const carregarDados = async () => {
    setIsLoading(true);
    
    // 1. Carregar usuário do storage local
    try {
      const userStr = await AsyncStorage.getItem("@BolaoCopa:usuario");
      if (userStr) {
        const u = JSON.parse(userStr);
        setUsuario({
          nome: u.nome || "Usuário",
          pontuacaoTotal: u.pontuacaoTotal ?? 0,
          posicao: u.posicao ?? "—",
        });
      }
    } catch (e) {
      console.log("Erro ao carregar usuário do storage", e);
    }

    // 2. Carregar partidas da API
    try {
      const response = await api.get("/api/partidas/proximas");
      
      // Ajustar mapeamento caso a API retorne DTO com selecaoA e selecaoB
      const partidasMapeadas = response.data.map((p: any) => ({
        id: p.id,
        selecaoMandante: p.selecaoMandante || p.selecaoA,
        selecaoVisitante: p.selecaoVisitante || p.selecaoB,
        dataHora: p.dataHora,
        estadio: p.estadio,
        fase: p.fase,
        grupo: p.grupo,
      }));

      setProximasPartidas(partidasMapeadas);
    } catch (error: any) {
      console.log("API offline, carregando fallback das proximas partidas:", error.message);
      // Fallback offline silencioso para testes do desenvolvedor
      setProximasPartidas(PROXIMAS_FALLBACK);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const partidaDestaque = proximasPartidas[0];
  const listaSecundaria = proximasPartidas.slice(1);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Bar / Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={[styles.avatarBorder, { borderColor: theme.primary }]}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" }}
              style={styles.avatar}
            />
          </View>
          <View>
            <Text style={[styles.welcomeText, { color: theme.text }]}>Olá, {usuario.nome}! 👋</Text>
            <Text style={[styles.subWelcomeText, { color: theme.textSecondary }]}>Que venham os jogos!</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton} onPress={carregarDados}>
          <Ionicons name="refresh-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Carregando partidas...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Sua pontuação</Text>
              <View style={styles.statNumberContainer}>
                <Text style={[styles.statNumber, { color: theme.primary }]}>{usuario.pontuacaoTotal}</Text>
                <Text style={[styles.statUnit, { color: theme.primary }]}>pontos</Text>
              </View>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Sua posição</Text>
              <View style={styles.statNumberContainer}>
                <Text style={[styles.statNumber, { color: theme.secondary }]}>{usuario.posicao}</Text>
                <Text style={[styles.statUnit, { color: theme.secondary }]}>º lugar</Text>
              </View>
            </View>
          </View>

          {/* Section Title */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Próximas partidas</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/partidas")}>
              <Text style={[styles.seeAllButton, { color: theme.primary }]}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {/* Destaque */}
          {partidaDestaque && (
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
                    source={{ uri: partidaDestaque.selecaoMandante.bandeiraUrl || "https://flagcdn.com/w160/br.png" }}
                    style={styles.flag}
                  />
                  <Text style={[styles.teamName, { color: theme.text }]}>
                    {partidaDestaque.selecaoMandante.nome.toUpperCase()}
                  </Text>
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
                    source={{ uri: partidaDestaque.selecaoVisitante.bandeiraUrl || "https://flagcdn.com/w160/ar.png" }}
                    style={styles.flag}
                  />
                  <Text style={[styles.teamName, { color: theme.text }]}>
                    {partidaDestaque.selecaoVisitante.nome.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.matchMeta}>
                <View style={styles.metaRow}>
                  <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    {" "}{formatarData(partidaDestaque.dataHora)}
                  </Text>
                </View>
                <Text style={[styles.groupText, { color: theme.primary }]}>
                  {partidaDestaque.fase} {partidaDestaque.grupo ? `• Grupo ${partidaDestaque.grupo}` : ""}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.palpiteButton, { backgroundColor: theme.secondary }]}
                onPress={() => router.push(`/partidas/${partidaDestaque.id}`)}
              >
                <Ionicons name="create-outline" size={20} color={theme.background} />
                <Text style={[styles.palpiteButtonText, { color: theme.background }]}>FAZER PALPITE</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Lista Secundária */}
          <View style={styles.listContainer}>
            {listaSecundaria.map((partida) => (
              <TouchableOpacity
                key={partida.id}
                style={[styles.matchRow, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
                onPress={() => router.push(`/partidas/${partida.id}`)}
              >
                <View style={styles.rowTeam}>
                  <Image source={{ uri: partida.selecaoMandante.bandeiraUrl }} style={styles.smallFlag} />
                  <Text style={[styles.rowTeamText, { color: theme.text }]} numberOfLines={1}>
                    {partida.selecaoMandante.nome}
                  </Text>
                </View>

                <View style={styles.rowInfo}>
                  <Text style={[styles.rowDate, { color: theme.text }]}>
                    {formatarData(partida.dataHora)}
                  </Text>
                  <Text style={[styles.rowGroup, { color: theme.textSecondary }]} numberOfLines={1}>
                    {partida.fase} {partida.grupo ? `• Gp ${partida.grupo}` : ""}
                  </Text>
                </View>

                <View style={[styles.rowTeam, styles.alignRight]}>
                  <Text style={[styles.rowTeamText, { color: theme.text }]} numberOfLines={1}>
                    {partida.selecaoVisitante.nome}
                  </Text>
                  <Image source={{ uri: partida.selecaoVisitante.bandeiraUrl }} style={styles.smallFlag} />
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} style={styles.chevron} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
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
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "600",
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
    width: 100,
  },
  rowDate: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  rowGroup: {
    fontSize: 9,
    marginTop: 1,
    textAlign: "center",
  },
  chevron: {
    marginLeft: 6,
  },
});
