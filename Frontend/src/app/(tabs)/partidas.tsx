import React, { useState, useEffect } from "react";
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
import api from "@/services/api";

// Fallback estático caso a API esteja offline
const PARTIDAS_MOCK = [
  {
    id: 1,
    selecaoA: { nome: "Brasil", codigoFifa: "BRA", bandeiraUrl: "https://flagcdn.com/w80/br.png" },
    selecaoB: { nome: "Argentina", codigoFifa: "ARG", bandeiraUrl: "https://flagcdn.com/w80/ar.png" },
    dataHora: "2026-06-21T16:00:00",
    estadio: "MetLife Stadium",
    fase: "GRUPOS",
    grupo: "C",
    status: "AGENDADA",
    golsA: null,
    golsB: null,
  },
  {
    id: 2,
    selecaoA: { nome: "França", codigoFifa: "FRA", bandeiraUrl: "https://flagcdn.com/w80/fr.png" },
    selecaoB: { nome: "Alemanha", codigoFifa: "GER", bandeiraUrl: "https://flagcdn.com/w80/de.png" },
    dataHora: "2026-06-21T13:00:00",
    estadio: "Rose Bowl",
    fase: "GRUPOS",
    grupo: "D",
    status: "AGENDADA",
    golsA: null,
    golsB: null,
  },
  {
    id: 3,
    selecaoA: { nome: "Portugal", codigoFifa: "POR", bandeiraUrl: "https://flagcdn.com/w80/pt.png" },
    selecaoB: { nome: "Espanha", codigoFifa: "ESP", bandeiraUrl: "https://flagcdn.com/w80/es.png" },
    dataHora: "2026-06-22T10:00:00",
    estadio: "SoFi Stadium",
    fase: "GRUPOS",
    grupo: "E",
    status: "AGENDADA",
    golsA: null,
    golsB: null,
  },
  {
    id: 4,
    selecaoA: { nome: "Inglaterra", codigoFifa: "ENG", bandeiraUrl: "https://flagcdn.com/w80/gb-eng.png" },
    selecaoB: { nome: "Itália", codigoFifa: "ITA", bandeiraUrl: "https://flagcdn.com/w80/it.png" },
    dataHora: "2026-06-18T18:00:00",
    estadio: "Mercedes-Benz Stadium",
    fase: "GRUPOS",
    grupo: "A",
    status: "ENCERRADA",
    golsA: 2,
    golsB: 1,
  },
  {
    id: 5,
    selecaoA: { nome: "Uruguai", codigoFifa: "URU", bandeiraUrl: "https://flagcdn.com/w80/uy.png" },
    selecaoB: { nome: "Holanda", codigoFifa: "NED", bandeiraUrl: "https://flagcdn.com/w80/nl.png" },
    dataHora: "2026-06-19T15:00:00",
    estadio: "Hard Rock Stadium",
    fase: "GRUPOS",
    grupo: "B",
    status: "ENCERRADA",
    golsA: 0,
    golsB: 2,
  }
];

export default function Partidas() {
  const router = useRouter();
  const theme = Colors.dark;
  
  const [faseAtiva, setFaseAtiva] = useState("TODAS");
  const [partidas, setPartidas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fases = ["TODAS", "GRUPOS", "OITAVAS", "QUARTAS", "SEMI", "FINAL"];

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

  const carregarPartidas = async () => {
    setIsLoading(true);
    try {
      // Filtrar por fase ativa caso seja diferente de "TODAS"
      const params: any = {};
      if (faseAtiva !== "TODAS") {
        params.fase = faseAtiva;
      }
      
      const response = await api.get("/api/partidas", { params });
      
      const partidasMapeadas = response.data.map((p: any) => ({
        id: p.id,
        selecaoA: p.selecaoMandante || p.selecaoA,
        selecaoB: p.selecaoVisitante || p.selecaoB,
        dataHora: p.dataHora,
        estadio: p.estadio,
        fase: p.fase,
        grupo: p.grupo,
        status: p.status,
        golsA: p.golsMandante !== undefined ? p.golsMandante : p.golsA,
        golsB: p.golsVisitante !== undefined ? p.golsVisitante : p.golsB,
      }));

      setPartidas(partidasMapeadas);
    } catch (error: any) {
      console.log("Erro ao buscar partidas, usando mock:", error.message);
      // Fallback offline filtrado localmente
      const filtrados = faseAtiva === "TODAS" 
        ? PARTIDAS_MOCK 
        : PARTIDAS_MOCK.filter(p => p.fase === faseAtiva);
      setPartidas(filtrados);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarPartidas();
  }, [faseAtiva]);

  const renderPartida = ({ item }: { item: any }) => {
    const isEncerrada = item.status === "ENCERRADA";

    return (
      <TouchableOpacity
        style={[styles.matchCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
        onPress={() => router.push(`/partidas/${item.id}`)}
      >
        <View style={styles.matchHeader}>
          <Text style={[styles.phaseText, { color: theme.primary }]}>
            FASE DE {item.fase} {item.grupo ? `• GRUPO ${item.grupo}` : ""}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: isEncerrada ? theme.border : theme.primary + "20" }]}>
            <Text style={[styles.statusText, { color: isEncerrada ? theme.textSecondary : theme.primary }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.teamsRow}>
          {/* Team A */}
          <View style={styles.teamContainer}>
            <Image source={{ uri: item.selecaoA.bandeiraUrl }} style={styles.flag} />
            <Text style={[styles.teamName, { color: theme.text }]} numberOfLines={1}>{item.selecaoA.nome}</Text>
          </View>

          {/* Scores/VS */}
          <View style={styles.vsContainer}>
            {isEncerrada ? (
              <View style={styles.scoreRow}>
                <Text style={[styles.scoreNumber, { color: theme.text }]}>{item.golsA}</Text>
                <Text style={[styles.vsText, { color: theme.textSecondary }]}>x</Text>
                <Text style={[styles.scoreNumber, { color: theme.text }]}>{item.golsB}</Text>
              </View>
            ) : (
              <View style={[styles.vsBadge, { backgroundColor: theme.border }]}>
                <Text style={[styles.vsText, { color: theme.text }]}>VS</Text>
              </View>
            )}
          </View>

          {/* Team B */}
          <View style={styles.teamContainer}>
            <Image source={{ uri: item.selecaoB.bandeiraUrl }} style={styles.flag} />
            <Text style={[styles.teamName, { color: theme.text }]} numberOfLines={1}>{item.selecaoB.nome}</Text>
          </View>
        </View>

        <View style={styles.matchFooter}>
          <View style={styles.footerInfo}>
            <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.footerText, { color: theme.textSecondary }]}> {formatarData(item.dataHora)}</Text>
          </View>
          <View style={styles.footerInfo}>
            <Ionicons name="pin-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.footerText, { color: theme.textSecondary }]}> {item.estadio}</Text>
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

      {/* Horizontal Filter Bar */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {fases.map((fase) => {
            const isSelected = faseAtiva === fase;
            return (
              <TouchableOpacity
                key={fase}
                style={[
                  styles.filterItem,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.backgroundElement,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setFaseAtiva(fase)}
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
                  {fase}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Match List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={partidas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPartida}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={carregarPartidas}
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  footerText: {
    fontSize: 11,
  },
});
