import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  View,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import api from "@/services/api";

export default function NovaSenha() {
  const router = useRouter();
  const theme = Colors.dark; // Visual escuro premium da Copa

  const [tokenValidador, setTokenValidador] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSalvarSenha = async () => {
    if (!tokenValidador.trim() || !senha.trim() || !confirmarSenha.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/api/auth/redefinir-senha", {
        token: tokenValidador,
        novaSenha: senha,
      });

      Alert.alert(
        "Senha Salva",
        "Sua nova senha foi registrada com sucesso! Faça login para continuar.",
        [{ text: "OK", onPress: () => router.push("/auth/login") }]
      );
    } catch (error: any) {
      console.log("Reset password error:", error);
      const isNetworkError = !error.response;

      if (isNetworkError) {
        Alert.alert(
          "Modo Offline / Testes",
          "O backend está desligado. Deseja simular a alteração da senha e ir para o login?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Simular e Ir para o Login",
              onPress: () => router.push("/auth/login")
            }
          ]
        );
      } else {
        const msg = error.response?.data?.mensagem || error.response?.data?.message || "Erro ao redefinir senha.";
        Alert.alert("Erro", msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require("../../../assets/images/fundo-login.jpg")}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={[styles.overlay, { backgroundColor: "rgba(9, 20, 33, 0.85)" }]}>
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              contentContainerStyle={styles.scroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Header Brand */}
              <View style={styles.brandContainer}>
                <Ionicons name="football" size={56} color={theme.secondary} style={styles.logoIcon} />
                <Text style={[styles.title, { color: theme.text }]}>
                  BOLÃO{"\n"}
                  <Text style={{ color: theme.secondary }}>COPA 2026</Text>
                </Text>
              </View>

              {/* Card Nova Senha */}
              <View style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.welcomeTitle, { color: theme.text }]}>Nova Senha</Text>
                  <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
                    Defina sua nova senha de acesso ao Bolão.
                  </Text>
                </View>

                {/* Form Fields */}
                <View style={styles.form}>
                  {/* Token Field */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Token Validador</Text>
                    <View style={[styles.glassInput, { borderColor: theme.border }]}>
                      <Ionicons name="key-outline" size={20} color={theme.textSecondary} />
                      <TextInput
                        value={tokenValidador}
                        onChangeText={setTokenValidador}
                        placeholder="Cole o token recebido"
                        placeholderTextColor="rgba(189, 202, 185, 0.5)"
                        autoCapitalize="none"
                        style={[styles.textInput, { color: theme.text }]}
                      />
                    </View>
                  </View>

                  {/* Password Field */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Nova Senha</Text>
                    <View style={[styles.glassInput, { borderColor: theme.border }]}>
                      <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} />
                      <TextInput
                        value={senha}
                        onChangeText={setSenha}
                        placeholder="••••••••"
                        placeholderTextColor="rgba(189, 202, 185, 0.5)"
                        secureTextEntry={!senhaVisivel}
                        style={[styles.textInput, { color: theme.text }]}
                      />
                      <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                        <Ionicons
                          name={senhaVisivel ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color={theme.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Confirm Password Field */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Confirmar Nova Senha</Text>
                    <View style={[styles.glassInput, { borderColor: theme.border }]}>
                      <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} />
                      <TextInput
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        placeholder="••••••••"
                        placeholderTextColor="rgba(189, 202, 185, 0.5)"
                        secureTextEntry={!confirmarSenhaVisivel}
                        style={[styles.textInput, { color: theme.text }]}
                      />
                      <TouchableOpacity onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)}>
                        <Ionicons
                          name={confirmarSenhaVisivel ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color={theme.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity
                      style={[styles.saveBtn, { backgroundColor: theme.secondary }]}
                      onPress={handleSalvarSenha}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color={theme.background} />
                      ) : (
                        <Text style={[styles.saveBtnText, { color: theme.background }]}>SALVAR SENHA</Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.backToLoginBtn}
                      onPress={() => router.push("/auth/login")}
                    >
                      <Text style={[styles.backText, { color: theme.secondary }]}>
                        Voltar para o Login
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  brandContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  logoIcon: {
    marginBottom: 4,
    shadowColor: "#ffe243",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 26,
    letterSpacing: -0.5,
  },
  cardContainer: {
    marginVertical: 15,
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    paddingLeft: 4,
  },
  glassInput: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  textInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
  },
  actionsContainer: {
    marginTop: 10,
    gap: 12,
  },
  saveBtn: {
    height: 52,
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
  backToLoginBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  backText: {
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
