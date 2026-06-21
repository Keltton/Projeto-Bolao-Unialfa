import { Colors } from "@/constants/theme";
import { getApiErrorMessage } from "@/services/api";
import { listarPartidas } from "@/services/partidaService";
import { FasePartida, Partida } from "@/types/Partida";
import { formatarDataPartida } from "@/util/formatDate";
import { resolveImageUrl } from "@/util/imageUrl";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "@/styles/tabs/partidaStyle";

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
