import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  Platform,
} from "react-native";
import { Colors } from "@/constants/theme";

// Mock do ranking geral baseado no design da Maria
const PODIO_MOCK = [
  { id: 2, nome: "CarolFernandes", pontos: 220, exatos: 10, posicao: 2, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
  { id: 1, nome: "LucasSilva", pontos: 250, exatos: 15, posicao: 1, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
  { id: 3, nome: "MateusB", pontos: 205, exatos: 9, posicao: 3, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" },
];

const LISTA_RANKING_MOCK = [
  { id: 4, nome: "JúliaCosta", pontos: 180, exatos: 12, posicao: 4, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" },
  { id: 5, nome: "PedroAlmeida", pontos: 170, exatos: 10, posicao: 5, avatar: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=100&q=80" },
  { id: 6, nome: "Rafa123", pontos: 165, exatos: 9, posicao: 6, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" },
  { id: 7, nome: "ThiagoMartins", pontos: 150, exatos: 8, posicao: 7, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80" },
  // Usuário logado
  { id: 10, nome: "Você (Rafael)", pontos: 125, exatos: 5, posicao: 12, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80", logado: true }
];

export default function Ranking() {
  const theme = Colors.dark;

  const renderUsuario = ({ item }: { item: typeof LISTA_RANKING_MOCK[0] }) => {
    const isLogado = item.logado;

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
          <Image source={{ uri: item.avatar }} style={styles.rowAvatar} />
          <View>
            <Text style={[styles.rowNome, { color: isLogado ? theme.background : theme.text }]}>
              {item.nome}
            </Text>
            {isLogado && (
              <Text style={[styles.statusLogadoText, { color: theme.background }]}>
                ● SUBINDO NO RANKING
              </Text>
            )}
          </View>
        </View>

        <Text style={[styles.rowPontos, { color: isLogado ? theme.background : theme.text }]}>
          {item.pontos}
        </Text>

        <Text style={[styles.rowExatos, { color: isLogado ? theme.background : theme.textSecondary }]}>
          {item.exatos}
        </Text>
      </View>
    );
  };

  // Header da lista que contém o pódio e os títulos das colunas
  const renderListHeader = () => {
    // Organiza as posições do pódio em: Carol (2º), Lucas (1º), Mateus (3º)
    const segundo = PODIO_MOCK.find(p => p.posicao === 2)!;
    const primeiro = PODIO_MOCK.find(p => p.posicao === 1)!;
    const terceiro = PODIO_MOCK.find(p => p.posicao === 3)!;

    return (
      <View style={styles.headerContainer}>
        {/* Pódio Piramidal */}
        <View style={styles.podiumWrapper}>
          {/* 2º Colocado */}
          <View style={[styles.podiumSeat, styles.seat2]}>
            <View style={[styles.avatarWrapper, { borderColor: "#A6A6A6" }]}>
              <Image source={{ uri: segundo.avatar }} style={styles.podiumAvatar} />
              <View style={[styles.badgeMedal, { backgroundColor: "#A6A6A6" }]}>
                <Text style={styles.medalText}>2º</Text>
              </View>
            </View>
            <Text style={[styles.podiumName, { color: theme.text }]} numberOfLines={1}>
              {segundo.nome}
            </Text>
            <Text style={[styles.podiumPoints, { color: theme.textSecondary }]}>
              <Text style={{ fontWeight: "800", color: theme.text }}>{segundo.pontos}</Text> pts
            </Text>
          </View>

          {/* 1º Colocado (Centro / Destaque) */}
          <View style={[styles.podiumSeat, styles.seat1]}>
            <View style={[styles.avatarWrapper, styles.avatar1, { borderColor: theme.secondary }]}>
              <Image source={{ uri: primeiro.avatar }} style={[styles.podiumAvatar, styles.avatarImg1]} />
              <View style={[styles.badgeMedal, { backgroundColor: theme.secondary }]}>
                <Text style={[styles.medalText, { color: theme.background }]}>1º</Text>
              </View>
            </View>
            <Text style={[styles.podiumName, styles.name1, { color: theme.text }]} numberOfLines={1}>
              {primeiro.nome}
            </Text>
            <Text style={[styles.podiumPoints, { color: theme.textSecondary }]}>
              <Text style={{ fontWeight: "800", color: theme.secondary, fontSize: 18 }}>{primeiro.pontos}</Text> pts
            </Text>
          </View>

          {/* 3º Colocado */}
          <View style={[styles.podiumSeat, styles.seat3]}>
            <View style={[styles.avatarWrapper, { borderColor: "#CD7F32" }]}>
              <Image source={{ uri: terceiro.avatar }} style={styles.podiumAvatar} />
              <View style={[styles.badgeMedal, { backgroundColor: "#CD7F32" }]}>
                <Text style={styles.medalText}>3º</Text>
              </View>
            </View>
            <Text style={[styles.podiumName, { color: theme.text }]} numberOfLines={1}>
              {terceiro.nome}
            </Text>
            <Text style={[styles.podiumPoints, { color: theme.textSecondary }]}>
              <Text style={{ fontWeight: "800", color: theme.text }}>{terceiro.pontos}</Text> pts
            </Text>
          </View>
        </View>

        {/* Cabeçalho das Colunas */}
        <View style={styles.columnTitles}>
          <Text style={[styles.colTitle, styles.colPos, { color: theme.textSecondary }]}>#</Text>
          <Text style={[styles.colTitle, styles.colUser, { color: theme.textSecondary }]}>USUÁRIO</Text>
          <Text style={[styles.colTitle, styles.colPoints, { color: theme.textSecondary }]}>PONTOS</Text>
          <Text style={[styles.colTitle, styles.colExatos, { color: theme.textSecondary }]}>EXATOS</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Ranking Geral</Text>
      </View>

      <FlatList
        data={LISTA_RANKING_MOCK}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUsuario}
        ListHeaderComponent={renderListHeader}
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
    paddingBottom: 5,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
