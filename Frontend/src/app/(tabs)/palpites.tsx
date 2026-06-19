import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

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
      dataHora: "21/06 • 16:00",
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
      dataHora: "18/06 • 18:00",
      fase: "GRUPOS",
      status: "ENCERRADA",
      golsMandanteReal: 3,
      golsVisitanteReal: 1,
    },
  },
  {
    id: 103,
    golsMandante: 1,
    golsVisitante: 1,
    pontos: 5,
    criterio: "VENCEDOR_EMPATE",
    partida: {
      id: 5,
      selecaoA: { nome: "Uruguai", bandeiraUrl: "https://flagcdn.com/w80/uy.png" },
      selecaoB: { nome: "Holanda", bandeiraUrl: "https://flagcdn.com/w80/nl.png" },
      dataHora: "19/06 • 15:00",
      fase: "GRUPOS",
      status: "ENCERRADA",
      golsMandanteReal: 0,
      golsVisitanteReal: 2, // Ele apostou em empate (1x1), mas a Holanda ganhou (0x2). Espera, se a Holanda ganhou e ele apostou empate, ele pontua 0!
      // Vamos ajustar o mock: aposta 0x1, real 0x2 -> acertou vencedor (Holanda) -> 5 pts
    },
  }
];

// Corrigindo o mock do palpite 103 para fazer sentido matemático:
PALPITES_MOCK[2].golsMandante = 0;
PALPITES_MOCK[2].golsVisitante = 1;

export default function Palpites() {
  const router = useRouter();
  const theme = Colors.dark;

  const renderPalpite = ({ item }: { item: typeof PALPITES_MOCK[0] }) => {
    const isEncerrada = item.partida.status === "ENCERRADA";
    const temPontuacao = item.pontos !== null;

    let BadgeColor = theme.border;
    let CriterioTexto = "Aguardando partida";
    let PontosTexto = "—";

    if (isEncerrada && temPontuacao) {
      if (item.criterio === "PLACAR_EXATO") {
        BadgeColor = theme.secondary + "20"; // Amarelo translúcido
        CriterioTexto = "Placar Exato! 🎯";
        PontosTexto = `+${item.pontos}`;
      } else if (item.criterio === "VENCEDOR_EMPATE") {
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
          <View style={[styles.pointsBadge, { backgroundColor: temPontuacao && item.pontos! > 0 ? theme.primary : theme.border }]}>
            <Text style={[styles.pointsText, { color: temPontuacao && item.pontos! > 0 ? theme.background : theme.text }]}>
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

      <FlatList
        data={PALPITES_MOCK}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPalpite}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
