import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

export default function Perfil() {
  const router = useRouter();
  const theme = Colors.dark;

  const [nome, setNome] = useState("Rafael Martins");
  const [isEditing, setIsEditing] = useState(false);
  const [editNome, setEditNome] = useState(nome);

  const handleSaveNome = () => {
    if (!editNome.trim()) {
      Alert.alert("Erro", "O nome não pode estar em branco.");
      return;
    }
    setNome(editNome);
    setIsEditing(false);
    Alert.alert("Sucesso", "Nome de exibição atualizado com sucesso.");
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair do App",
      "Deseja realmente encerrar sua sessão?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("@BolaoCopa:token");
            router.replace("/auth/login");
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir Conta",
      "Esta ação é permanente e todos os seus palpites serão deletados. Tem certeza que deseja excluir sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            // Em produção aqui chama DELETE /api/usuarios/me
            await AsyncStorage.removeItem("@BolaoCopa:token");
            Alert.alert("Conta Excluída", "Sua conta foi removida com sucesso de acordo com a LGPD.");
            router.replace("/auth/login");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Meu Perfil</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={[styles.avatarBorder, { borderColor: theme.primary }]}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80" }}
            style={styles.avatar}
          />
        </View>

        {isEditing ? (
          <View style={styles.editRow}>
            <TextInput
              value={editNome}
              onChangeText={setEditNome}
              style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElement }]}
              autoFocus
            />
            <TouchableOpacity onPress={handleSaveNome} style={[styles.saveBtn, { backgroundColor: theme.primary }]}>
              <Ionicons name="checkmark" size={20} color={theme.background} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditing(false)} style={[styles.cancelBtn, { borderColor: theme.border }]}>
              <Ionicons name="close" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.nameRow}>
            <Text style={[styles.nameText, { color: theme.text }]}>{nome}</Text>
            <TouchableOpacity onPress={() => { setEditNome(nome); setIsEditing(true); }}>
              <Ionicons name="create-outline" size={18} color={theme.primary} />
            </TouchableOpacity>
          </View>
        )}
        <Text style={[styles.emailText, { color: theme.textSecondary }]}>rafael.martins@email.com</Text>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        {/* Logout Option */}
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
          onPress={handleLogout}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={[styles.menuText, { color: "#FF3B30" }]}>Encerrar Sessão</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* Delete Account Option */}
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
          onPress={handleDeleteAccount}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            <Text style={[styles.menuText, { color: "#FF3B30" }]}>Excluir Minha Conta</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* LGPD Banner */}
      <View style={styles.footerBanner}>
        <Ionicons name="shield-checkmark-outline" size={16} color={theme.textSecondary} />
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          Seus dados estão protegidos em conformidade com a LGPD.
        </Text>
      </View>
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
  profileCard: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarBorder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "700",
  },
  emailText: {
    fontSize: 13,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
    maxHeight: 46,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  saveBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "600",
  },
  footerBanner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  footerText: {
    fontSize: 11,
    textAlign: "center",
  },
});
