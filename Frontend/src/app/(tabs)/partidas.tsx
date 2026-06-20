import React, { useState } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

// Mock de partidas para a visualização inicial
const PARTIDAS_MOCK = [
  {
    id: 1,
    selecaoA: { nome: "Brasil", codigoFifa: "BRA", bandeiraUrl: "https://flagcdn.com/w80/br.png" },
    selecaoB: { nome: "Argentina", codigoFifa: "ARG", bandeiraUrl: "https://flagcdn.com/w80/ar.png" },
    dataHora: "21/06 • 16:00",
    estadio: "MetLife Stadium",
    fase: "GRUPOS",
    grupo: "C",
    status: "AGENDADA",
    golsSelecaoA: null,
    golsSelecaoB: null,
  },
  {
    id: 2,
    selecaoA: { nome: "França", codigoFifa: "FRA", bandeiraUrl: "https://flagcdn.com/w80/fr.png" },
    selecaoB: { nome: "Alemanha", codigoFifa: "GER", bandeiraUrl: "https://flagcdn.com/w80/de.png" },
    dataHora: "21/06 • 13:00",
    estadio: "Rose Bowl",
    fase: "GRUPOS",
    grupo: "D",
    status: "AGENDADA",
    golsSelecaoA: null,
    golsSelecaoB: null,
  },
  {
    id: 3,
    selecaoA: { nome: "Portugal", codigoFifa: "POR", bandeiraUrl: "https://flagcdn.com/w80/pt.png" },
    selecaoB: { nome: "Espanha", codigoFifa: "ESP", bandeiraUrl: "https://flagcdn.com/w80/es.png" },
    dataHora: "22/06 • 10:00",
    estadio: "SoFi Stadium",
    fase: "GRUPOS",
    grupo: "E",
    status: "AGENDADA",
    golsSelecaoA: null,
    golsSelecaoB: null,
  },
  {
    id: 4,
    selecaoA: { nome: "Inglaterra", codigoFifa: "ENG", bandeiraUrl: "https://flagcdn.com/w80/gb-eng.png" },
    selecaoB: { nome: "Itália", codigoFifa: "ITA", bandeiraUrl: "https://flagcdn.com/w80/it.png" },
    dataHora: "18/06 • 18:00",
    estadio: "Mercedes-Benz Stadium",
    fase: "GRUPOS",
    grupo: "A",
    status: "ENCERRADA",
    golsSelecaoA: 2,
    golsSelecaoB: 1,
  },
  {
    id: 5,
    selecaoA: { nome: "Uruguai", codigoFifa: "URU", bandeiraUrl: "https://flagcdn.com/w80/uy.png" },
    selecaoB: { nome: "Holanda", codigoFifa: "NED", bandeiraUrl: "https://flagcdn.com/w80/nl.png" },
    dataHora: "19/06 • 15:00",
    estadio: "Hard Rock Stadium",
    fase: "GRUPOS",
    grupo: "B",
    status: "ENCERRADA",
    golsSelecaoA: 0,
    golsSelecaoB: 2,
  }
];

export default function Partidas() {
  const router = useRouter();
  const theme = Colors.dark;
  const [faseAtiva, setFaseAtiva] = useState("TODAS");

  const fases = ["TODAS", "GRUPOS", "OITAVAS", "QUARTAS", "SEMI", "FINAL"];

  const partidasFiltradas = faseAtiva === "TODAS" 
    ? PARTIDAS_MOCK 
    : PARTIDAS_MOCK.filter(p => p.fase === faseAtiva);

  const renderPartida = ({ item }: { item: typeof PARTIDAS_MOCK[0] }) => {
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
              {isEncerrada ? "ENCERRADA" : "AGENDADA"}
            </Text>
          </View>
        </View>

        <View style={styles.teamsRow}>
          {/* Team A */}
          <View style={styles.teamContainer}>
            <Image source={{ uri: item.selecaoA.bandeiraUrl }} style={styles.flag} />
            <Text style={[styles.teamName, { color: theme.text }]}>{item.selecaoA.nome}</Text>
          </View>

          {/* Scores/VS */}
          <View style={styles.vsContainer}>
            {isEncerrada ? (
              <View style={styles.scoreRow}>
                <Text style={[styles.scoreNumber, { color: theme.text }]}>{item.golsSelecaoA}</Text>
                <Text style={[styles.vsText, { color: theme.textSecondary }]}>x</Text>
                <Text style={[styles.scoreNumber, { color: theme.text }]}>{item.golsSelecaoB}</Text>
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
            <Text style={[styles.teamName, { color: theme.text }]}>{item.selecaoB.nome}</Text>
          </View>
        </View>

        <View style={styles.matchFooter}>
          <View style={styles.footerInfo}>
            <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.footerText, { color: theme.textSecondary }]}> {item.dataHora}</Text>
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
      <FlatList
        data={partidasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPartida}
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
