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
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { register } from "@/services/authService";
import { getApiErrorMessage } from "@/services/api";
import { toastError, toastSuccess } from "@/util/toast";

export default function Cadastro() {
  const router = useRouter();
  const theme = Colors.dark;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearError = () => {
    if (errorMessage) setErrorMessage(null);
  };

  const handleCadastro = async () => {
    setErrorMessage(null);

    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      toastError("Por favor, preencha todos os campos.");
      return;
    }

    if (nome.trim().length < 3) {
      toastError("O nome deve ter no mínimo 3 caracteres.");
      return;
    }

    if (senha.length < 6) {
      toastError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      toastError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await register(nome.trim(), email.trim(), senha);
      toastSuccess("Agora faça login com seu e-mail e senha.", "Conta criada!");
      router.replace("/auth/login");
    } catch (error) {
      toastError(
        getApiErrorMessage(error, "Não foi possível criar a conta."),
        "Falha no cadastro"
      );
    } finally {
      setLoading(false);
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
                        onChangeText={(text) => {
                          setNome(text);
                          clearError();
                        }}
                        placeholder="Seu nome completo"
                        placeholderTextColor="rgba(189, 202, 185, 0.5)"
                        autoCapitalize="words"
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
                        onChangeText={(text) => {
                          setEmail(text);
                          clearError();
                        }}
                        placeholder="nome@exemplo.com"
                        placeholderTextColor="rgba(189, 202, 185, 0.5)"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
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
                        onChangeText={(text) => {
                          setSenha(text);
                          clearError();
                        }}
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
                        onChangeText={(text) => {
                          setConfirmarSenha(text);
                          clearError();
                        }}
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
                    {errorMessage ? (
                      <View style={styles.errorBox}>
                        <Ionicons name="alert-circle-outline" size={18} color="#ff6b6b" />
                        <Text style={styles.errorText}>{errorMessage}</Text>
                      </View>
                    ) : null}

                    <TouchableOpacity
                      style={[
                        styles.registerBtn,
                        { backgroundColor: theme.secondary, opacity: loading ? 0.7 : 1 },
                      ]}
                      onPress={handleCadastro}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color={theme.background} />
                      ) : (
                        <Text style={[styles.registerBtnText, { color: theme.background }]}>
                          CRIAR CONTA
                        </Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.backToLoginBtn}
                      onPress={() => router.push("/auth/login")}
                      disabled={loading}
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
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 107, 107, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.4)",
    borderRadius: 10,
    padding: 12,
  },
  errorText: {
    flex: 1,
    color: "#ff6b6b",
    fontSize: 13,
    fontWeight: "600",
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