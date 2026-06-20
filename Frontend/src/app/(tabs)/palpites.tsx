import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import api from "@/services/api";

// Fallback estático caso a API esteja offline
const PALPITES_MOCK = [
  {
    id: 101,
    golsMandante: 2,
    golsVisitante: 1,
    pontos: null,
    criterio: null,
    partida: {
      id: 1,
      selecaoA: { nome: "Brasil", bandeiraUrl: "https://flagcdn.com/w80/br.png" },
      selecaoB: { nome: "Argentina", bandeiraUrl: "https://flagcdn.com/w80/ar.png" },
      dataHora: "2026-06-21T16:00:00",
      fase: "GRUPOS",
      status: "AGENDADA",
    },
  },
  {
    id: 102,
    golsMandante: 3,
    golsVisitante: 1,
    pontos: 10,
    criterio: "PLACAR_EXATO",
    partida: {
      id: 4,
      selecaoA: { nome: "Inglaterra", bandeiraUrl: "https://flagcdn.com/w80/gb-eng.png" },
      selecaoB: { nome: "Itália", bandeiraUrl: "https://flagcdn.com/w80/it.png" },
      dataHora: "2026-06-18T18:00:00",
      fase: "GRUPOS",
      status: "ENCERRADA",
      golsMandanteReal: 3,
      golsVisitanteReal: 1,
    },
  },
  {
    id: 103,
    golsMandante: 0,
    golsVisitante: 1,
    pontos: 5,
    criterio: "VENCEDOR_EMPATE",
    partida: {
      id: 5,
      selecaoA: { nome: "Uruguai", bandeiraUrl: "https://flagcdn.com/w80/uy.png" },
      selecaoB: { nome: "Holanda", bandeiraUrl: "https://flagcdn.com/w80/nl.png" },
      dataHora: "2026-06-19T15:00:00",
      fase: "GRUPOS",
      status: "ENCERRADA",
      golsMandanteReal: 0,
      golsVisitanteReal: 2,
    },
  }
];

export default function Palpites() {
  const router = useRouter();
  const theme = Colors.dark;

  const [palpites, setPalpites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const carregarPalpites = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/palpites/meus");
      
      const palpitesMapeados = response.data.map((p: any) => ({
        id: p.id,
        golsMandante: p.golsMandante,
        golsVisitante: p.golsVisitante,
        pontos: p.pontuacaoObtida !== undefined ? p.pontuacaoObtida : p.pontos,
        criterio: p.criterioAplicado || p.criterio,
        partida: {
          id: p.partida.id,
          selecaoA: p.partida.selecaoMandante || p.partida.selecaoA,
          selecaoB: p.partida.selecaoVisitante || p.partida.selecaoB,
          dataHora: p.partida.dataHora,
          fase: p.partida.fase,
          status: p.partida.status,
          golsMandanteReal: p.partida.golsMandante !== undefined ? p.partida.golsMandante : p.partida.golsMandanteReal,
          golsVisitanteReal: p.partida.golsVisitante !== undefined ? p.partida.golsVisitante : p.partida.golsVisitanteReal,
        }
      }));

      setPalpites(palpitesMapeados);
    } catch (error: any) {
      console.log("Erro ao carregar palpites da API, usando mock:", error.message);
      // Fallback offline
      setPalpites(PALPITES_MOCK);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarPalpites();
  }, []);

  const renderPalpite = ({ item }: { item: any }) => {
    const isEncerrada = item.partida.status === "ENCERRADA";
    const temPontuacao = item.pontos !== null;

    let BadgeColor: string = theme.border;
    let CriterioTexto = "Aguardando partida";
    let PontosTexto = "—";

    if (isEncerrada && temPontuacao) {
      if (item.criterio === "PLACAR_EXATO" || item.criterio === "EXATO") {
        BadgeColor = theme.secondary + "20"; // Amarelo translúcido
        CriterioTexto = "Placar Exato! 🎯";
        PontosTexto = `+${item.pontos}`;
      } else if (item.criterio === "VENCEDOR_EMPATE" || item.criterio === "PARCIAL") {
        BadgeColor = theme.primary + "20"; // Verde translúcido
        CriterioTexto = "Acertou Vencedor/Empate 👍";
        PontosTexto = `+${item.pontos}`;
      } else {
        BadgeColor = "#FF3B3020"; // Vermelho translúcido
        CriterioTexto = "Erro Total ❌";
        PontosTexto = "+0";
      }
    }

    return (
      <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.phaseText, { color: theme.textSecondary }]}>
            FASE DE {item.partida.fase}
          </Text>
          <View style={[styles.pointsBadge, { backgroundColor: temPontuacao && item.pontos > 0 ? theme.primary : theme.border }]}>
            <Text style={[styles.pointsText, { color: temPontuacao && item.pontos > 0 ? theme.background : theme.text }]}>
              {PontosTexto} pts
            </Text>
          </View>
        </View>

        {/* Confronto */}
        <View style={styles.matchRow}>
          <View style={styles.team}>
            <Image source={{ uri: item.partida.selecaoA.bandeiraUrl }} style={styles.flag} />
            <Text style={[styles.teamName, { color: theme.text }]} numberOfLines={1}>
              {item.partida.selecaoA.nome}
            </Text>
          </View>

          <View style={styles.scoresContainer}>
            {/* Seu Palpite */}
            <View style={styles.predictionBox}>
              <Text style={[styles.scoreNumber, { color: theme.secondary }]}>{item.golsMandante}</Text>
              <Text style={[styles.labelPrediction, { color: theme.textSecondary }]}>Meu palpite</Text>
              <Text style={[styles.scoreNumber, { color: theme.secondary }]}>{item.golsVisitante}</Text>
            </View>

            {/* Resultado Real se encerrada */}
            {isEncerrada && (
              <View style={styles.realBox}>
                <Text style={[styles.realScore, { color: theme.text }]}>
                  Res: {item.partida.golsMandanteReal} x {item.partida.golsVisitanteReal}
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.team, styles.alignRight]}>
            <Text style={[styles.teamName, { color: theme.text }]} numberOfLines={1}>
              {item.partida.selecaoB.nome}
            </Text>
            <Image source={{ uri: item.partida.selecaoB.bandeiraUrl }} style={styles.flag} />
          </View>
        </View>

        {/* Rodapé do Palpite */}
        <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
          <View style={styles.footerLeft}>
            <Ionicons
              name={isEncerrada ? "checkbox-outline" : "time-outline"}
              size={16}
              color={isEncerrada ? theme.primary : theme.textSecondary}
            />
            <Text style={[styles.criterioText, { color: isEncerrada ? theme.text : theme.textSecondary }]}>
              {CriterioTexto}
            </Text>
          </View>

          {!isEncerrada && (
            <TouchableOpacity
              style={[styles.editButton, { borderColor: theme.primary }]}
              onPress={() => router.push(`/partidas/${item.partida.id}`)}
            >
              <Text style={[styles.editButtonText, { color: theme.primary }]}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Meus Palpites</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={palpites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPalpite}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={carregarPalpites}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    resizeMode: "cover",
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
