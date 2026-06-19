import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

// Dados mockados das partidas para a interface visual
const DADOS_PARTIDAS: Record<string, any> = {
  "1": {
    selecaoA: { nome: "Brasil", bandeiraUrl: "https://flagcdn.com/w160/br.png" },
    selecaoB: { nome: "Argentina", bandeiraUrl: "https://flagcdn.com/w160/ar.png" },
    dataHora: "21/06/2026 • 16:00",
    estadio: "MetLife Stadium",
    fase: "Fase de Grupos • Grupo C",
  },
  "2": {
    selecaoA: { nome: "França", bandeiraUrl: "https://flagcdn.com/w160/fr.png" },
    selecaoB: { nome: "Alemanha", bandeiraUrl: "https://flagcdn.com/w160/de.png" },
    dataHora: "21/06/2026 • 13:00",
    estadio: "Rose Bowl",
    fase: "Fase de Grupos • Grupo D",
  },
  "3": {
    selecaoA: { nome: "Portugal", bandeiraUrl: "https://flagcdn.com/w160/pt.png" },
    selecaoB: { nome: "Espanha", bandeiraUrl: "https://flagcdn.com/w160/es.png" },
    dataHora: "22/06/2026 • 10:00",
    estadio: "SoFi Stadium",
    fase: "Fase de Grupos • Grupo E",
  }
};

export default function FazerPalpite() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = Colors.dark;

  const partida = DADOS_PARTIDAS[id || "1"] || DADOS_PARTIDAS["1"];

  const [golsA, setGolsA] = useState("2");
  const [golsB, setGolsB] = useState("1");

  const handleSavePalpite = () => {
    // Validação de inputs
    if (golsA.trim() === "" || golsB.trim() === "") {
      Alert.alert("Erro", "Por favor, digite os gols de ambas as seleções.");
      return;
    }

    // Validação de horário mockada (RF-022 Bloqueio pós início)
    // Se a data do jogo já passou, deve retornar erro.
    // Aqui mostramos a mensagem de sucesso
    Alert.alert(
      "Palpite Salvo",
      `Seu palpite de ${partida.selecaoA.nome} ${golsA} x ${golsB} ${partida.selecaoB.nome} foi registrado com sucesso!`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: theme.backgroundElement }]}
        >
          <Ionicons name="arrow-back" size={22} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.secondary }]}>Fazer Palpite</Text>
        <View style={styles.placeholderBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stadium Backdrop Banner */}
        <View style={styles.stadiumBanner}>
          <Text style={[styles.bannerCopa, { color: theme.primary }]}>Copa do Mundo 2026</Text>
          <Text style={[styles.bannerFase, { color: theme.textSecondary }]}>{partida.fase}</Text>

          {/* Teams Flags VS */}
          <View style={styles.vsRow}>
            <View style={styles.teamSeat}>
              <View style={styles.flagCircle}>
                <Image source={{ uri: partida.selecaoA.bandeiraUrl }} style={styles.flagImg} />
              </View>
              <Text style={[styles.teamLabel, { color: theme.text }]}>{partida.selecaoA.nome}</Text>
            </View>

            <Text style={[styles.vsItalic, { color: theme.secondary }]}>VS</Text>

            <View style={styles.teamSeat}>
              <View style={styles.flagCircle}>
                <Image source={{ uri: partida.selecaoB.bandeiraUrl }} style={styles.flagImg} />
              </View>
              <Text style={[styles.teamLabel, { color: theme.text }]}>{partida.selecaoB.nome}</Text>
            </View>
          </View>
        </View>

        {/* Match details card */}
        <View style={[styles.detailsCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={theme.secondary} />
            <Text style={[styles.detailText, { color: theme.text }]}>{partida.dataHora}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={theme.secondary} />
            <Text style={[styles.detailText, { color: theme.text }]}>{partida.estadio}</Text>
          </View>
        </View>

        {/* Prediction inputs */}
        <View style={styles.predictionSection}>
          <Text style={[styles.predictionTitle, { color: theme.text }]}>Qual será o placar?</Text>
          <View style={styles.inputsContainer}>
            {/* Team A gols */}
            <View style={styles.inputBox}>
              <TextInput
                value={golsA}
                onChangeText={(text) => setGolsA(text.replace(/[^0-9]/g, "").slice(0, 2))}
                keyboardType="number-pad"
                style={[styles.bigInput, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
                maxLength={2}
                selectTextOnFocus
              />
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Gols do {partida.selecaoA.nome}
              </Text>
            </View>

            <Text style={[styles.xSeparator, { color: theme.textSecondary }]}>X</Text>

            {/* Team B gols */}
            <View style={styles.inputBox}>
              <TextInput
                value={golsB}
                onChangeText={(text) => setGolsB(text.replace(/[^0-9]/g, "").slice(0, 2))}
                keyboardType="number-pad"
                style={[styles.bigInput, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
                maxLength={2}
                selectTextOnFocus
              />
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Gols do {partida.selecaoB.nome}
              </Text>
            </View>
          </View>
        </View>

        {/* Rules explanation */}
        <View style={[styles.rulesCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <View style={styles.rulesHeader}>
            <Ionicons name="information-circle" size={20} color={theme.primary} />
            <Text style={[styles.rulesTitle, { color: theme.text }]}>Como funciona a pontuação</Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={[styles.ruleText, { color: theme.textSecondary }]}>Placar exato</Text>
            <Text style={[styles.rulePoints, { color: theme.secondary }]}>10 pontos</Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={[styles.ruleText, { color: theme.textSecondary }]}>Acertar apenas o vencedor</Text>
            <Text style={[styles.rulePoints, { color: theme.primary }]}>5 pontos</Text>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: theme.secondary }]}
            onPress={handleSavePalpite}
          >
            <Text style={[styles.saveBtnText, { color: theme.background }]}>SALVAR PALPITE</Text>
          </TouchableOpacity>
          <Text style={[styles.disclaimer, { color: theme.textSecondary }]}>
            Você pode editar seu palpite até o início da partida.
          </Text>
        </View>
      </ScrollView>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  placeholderBtn: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  stadiumBanner: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 156, 59, 0.05)",
  },
  bannerCopa: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  bannerFase: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 24,
  },
  vsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  teamSeat: {
    alignItems: "center",
  },
  flagCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  flagImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  teamLabel: {
    fontSize: 14,
    fontWeight: "800",
    marginTop: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  vsItalic: {
    fontSize: 32,
    fontWeight: "800",
    fontStyle: "italic",
    opacity: 0.8,
  },
  detailsCard: {
    marginHorizontal: 24,
    marginTop: -20,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    fontWeight: "700",
  },
  predictionSection: {
    marginTop: 35,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  predictionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 20,
  },
  inputsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    maxWidth: 280,
  },
  inputBox: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  bigInput: {
    width: "100%",
    height: 80,
    borderRadius: 16,
    borderWidth: 2,
    textAlign: "center",
    fontSize: 32,
    fontWeight: "800",
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  xSeparator: {
    fontSize: 20,
    fontWeight: "700",
    paddingBottom: 20,
  },
  rulesCard: {
    marginHorizontal: 24,
    marginTop: 35,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  rulesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  rulesTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  ruleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  ruleText: {
    fontSize: 12,
  },
  rulePoints: {
    fontSize: 12,
    fontWeight: "700",
  },
  actionContainer: {
    paddingHorizontal: 24,
    marginTop: 35,
    alignItems: "center",
  },
  saveBtn: {
    width: "100%",
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  disclaimer: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 10,
  },
});
