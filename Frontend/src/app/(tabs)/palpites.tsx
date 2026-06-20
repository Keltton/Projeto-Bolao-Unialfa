import React, { useCallback, useState } from "react";
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
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { Palpite } from "@/types/Palpite";
import { Partida } from "@/types/Partida";
import { listarMeusPalpites } from "@/services/palpiteService";
import { getApiErrorMessage } from "@/services/api";
import { resolveImageUrl } from "@/util/imageUrl";

function podeEditarPalpite(partida: Partida): boolean {
  if (partida.status !== "AGENDADA") return false;
  return new Date() < new Date(partida.dataHora);
}

export default function Palpites() {
  const router = useRouter();
  const theme = Colors.dark;

  const [palpites, setPalpites] = useState<Palpite[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carregarPalpites = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await listarMeusPalpites();
      setPalpites(
        data.sort(
          (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
        )
      );
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Erro ao carregar palpites."));
      setPalpites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarPalpites();
    }, [carregarPalpites])
  );

  const renderBandeira = (bandeiraUrl?: string | null) => {
    const uri = resolveImageUrl(bandeiraUrl);
    if (!uri) {
      return <View style={[styles.flag, { backgroundColor: theme.border }]} />;
    }
    return <Image source={{ uri }} style={styles.flag} resizeMode="cover" />;
  };

  const renderPalpite = ({ item }: { item: Palpite }) => {
    const { partida } = item;
    const isEncerrada = partida.status === "ENCERRADA";
    const editavel = podeEditarPalpite(partida);

    let badgeColor: string = theme.border;
    let criterioTexto = "Aguardando partida";
    let pontosTexto = "—";

    if (isEncerrada) {
      if (item.criterioPontuacao === "PLACAR_EXATO") {
        badgeColor = theme.secondary + "20";
        criterioTexto = "Placar Exato! 🎯";
        pontosTexto = `+${item.pontos ?? 0}`;
      } else if (item.criterioPontuacao === "VENCEDOR_EMPATE") {
        badgeColor = theme.primary + "20";
        criterioTexto = "Acertou Vencedor/Empate 👍";
        pontosTexto = `+${item.pontos ?? 0}`;
      } else if (item.criterioPontuacao === "ERROU") {
        badgeColor = "#FF3B3020";
        criterioTexto = "Erro Total ❌";
        pontosTexto = "+0";
      }
    }

    const temPontos = isEncerrada && (item.pontos ?? 0) > 0;

    return (
      <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.phaseText, { color: theme.textSecondary }]}>
            FASE DE {partida.fase}
            {partida.grupo ? ` • GRUPO ${partida.grupo}` : ""}
          </Text>
          <View
            style={[
              styles.pointsBadge,
              { backgroundColor: temPontos ? theme.primary : badgeColor },
            ]}
          >
            <Text
              style={[
                styles.pointsText,
                { color: temPontos ? theme.background : theme.text },
              ]}
            >
              {pontosTexto} pts
            </Text>
          </View>
        </View>

        <View style={styles.matchRow}>
          <View style={styles.team}>
            {renderBandeira(partida.selecaoA.bandeiraUrl)}
            <Text style={[styles.teamName, { color: theme.text }]} numberOfLines={1}>
              {partida.selecaoA.nome}
            </Text>
          </View>

          <View style={styles.scoresContainer}>
            <View style={styles.predictionBox}>
              <Text style={[styles.scoreNumber, { color: theme.secondary }]}>
                {item.golsSelecaoA}
              </Text>
              <Text style={[styles.labelPrediction, { color: theme.textSecondary }]}>
                Meu palpite
              </Text>
              <Text style={[styles.scoreNumber, { color: theme.secondary }]}>
                {item.golsSelecaoB}
              </Text>
            </View>

            {isEncerrada && (
              <View style={styles.realBox}>
                <Text style={[styles.realScore, { color: theme.text }]}>
                  Res: {partida.golsSelecaoA ?? 0} x {partida.golsSelecaoB ?? 0}
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.team, styles.alignRight]}>
            <Text style={[styles.teamName, { color: theme.text }]} numberOfLines={1}>
              {partida.selecaoB.nome}
            </Text>
            {renderBandeira(partida.selecaoB.bandeiraUrl)}
          </View>
        </View>

        <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
          <View style={styles.footerLeft}>
            <Ionicons
              name={isEncerrada ? "checkbox-outline" : "time-outline"}
              size={16}
              color={isEncerrada ? theme.primary : theme.textSecondary}
            />
            <Text
              style={[
                styles.criterioText,
                { color: isEncerrada ? theme.text : theme.textSecondary },
              ]}
            >
              {criterioTexto}
            </Text>
          </View>

          {editavel && (
            <TouchableOpacity
              style={[styles.editButton, { borderColor: theme.primary }]}
              onPress={() => router.push(`/partidas/${partida.id}`)}
            >
              <Text style={[styles.editButtonText, { color: theme.primary }]}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading && palpites.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Meus Palpites</Text>
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Meus Palpites</Text>
      </View>

      {errorMessage && (
        <Text style={[styles.errorText, { color: theme.textSecondary }]}>
          {errorMessage}
        </Text>
      )}

      <FlatList
        data={palpites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPalpite}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={carregarPalpites}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Você ainda não fez nenhum palpite.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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