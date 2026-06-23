import { Colors } from "@/constants/theme";
import { GuestGate } from "@/components/GuestGate";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/services/api";
import { listarMeusPalpites } from "@/services/palpiteService";
import { Palpite } from "@/types/Palpite";
import { Partida } from "@/types/Partida";
import { resolveImageUrl } from "@/util/imageUrl";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "@/styles/tabs/palpiteStyle";

function podeEditarPalpite(partida: Partida): boolean {
  if (partida.status !== "AGENDADA") return false;
  return new Date() < new Date(partida.dataHora);
}

export default function Palpites() {
  const router = useRouter();
  const theme = Colors.dark;
  const { isAuthenticated } = useAuth();

  const [palpites, setPalpites] = useState<Palpite[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pedirLoginParaOpinar = () => {
    Alert.alert(
      "Login necessário",
      "Para fazer ou editar um palpite, você precisa entrar na sua conta.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Entrar",
          onPress: () => router.push("/auth/login"),
        },
      ]
    );
  };

  const carregarPalpites = useCallback(async () => {
    if (!isAuthenticated) {
      setPalpites([]);
      setLoading(false);
      setErrorMessage(null);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await listarMeusPalpites();
      setPalpites(
        data.sort(
          (a, b) =>
            new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
        )
      );
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Erro ao carregar palpites."));
      setPalpites([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

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
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
          },
        ]}
      >
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
            <Text
              style={[styles.teamName, { color: theme.text }]}
              numberOfLines={1}
            >
              {partida.selecaoA.nome}
            </Text>
          </View>

          <View style={styles.scoresContainer}>
            <View style={styles.predictionBox}>
              <Text style={[styles.scoreNumber, { color: theme.secondary }]}>
                {item.golsSelecaoA}
              </Text>

              <Text
                style={[
                  styles.labelPrediction,
                  { color: theme.textSecondary },
                ]}
              >
                Meu palpite
              </Text>

              <Text style={[styles.scoreNumber, { color: theme.secondary }]}>
                {item.golsSelecaoB}
              </Text>
            </View>

            {isEncerrada && (
              <View style={styles.realBox}>
                <Text style={[styles.realScore, { color: theme.text }]}>
                  Res: {partida.golsSelecaoA ?? 0} x{" "}
                  {partida.golsSelecaoB ?? 0}
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.team, styles.alignRight]}>
            <Text
              style={[styles.teamName, { color: theme.text }]}
              numberOfLines={1}
            >
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
              onPress={() => {
                if (!isAuthenticated) {
                  pedirLoginParaOpinar();
                  return;
                }

                router.push(`/partidas/${partida.id}`);
              }}
            >
              <Text style={[styles.editButtonText, { color: theme.primary }]}>
                Editar
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading && palpites.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Meus Palpites
          </Text>
        </View>

        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <GuestGate
        title="Palpites"
        icon="lock-closed-outline"
        message="Entre na sua conta para fazer e acompanhar seus palpites."
        primaryLabel="Entrar para palpitar"
        onPrimary={() => router.push("/auth/login")}
        onSecondary={() => router.push("/auth/cadastro")}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Meus Palpites
        </Text>
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