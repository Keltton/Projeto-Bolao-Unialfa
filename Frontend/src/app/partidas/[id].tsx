import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/services/api";
import { editarPalpite, listarMeusPalpites, registrarPalpite } from "@/services/palpiteService";
import { buscarPartidaPorId } from "@/services/partidaService";
import { Partida } from "@/types/Partida";
import { Palpite } from "@/types/Palpite";
import { formatarDataPartida } from "@/util/formatDate";
import { resolveImageUrl } from "@/util/imageUrl";
import { toastError, toastSuccess } from "@/util/toast";

export default function FazerPalpite() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const theme = Colors.dark;

  const partidaId = Number(Array.isArray(id) ? id[0] : id);

  const [partida, setPartida] = useState<Partida | null>(null);
  const [palpiteExistente, setPalpiteExistente] = useState<Palpite | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [golsA, setGolsA] = useState("");
  const [golsB, setGolsB] = useState("");

  useEffect(() => {
    if (!partidaId || Number.isNaN(partidaId)) {
      setErrorMessage("Partida inválida.");
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const partidaData = await buscarPartidaPorId(partidaId);
        setPartida(partidaData);

        if (isAuthenticated) {
          const meusPalpites = await listarMeusPalpites();
          const palpiteDaPartida = meusPalpites.find((p) => p.partida.id === partidaId);

          if (palpiteDaPartida) {
            setPalpiteExistente(palpiteDaPartida);
            setGolsA(String(palpiteDaPartida.golsSelecaoA));
            setGolsB(String(palpiteDaPartida.golsSelecaoB));
          }
        }
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, "Erro ao carregar partida."));
      } finally {
        setLoading(false);
      }
    })();
  }, [partidaId, isAuthenticated]);

  const podePalpitar = partida?.status === "AGENDADA";

  const renderBandeira = (bandeiraUrl?: string | null) => {
    const uri = resolveImageUrl(bandeiraUrl);
    if (!uri) {
      return <View style={[styles.flagImg, { backgroundColor: theme.border }]} />;
    }
    return <Image source={{ uri }} style={styles.flagImg} resizeMode="cover" />;
  };

  const handleSavePalpite = async () => {
    if (!partida || !podePalpitar) return;

    if (golsA.trim() === "" || golsB.trim() === "") {
      toastError("Digite os gols de ambas as seleções.");
      return;
    }

    const payload = {
      partidaId: partida.id,
      golsSelecaoA: Number(golsA),
      golsSelecaoB: Number(golsB),
    };

    setSaving(true);
    try {
      if (palpiteExistente) {
        const atualizado = await editarPalpite(palpiteExistente.id, payload);
        setPalpiteExistente(atualizado);
        toastSuccess("Palpite atualizado com sucesso!");
      } else {
        const criado = await registrarPalpite(payload);
        setPalpiteExistente(criado);
        toastSuccess("Palpite registrado com sucesso!");
      }
      router.back();
    } catch (error) {
      toastError(getApiErrorMessage(error, "Erro ao salvar palpite."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!partida) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centerContent}>
          <Text style={{ color: theme.text }}>
            {errorMessage ?? "Partida não encontrada."}
          </Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: theme.primary }}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const faseLabel = `FASE DE ${partida.fase}${partida.grupo ? ` • GRUPO ${partida.grupo}` : ""}`;
  const dataHora = formatarDataPartida(partida.dataHora);
  const mostrarPlacarReal =
    partida.status === "EM_ANDAMENTO" || partida.status === "ENCERRADA";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: theme.backgroundElement }]}
        >
          <Ionicons name="arrow-back" size={22} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.secondary }]}>
          {isAuthenticated ? "Fazer Palpite" : "Detalhes da Partida"}
        </Text>
        <View style={styles.placeholderBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.stadiumBanner}>
          <Text style={[styles.bannerCopa, { color: theme.primary }]}>Copa do Mundo 2026</Text>
          <Text style={[styles.bannerFase, { color: theme.textSecondary }]}>{faseLabel}</Text>

          <View style={styles.vsRow}>
            <View style={styles.teamSeat}>
              <View style={styles.flagCircle}>
                {renderBandeira(partida.selecaoA.bandeiraUrl)}
              </View>
              <Text style={[styles.teamLabel, { color: theme.text }]}>{partida.selecaoA.nome}</Text>
            </View>

            <Text style={[styles.vsItalic, { color: theme.secondary }]}>VS</Text>

            <View style={styles.teamSeat}>
              <View style={styles.flagCircle}>
                {renderBandeira(partida.selecaoB.bandeiraUrl)}
              </View>
              <Text style={[styles.teamLabel, { color: theme.text }]}>{partida.selecaoB.nome}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.detailsCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={theme.secondary} />
            <Text style={[styles.detailText, { color: theme.text }]}>{dataHora}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={theme.secondary} />
            <Text style={[styles.detailText, { color: theme.text }]}>{partida.estadio}</Text>
          </View>
        </View>

        {mostrarPlacarReal && (
          <View
            style={[
              styles.detailsCard,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
                marginTop: 16,
                justifyContent: "center",
              },
            ]}
          >
            <Text style={[styles.detailText, { color: theme.text }]}>
              Placar: {partida.golsSelecaoA ?? 0} x {partida.golsSelecaoB ?? 0}
            </Text>
          </View>
        )}

        {!isAuthenticated && podePalpitar ? (
          <View style={styles.predictionSection}>
            <View
              style={[
                styles.guestCard,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              ]}
            >
              <Ionicons name="lock-closed-outline" size={36} color={theme.textSecondary} />
              <Text style={[styles.guestTitle, { color: theme.text }]}>Entre para fazer seu palpite</Text>
              <Text style={[styles.guestMessage, { color: theme.textSecondary }]}>
                Modo visitante: você pode ver os jogos, mas precisa estar logado para palpitar.
              </Text>

              <TouchableOpacity
                style={[styles.guestPrimaryBtn, { backgroundColor: theme.secondary }]}
                onPress={() => router.push("/auth/login")}
              >
                <Text style={[styles.guestPrimaryBtnText, { color: theme.background }]}>Entrar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.guestSecondaryBtn}
                onPress={() => router.push("/auth/cadastro")}
              >
                <Text style={[styles.guestSecondaryBtnText, { color: theme.secondary }]}>Criar conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : podePalpitar ? (
          <>
            <View style={styles.predictionSection}>
              <Text style={[styles.predictionTitle, { color: theme.text }]}>Qual será o placar?</Text>
              <View style={styles.inputsContainer}>
                <View style={styles.inputBox}>
                  <TextInput
                    value={golsA}
                    onChangeText={(text) => setGolsA(text.replace(/[^0-9]/g, "").slice(0, 2))}
                    keyboardType="number-pad"
                    style={[
                      styles.bigInput,
                      { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border },
                    ]}
                    maxLength={2}
                    selectTextOnFocus
                  />
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                    Gols do {partida.selecaoA.nome}
                  </Text>
                </View>

                <Text style={[styles.xSeparator, { color: theme.textSecondary }]}>X</Text>

                <View style={styles.inputBox}>
                  <TextInput
                    value={golsB}
                    onChangeText={(text) => setGolsB(text.replace(/[^0-9]/g, "").slice(0, 2))}
                    keyboardType="number-pad"
                    style={[
                      styles.bigInput,
                      { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border },
                    ]}
                    maxLength={2}
                    selectTextOnFocus
                  />
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                    Gols do {partida.selecaoB.nome}
                  </Text>
                </View>
              </View>
            </View>

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

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  { backgroundColor: theme.secondary, opacity: saving ? 0.7 : 1 },
                ]}
                onPress={handleSavePalpite}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={theme.background} />
                ) : (
                  <Text style={[styles.saveBtnText, { color: theme.background }]}>
                    {palpiteExistente ? "ATUALIZAR PALPITE" : "SALVAR PALPITE"}
                  </Text>
                )}
              </TouchableOpacity>
              <Text style={[styles.disclaimer, { color: theme.textSecondary }]}>
                Você pode editar seu palpite até o início da partida.
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.predictionSection}>
            <Text style={[styles.predictionTitle, { color: theme.textSecondary }]}>
              Palpites encerrados para esta partida.
            </Text>
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: 24,
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
  guestCard: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  guestTitle: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  guestMessage: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  guestPrimaryBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  guestPrimaryBtnText: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  guestSecondaryBtn: {
    paddingVertical: 8,
  },
  guestSecondaryBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
});