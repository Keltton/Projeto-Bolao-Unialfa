import React, { useState } from "react";
import {Text,TextInput,TouchableOpacity,ImageBackground,View,SafeAreaView,StatusBar,ActivityIndicator} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { styles } from "./loginStyle";

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const theme = Colors.dark;

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearError = () => {
    if (errorMessage) setErrorMessage(null);
  };

  const handleLogin = async () => {
    setErrorMessage(null);

    if (!email.trim() || !senha.trim()) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, senha);
      router.replace("/(tabs)");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Credenciais inválidas."));
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
            {/* Header Brand */}
            <View style={styles.brandContainer}>
              <Ionicons name="football" size={72} color={theme.secondary} style={styles.logoIcon} />
              <Text style={[styles.title, { color: theme.text }]}>
                BOLÃO{"\n"}
                <Text style={{ color: theme.secondary }}>COPA 2026</Text>
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>RUMO AO HEXA!</Text>
            </View>

            {/* Login Card */}
            <View style={styles.cardContainer}>
              <View style={styles.cardHeader}>
                <Text style={[styles.welcomeTitle, { color: theme.text }]}>Bem-vindo de volta</Text>
                <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
                  Entre na sua conta e faça seus palpites!
                </Text>
              </View>

              {/* Form Fields */}
              <View style={styles.form}>
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
                  <View style={styles.labelRow}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Senha</Text>
                    <TouchableOpacity onPress={() => router.push("/auth/recuperar-senha")}>
                      <Text style={[styles.forgotPassword, { color: theme.secondary }]}>
                        Esqueci minha senha
                      </Text>
                    </TouchableOpacity>
                  </View>
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
                      styles.loginBtn,
                      { backgroundColor: theme.secondary, opacity: loading ? 0.7 : 1 },
                    ]}
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color={theme.background} />
                    ) : (
                      <Text style={[styles.loginBtnText, { color: theme.background }]}>ENTRAR</Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.dividerRow}>
                    <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                    <Text style={[styles.dividerText, { color: theme.textSecondary }]}>OU</Text>
                    <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                  </View>

                  <TouchableOpacity
                    style={[styles.registerBtn, { borderColor: theme.border }]}
                    onPress={() => router.push("/auth/cadastro")}
                    disabled={loading}
                  >
                    <Text style={[styles.registerBtnText, { color: theme.text }]}>CRIAR CONTA</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footerContainer}>
              <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                © 2026 FIFA World Cup Predictor{"\n"}
                Todos os direitos reservados
              </Text>
            </View>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}
