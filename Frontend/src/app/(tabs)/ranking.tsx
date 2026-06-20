import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  ImageStyle,
  StyleProp,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { obterRanking } from "@/services/rankingService";
import { getApiErrorMessage } from "@/services/api";
import { UsuarioRanking } from "@/types/Usuario";
import { resolveImageUrl } from "@/util/imageUrl";

export default function Ranking() {
  const theme = Colors.dark;
  const { user } = useAuth();

  const [ranking, setRanking] = useState<UsuarioRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carregarRanking = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await obterRanking(0, 50);
      setRanking(data.ranking);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Erro ao carregar ranking."));
      setRanking([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarRanking();
    }, [carregarRanking])
  );

  const primeiro = ranking.find((r) => r.posicao === 1);
  const segundo = ranking.find((r) => r.posicao === 2);
  const terceiro = ranking.find((r) => r.posicao === 3);
  const listaRestante = ranking.filter((r) => r.posicao > 3);

  const renderAvatar = (
    avatarUrl: string | null | undefined,
    style: StyleProp<ImageStyle>,
    iconSize = 20
  ) => {
    const uri = resolveImageUrl(avatarUrl);
    if (!uri) {
      return (
        <View
          style={[
            style,
            { backgroundColor: theme.border, justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Ionicons name="person" size={iconSize} color={theme.textSecondary} />
        </View>
      );
    }
    return <Image source={{ uri }} style={style} />;
  };

  const renderPodiumUser = (
    usuario: UsuarioRanking | undefined,
    seatStyle: object,
    borderColor: string,
    medalColor: string,
    medalLabel: string,
    isFirst = false
  ) => {
    if (!usuario) {
      return <View style={[styles.podiumSeat, seatStyle]} />;
    }

    return (
      <View style={[styles.podiumSeat, seatStyle]}>
        <View
          style={[
            styles.avatarWrapper,
            isFirst && styles.avatar1,
            { borderColor },
          ]}
        >
          {renderAvatar(
            usuario.avatarUrl,
            isFirst ? [styles.podiumAvatar, styles.avatarImg1] : styles.podiumAvatar,
            isFirst ? 28 : 22
          )}
          <View style={[styles.badgeMedal, { backgroundColor: medalColor }]}>
            <Text style={[styles.medalText, isFirst && { color: theme.background }]}>
              {medalLabel}
            </Text>
          </View>
        </View>
        <Text
          style={[styles.podiumName, isFirst && styles.name1, { color: theme.text }]}
          numberOfLines={1}
        >
          {usuario.id === user?.id ? "Você" : usuario.nome}
        </Text>
        <Text style={[styles.podiumPoints, { color: theme.textSecondary }]}>
          <Text
            style={{
              fontWeight: "800",
              color: isFirst ? theme.secondary : theme.text,
              fontSize: isFirst ? 18 : undefined,
            }}
          >
            {usuario.pontuacaoTotal}
          </Text>{" "}
          pts
        </Text>
      </View>
    );
  };

  const renderUsuario = ({ item }: { item: UsuarioRanking }) => {
    const isLogado = item.id === user?.id;

    return (
      <View
        style={[
          styles.rowItem,
          {
            backgroundColor: isLogado ? theme.secondary : theme.backgroundElement,
            borderColor: isLogado ? theme.secondary : theme.border,
          },
        ]}
      >
        <Text style={[styles.rowPos, { color: isLogado ? theme.background : theme.text }]}>
          {item.posicao}
        </Text>

        <View style={styles.userInfo}>
          {renderAvatar(item.avatarUrl, styles.rowAvatar, 18)}
          <View>
            <Text style={[styles.rowNome, { color: isLogado ? theme.background : theme.text }]}>
              {isLogado ? "Você" : item.nome}
            </Text>
            {isLogado && (
              <Text style={[styles.statusLogadoText, { color: theme.background }]}>
                ● SUA POSIÇÃO
              </Text>
            )}
          </View>
        </View>

        <Text style={[styles.rowPontos, { color: isLogado ? theme.background : theme.text }]}>
          {item.pontuacaoTotal}
        </Text>

        <Text
          style={[
            styles.rowExatos,
            { color: isLogado ? theme.background : theme.textSecondary },
          ]}
        >
          {item.placaresExatos}
        </Text>
      </View>
    );
  };

  const renderListHeader = () => (
    <View style={styles.headerContainer}>
      {ranking.length > 0 && (
        <View style={styles.podiumWrapper}>
          {renderPodiumUser(segundo, styles.seat2, "#A6A6A6", "#A6A6A6", "2º")}
          {renderPodiumUser(primeiro, styles.seat1, theme.secondary, theme.secondary, "1º", true)}
          {renderPodiumUser(terceiro, styles.seat3, "#CD7F32", "#CD7F32", "3º")}
        </View>
      )}

      <View style={styles.columnTitles}>
        <Text style={[styles.colTitle, styles.colPos, { color: theme.textSecondary }]}>#</Text>
        <Text style={[styles.colTitle, styles.colUser, { color: theme.textSecondary }]}>USUÁRIO</Text>
        <Text style={[styles.colTitle, styles.colPoints, { color: theme.textSecondary }]}>PONTOS</Text>
        <Text style={[styles.colTitle, styles.colExatos, { color: theme.textSecondary }]}>EXATOS</Text>
      </View>
    </View>
  );

  if (loading && ranking.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Ranking Geral</Text>
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Ranking Geral</Text>
      </View>

      {errorMessage && (
        <Text style={[styles.errorText, { color: theme.textSecondary }]}>{errorMessage}</Text>
      )}

      <FlatList
        data={listaRestante}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUsuario}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={carregarRanking}
        ListEmptyComponent={
          ranking.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Nenhum participante no ranking ainda.
            </Text>
          ) : null
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
    paddingBottom: 5,
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
    marginTop: 24,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  podiumWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
    height: 190,
    marginBottom: 35,
  },
  podiumSeat: {
    alignItems: "center",
    width: "30%",
  },
  seat1: {
    width: "38%",
    zIndex: 10,
  },
  seat2: {
    marginRight: -10,
  },
  seat3: {
    marginLeft: -10,
  },
  avatarWrapper: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
  },
  avatar1: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarImg1: {
    width: 82,
    height: 82,
    borderRadius: 41,
  },
  badgeMedal: {
    position: "absolute",
    bottom: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#091421",
  },
  medalText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FFF",
  },
  podiumName: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 14,
    textAlign: "center",
  },
  name1: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 16,
  },
  podiumPoints: {
    fontSize: 11,
    marginTop: 2,
  },
  columnTitles: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  colTitle: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  colPos: {
    width: 35,
  },
  colUser: {
    flex: 1,
  },
  colPoints: {
    width: 65,
    textAlign: "center",
  },
  colExatos: {
    width: 55,
    textAlign: "right",
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  rowPos: {
    width: 35,
    fontSize: 14,
    fontWeight: "800",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  rowAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  rowNome: {
    fontSize: 13,
    fontWeight: "700",
  },
  statusLogadoText: {
    fontSize: 8,
    fontWeight: "800",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  rowPontos: {
    width: 65,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  rowExatos: {
    width: 55,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
  },
});