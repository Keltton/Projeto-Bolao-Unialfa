import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/theme";
import api from "@/services/api";

// Mocks de fallback caso a API esteja offline
const PODIO_FALLBACK = [
  { id: 2, nome: "CarolFernandes", pontuacaoTotal: 220, placaresExatos: 10, posicao: 2, avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
  { id: 1, nome: "LucasSilva", pontuacaoTotal: 250, placaresExatos: 15, posicao: 1, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
  { id: 3, nome: "MateusB", pontuacaoTotal: 205, placaresExatos: 9, posicao: 3, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" },
];

const LISTA_RANKING_FALLBACK = [
  { id: 4, nome: "JúliaCosta", pontuacaoTotal: 180, placaresExatos: 12, posicao: 4, avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" },
  { id: 5, nome: "PedroAlmeida", pontuacaoTotal: 170, placaresExatos: 10, posicao: 5, avatarUrl: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=100&q=80" },
  { id: 6, nome: "Rafa123", pontuacaoTotal: 165, placaresExatos: 9, posicao: 6, avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" },
  { id: 7, nome: "ThiagoMartins", pontuacaoTotal: 150, placaresExatos: 8, posicao: 7, avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80" },
];

export default function Ranking() {
  const theme = Colors.dark;

  const [podio, setPodio] = useState<any[]>([]);
  const [listaRanking, setListaRanking] = useState<any[]>([]);
  const [usuarioLogadoId, setUsuarioLogadoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const carregarRanking = async (pageToLoad = 0, concatList = false) => {
    if (pageToLoad === 0) {
      setIsLoading(true);
    }
    
    // 1. Obter ID do usuário logado
    try {
      const userStr = await AsyncStorage.getItem("@BolaoCopa:usuario");
      if (userStr) {
        const u = JSON.parse(userStr);
        setUsuarioLogadoId(u.id);
      }
    } catch (e) {
      console.log("Erro ao recuperar ID do usuário logado", e);
    }

    // 2. Chamar API
    try {
      const response = await api.get("/api/ranking", {
        params: { pagina: pageToLoad, tamanho: 50 }
      });

      const { ranking, paginaAtual, totalPaginas: totPag } = response.data;
      
      setTotalPaginas(totPag);
      setPagina(paginaAtual);

      if (pageToLoad === 0) {
        // Separar pódio (os 3 primeiros colocados do ranking geral global)
        const podiumUsers = ranking.filter((u: any) => u.posicao <= 3);
        const listUsers = ranking.filter((u: any) => u.posicao > 3);
        
        // Garantir ordenação no pódio
        setPodio(podiumUsers);
        setListaRanking(listUsers);
      } else {
        if (concatList) {
          setListaRanking(prev => [...prev, ...ranking]);
        }
      }
    } catch (error: any) {
      console.log("Erro ao carregar ranking da API, usando mock:", error.message);
      // Fallback offline
      setPodio(PODIO_FALLBACK);
      
      // Simular destaque do usuário logado na lista
      const mockList = [...LISTA_RANKING_FALLBACK];
      if (usuarioLogadoId) {
        mockList.push({
          id: usuarioLogadoId,
          nome: "Você",
          pontuacaoTotal: 125,
          placaresExatos: 5,
          posicao: 12,
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
        });
      }
      setListaRanking(mockList);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarRanking(0);
  }, [usuarioLogadoId]);

  const carregarMais = () => {
    if (pagina + 1 < totalPaginas) {
      carregarRanking(pagina + 1, true);
    }
  };

  const renderUsuario = ({ item }: { item: any }) => {
    const isLogado = item.id === usuarioLogadoId;

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
          <Image 
            source={{ uri: item.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" }} 
            style={styles.rowAvatar} 
          />
          <View>
            <Text style={[styles.rowNome, { color: isLogado ? theme.background : theme.text }]}>
              {isLogado ? `Você (${item.nome})` : item.nome}
            </Text>
            {isLogado && (
              <Text style={[styles.statusLogadoText, { color: theme.background }]}>
                ● SUBINDO NO RANKING
              </Text>
            )}
          </View>
        </View>

        <Text style={[styles.rowPontos, { color: isLogado ? theme.background : theme.text }]}>
          {item.pontuacaoTotal}
        </Text>

        <Text style={[styles.rowExatos, { color: isLogado ? theme.background : theme.textSecondary }]}>
          {item.placaresExatos}
        </Text>
      </View>
    );
  };

  // Header da lista que contém o pódio e os títulos das colunas
  const renderListHeader = () => {
    const segundo = podio.find(p => p.posicao === 2) || PODIO_FALLBACK[0];
    const primeiro = podio.find(p => p.posicao === 1) || PODIO_FALLBACK[1];
    const terceiro = podio.find(p => p.posicao === 3) || PODIO_FALLBACK[2];

    return (
      <View style={styles.headerContainer}>
        {/* Pódio Piramidal */}
        <View style={styles.podiumWrapper}>
          {/* 2º Colocado */}
          {segundo && (
            <View style={[styles.podiumSeat, styles.seat2]}>
              <View style={[styles.avatarWrapper, { borderColor: "#A6A6A6" }]}>
                <Image source={{ uri: segundo.avatarUrl || segundo.avatar }} style={styles.podiumAvatar} />
                <View style={[styles.badgeMedal, { backgroundColor: "#A6A6A6" }]}>
                  <Text style={styles.medalText}>2º</Text>
                </View>
              </View>
              <Text style={[styles.podiumName, { color: theme.text }]} numberOfLines={1}>
                {segundo.nome}
              </Text>
              <Text style={[styles.podiumPoints, { color: theme.textSecondary }]}>
                <Text style={{ fontWeight: "800", color: theme.text }}>{segundo.pontuacaoTotal}</Text> pts
              </Text>
            </View>
          )}

          {/* 1º Colocado */}
          {primeiro && (
            <View style={[styles.podiumSeat, styles.seat1]}>
              <View style={[styles.avatarWrapper, styles.avatar1, { borderColor: theme.secondary }]}>
                <Image source={{ uri: primeiro.avatarUrl || primeiro.avatar }} style={[styles.podiumAvatar, styles.avatarImg1]} />
                <View style={[styles.badgeMedal, { backgroundColor: theme.secondary }]}>
                  <Text style={[styles.medalText, { color: theme.background }]}>1º</Text>
                </View>
              </View>
              <Text style={[styles.podiumName, styles.name1, { color: theme.text }]} numberOfLines={1}>
                {primeiro.nome}
              </Text>
              <Text style={[styles.podiumPoints, { color: theme.textSecondary }]}>
                <Text style={{ fontWeight: "800", color: theme.secondary, fontSize: 18 }}>{primeiro.pontuacaoTotal}</Text> pts
              </Text>
            </View>
          )}

          {/* 3º Colocado */}
          {terceiro && (
            <View style={[styles.podiumSeat, styles.seat3]}>
              <View style={[styles.avatarWrapper, { borderColor: "#CD7F32" }]}>
                <Image source={{ uri: terceiro.avatarUrl || terceiro.avatar }} style={styles.podiumAvatar} />
                <View style={[styles.badgeMedal, { backgroundColor: "#CD7F32" }]}>
                  <Text style={styles.medalText}>3º</Text>
                </View>
              </View>
              <Text style={[styles.podiumName, { color: theme.text }]} numberOfLines={1}>
                {terceiro.nome}
              </Text>
              <Text style={[styles.podiumPoints, { color: theme.textSecondary }]}>
                <Text style={{ fontWeight: "800", color: theme.text }}>{terceiro.pontuacaoTotal}</Text> pts
              </Text>
            </View>
          )}
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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={listaRanking}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderUsuario}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={carregarMais}
          onEndReachedThreshold={0.3}
          refreshing={isLoading}
          onRefresh={() => carregarRanking(0)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
