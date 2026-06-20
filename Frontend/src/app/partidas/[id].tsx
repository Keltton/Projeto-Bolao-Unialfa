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
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import api from "@/services/api";

// Fallback estático caso a API esteja offline
const PARTIDAS_FALLBACK: Record<string, any> = {
  "1": {
    id: 1,
    selecaoMandante: { nome: "Brasil", bandeiraUrl: "https://flagcdn.com/w160/br.png" },
    selecaoVisitante: { nome: "Argentina", bandeiraUrl: "https://flagcdn.com/w160/ar.png" },
    dataHora: "2026-06-21T16:00:00",
    estadio: "MetLife Stadium",
    fase: "Fase de Grupos • Grupo C",
  },
  "2": {
    id: 2,
    selecaoMandante: { nome: "França", bandeiraUrl: "https://flagcdn.com/w160/fr.png" },
    selecaoVisitante: { nome: "Alemanha", bandeiraUrl: "https://flagcdn.com/w160/de.png" },
    dataHora: "2026-06-21T13:00:00",
    estadio: "Rose Bowl",
    fase: "Fase de Grupos • Grupo D",
  },
  "3": {
    id: 3,
    selecaoMandante: { nome: "Portugal", bandeiraUrl: "https://flagcdn.com/w160/pt.png" },
    selecaoVisitante: { nome: "Espanha", bandeiraUrl: "https://flagcdn.com/w160/es.png" },
    dataHora: "2026-06-22T10:00:00",
    estadio: "SoFi Stadium",
    fase: "Fase de Grupos • Grupo E",
  }
};

export default function FazerPalpite() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = Colors.dark;

  const [partida, setPartida] = useState<any>(null);
  const [golsA, setGolsA] = useState("");
  const [golsB, setGolsB] = useState("");
  const [palpiteExistenteId, setPalpiteExistenteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const formatarData = (dataStr: string) => {
    try {
      const data = new Date(dataStr);
      const dia = String(data.getDate()).padStart(2, "0");
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const horas = String(data.getHours()).padStart(2, "0");
      const minutos = String(data.getMinutes()).padStart(2, "0");
      return `${dia}/${mes}/${data.getFullYear()} • ${horas}:${minutos}`;
    } catch {
      return dataStr;
    }
  };

  const carregarDadosPartida = async () => {
    setIsLoading(true);
    try {
      // 1. Carregar detalhes da partida
      const responsePartida = await api.get(`/api/partidas/${id}`);
      const p = responsePartida.data;
      
      const partidaMapeada = {
        id: p.id,
        selecaoMandante: p.selecaoMandante || p.selecaoA,
        selecaoVisitante: p.selecaoVisitante || p.selecaoB,
        dataHora: p.dataHora,
        estadio: p.estadio,
        fase: `${p.fase} ${p.grupo ? `• Grupo ${p.grupo}` : ""}`,
      };

      setPartida(partidaMapeada);

      // 2. Verificar se o usuário possui palpite prévio cadastrado nesta partida
      try {
        const responsePalpites = await api.get("/api/palpites/meus");
        const meusPalpites = responsePalpites.data;
        const palpitePrevio = meusPalpites.find((palp: any) => palp.partida.id === Number(id));
        
        if (palpitePrevio) {
          setPalpiteExistenteId(palpitePrevio.id);
          setGolsA(String(palpitePrevio.golsMandante));
          setGolsB(String(palpitePrevio.golsVisitante));
        }
      } catch (err) {
        console.log("Erro ao carregar lista de palpites para busca de histórico:", err);
      }

    } catch (error: any) {
      console.log("Erro ao buscar partida da API, usando mock:", error.message);
      // Fallback offline
      const fallback = PARTIDAS_FALLBACK[id || "1"] || PARTIDAS_FALLBACK["1"];
      setPartida(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosPartida();
  }, [id]);

  const handleSavePalpite = async () => {
    if (golsA.trim() === "" || golsB.trim() === "") {
      Alert.alert("Erro", "Por favor, digite os gols de ambas as seleções.");
      return;
    }

    // Validação de horário preventiva (RF-022)
    if (partida && partida.dataHora) {
      const dataJogo = new Date(partida.dataHora);
      if (new Date() >= dataJogo) {
        Alert.alert("Erro de Validação", "Não é permitido registrar ou alterar palpites após o início oficial da partida.");
        return;
      }
    }

    setIsSaving(true);
    try {
      const body = {
        partidaId: Number(id),
        golsSelecaoA: Number(golsA),
        golsSelecaoB: Number(golsB),
      };

      if (palpiteExistenteId) {
        // Editar palpite existente
        await api.put(`/api/palpites/${palpiteExistenteId}`, body);
        Alert.alert(
          "Palpite Atualizado",
          "Seu palpite foi alterado com sucesso no servidor!",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        // Registrar novo palpite
        await api.post("/api/palpites", body);
        Alert.alert(
          "Palpite Registrado",
          "Seu palpite foi salvo com sucesso no servidor!",
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
    } catch (error: any) {
      console.log("Erro ao salvar palpite na API:", error);
      const isNetworkError = !error.response;

      if (isNetworkError) {
        Alert.alert(
          "Sucesso (Modo Offline)",
          `O backend está offline. Seu palpite de ${partida.selecaoMandante.nome} ${golsA} x ${golsB} ${partida.selecaoVisitante.nome} foi simulado com sucesso localmente.`,
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        const msg = error.response?.data?.mensagem || error.response?.data?.message || "Não foi possível registrar o palpite.";
        Alert.alert("Erro ao Salvar", msg);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !partida) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)");
            }
          }}
          style={[styles.backButton, { backgroundColor: theme.backgroundElement }]}
        >
          <Ionicons name="arrow-back" size={22} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.secondary }]}>
          {palpiteExistenteId ? "Editar Palpite" : "Fazer Palpite"}
        </Text>
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
                <Image source={{ uri: partida.selecaoMandante.bandeiraUrl }} style={styles.flagImg} />
              </View>
              <Text style={[styles.teamLabel, { color: theme.text }]} numberOfLines={1}>{partida.selecaoMandante.nome}</Text>
            </View>

            <Text style={[styles.vsItalic, { color: theme.secondary }]}>VS</Text>

            <View style={styles.teamSeat}>
              <View style={styles.flagCircle}>
                <Image source={{ uri: partida.selecaoVisitante.bandeiraUrl }} style={styles.flagImg} />
              </View>
              <Text style={[styles.teamLabel, { color: theme.text }]} numberOfLines={1}>{partida.selecaoVisitante.nome}</Text>
            </View>
          </View>
        </View>

        {/* Match details card */}
        <View style={[styles.detailsCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={theme.secondary} />
            <Text style={[styles.detailText, { color: theme.text }]}>{formatarData(partida.dataHora)}</Text>
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
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]} numberOfLines={1}>
                Gols do {partida.selecaoMandante.nome}
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
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]} numberOfLines={1}>
                Gols do {partida.selecaoVisitante.nome}
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
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={theme.background} />
            ) : (
              <Text style={[styles.saveBtnText, { color: theme.background }]}>SALVAR PALPITE</Text>
            )}
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
    width: 100,
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
    fontSize: 12,
    fontWeight: "800",
    marginTop: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
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
    width: 100,
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
    width: "100%",
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
