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

export default function Cadastro() {
  const router = useRouter();
  const theme = Colors.dark; // Visual escuro premium da Copa

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCadastro = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/api/auth/register", {
        nome,
        email,
        senha,
        avatarUrl: null
      });

      Alert.alert(
        "Cadastro Realizado",
        "Sua conta foi criada com sucesso! Agora você já pode fazer login.",
        [{ text: "OK", onPress: () => router.push("/auth/login") }]
      );
    } catch (error: any) {
      console.log("Cadastro error:", error);
      const isNetworkError = !error.response;

      if (isNetworkError) {
        Alert.alert(
          "Modo Offline / Testes",
          "O backend está desligado. Deseja simular a criação da conta e avançar para o login?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Simular e Avançar",
              onPress: () => {
                Alert.alert(
                  "Cadastro Simulado (Modo Offline)",
                  "Sua conta temporária foi criada localmente para testes.",
                  [{ text: "Ir para Login", onPress: () => router.push("/auth/login") }]
                );
              }
            }
          ]
        );
      } else {
        const msg = error.response?.data?.mensagem || error.response?.data?.message || "Erro ao realizar cadastro.";
        Alert.alert("Erro no Cadastro", msg);
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

              {/* Card Cadastro */}
              <View style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.welcomeTitle, { color: theme.text }]}>Criar Conta</Text>
                  <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
                    Preencha os dados abaixo para participar!
                  </Text>
                </View>

                {/* Form Fields */}
                <View style={styles.form}>
                  {/* Nome Field */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Nome Completo</Text>
                    <View style={[styles.glassInput, { borderColor: theme.border }]}>
                      <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
                      <TextInput
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Seu nome completo"
                        placeholderTextColor="rgba(189, 202, 185, 0.5)"
                        style={[styles.textInput, { color: theme.text }]}
                      />
                    </View>
                  </View>

                  {/* Email Field */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>E-mail</Text>
                    <View style={[styles.glassInput, { borderColor: theme.border }]}>
                      <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
                      <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="nome@exemplo.com"
                        placeholderTextColor="rgba(189, 202, 185, 0.5)"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={[styles.textInput, { color: theme.text }]}
                      />
                    </View>
                  </View>

                  {/* Password Field */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Senha</Text>
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
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Confirmar Senha</Text>
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
                      style={[styles.registerBtn, { backgroundColor: theme.secondary }]}
                      onPress={handleCadastro}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color={theme.background} />
                      ) : (
                        <Text style={[styles.registerBtnText, { color: theme.background }]}>CRIAR CONTA</Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.backToLoginBtn}
                      onPress={() => router.push("/auth/login")}
                    >
                      <Text style={styles.loginText}>
                        Já possui uma conta?{" "}
                        <Text style={[styles.loginHighlight, { color: theme.secondary }]}>Entrar</Text>
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
    marginBottom: 15,
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
    marginVertical: 10,
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 13,
    textAlign: "center",
  },
  form: {
    gap: 12,
  },
  inputGroup: {
    gap: 6,
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
    marginTop: 15,
    gap: 12,
  },
  registerBtn: {
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  registerBtnText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  backToLoginBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  loginText: {
    fontSize: 13,
    color: "#bdcab9",
  },
  loginHighlight: {
    fontWeight: "700",
  },
});