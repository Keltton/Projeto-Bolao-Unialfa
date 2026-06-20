import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { FasePartida, Partida } from "@/types/Partida";
import { listarPartidas } from "@/services/partidaService";
import { getApiErrorMessage } from "@/services/api";
import { formatarDataPartida } from "@/util/formatDate";
import { resolveImageUrl } from "@/util/imageUrl";

const FASES: Array<{ label: string; value: "TODAS" | FasePartida }> = [
  { label: "TODAS", value: "TODAS" },
  { label: "GRUPOS", value: "GRUPOS" },
  { label: "OITAVAS", value: "OITAVAS" },
  { label: "QUARTAS", value: "QUARTAS" },
  { label: "SEMI", value: "SEMIFINAL" },
  { label: "FINAL", value: "FINAL" },
];

export default function Partidas() {
  const router = useRouter();
  const theme = Colors.dark;

  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [faseAtiva, setFaseAtiva] = useState<"TODAS" | FasePartida>("TODAS");

  const carregarPartidas = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const filtros = faseAtiva !== "TODAS" ? { fase: faseAtiva } : undefined;
      const data = await listarPartidas(filtros);
      setPartidas(data);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Erro ao carregar partidas."));
      setPartidas([]);
    } finally {
      setLoading(false);
    }
  }, [faseAtiva]);

  useEffect(() => {
    carregarPartidas();
  }, [carregarPartidas]);

  const renderBandeira = (bandeiraUrl?: string | null) => {
    const uri = resolveImageUrl(bandeiraUrl);
    if (!uri) {
      return <View style={[styles.flag, { backgroundColor: theme.border }]} />;
    }
    return <Image source={{ uri }} style={styles.flag} />;
  };

  const renderPartida = ({ item }: { item: Partida }) => {
    const isEncerrada = item.status === "ENCERRADA";
    const isEmAndamento = item.status === "EM_ANDAMENTO";

    return (
      <TouchableOpacity
        style={[styles.matchCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
        onPress={() => router.push(`/partidas/${item.id}`)}
      >
        <View style={styles.matchHeader}>
          <Text style={[styles.phaseText, { color: theme.primary }]}>
            FASE DE {item.fase} {item.grupo ? `• GRUPO ${item.grupo}` : ""}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isEncerrada
                  ? theme.border
                  : isEmAndamento
                    ? theme.secondary + "30"
                    : theme.primary + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: isEncerrada
                    ? theme.textSecondary
                    : isEmAndamento
                      ? theme.secondary
                      : theme.primary,
                },
              ]}
            >
              {item.status.replace("_", " ")}
            </Text>
          </View>
        </View>

        <View style={styles.teamsRow}>
          <View style={styles.teamContainer}>
            {renderBandeira(item.selecaoA.bandeiraUrl)}
            <Text style={[styles.teamName, { color: theme.text }]}>{item.selecaoA.nome}</Text>
          </View>

          <View style={styles.vsContainer}>
            {isEncerrada || isEmAndamento ? (
              <View style={styles.scoreRow}>
                <Text style={[styles.scoreNumber, { color: theme.text }]}>
                  {item.golsSelecaoA ?? 0}
                </Text>
                <Text style={[styles.vsText, { color: theme.textSecondary }]}>x</Text>
                <Text style={[styles.scoreNumber, { color: theme.text }]}>
                  {item.golsSelecaoB ?? 0}
                </Text>
              </View>
            ) : (
              <View style={[styles.vsBadge, { backgroundColor: theme.border }]}>
                <Text style={[styles.vsText, { color: theme.text }]}>VS</Text>
              </View>
            )}
          </View>

          <View style={styles.teamContainer}>
            {renderBandeira(item.selecaoB.bandeiraUrl)}
            <Text style={[styles.teamName, { color: theme.text }]}>{item.selecaoB.nome}</Text>
          </View>
        </View>

        <View style={styles.matchFooter}>
          <View style={styles.footerInfo}>
            <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              {" "}
              {formatarDataPartida(item.dataHora)}
            </Text>
          </View>
          <View style={styles.footerInfo}>
            <Ionicons name="pin-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              {" "}
              {item.estadio}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Tabela de Jogos</Text>
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {FASES.map((fase) => {
            const isSelected = faseAtiva === fase.value;
            return (
              <TouchableOpacity
                key={fase.value}
                style={[
                  styles.filterItem,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.backgroundElement,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setFaseAtiva(fase.value)}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: isSelected ? theme.background : theme.text,
                      fontWeight: isSelected ? "700" : "500",
                    },
                  ]}
                >
                  {fase.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.secondary} />
        </View>
      ) : errorMessage ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <TouchableOpacity
            style={[styles.retryBtn, { borderColor: theme.border }]}
            onPress={carregarPartidas}
          >
            <Text style={[styles.retryText, { color: theme.secondary }]}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={partidas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderPartida}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Nenhuma partida encontrada.
              </Text>
            </View>
          }
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