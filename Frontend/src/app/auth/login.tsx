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
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

export default function Login() {
  const router = useRouter();
  const theme = Colors.dark; // Visual escuro premium da Copa

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const handleLogin = async () => {
    // Para fins de teste e desenvolvimento das tabs:
    // Criamos um token mockado e salvamos para que o app saiba que o usuário está logado
    try {
      await AsyncStorage.setItem("@BolaoCopa:token", "jwt-token-mock-rafael");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar o login.");
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

                {/* Actions */}
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={[styles.loginBtn, { backgroundColor: theme.secondary }]}
                    onPress={handleLogin}
                  >
                    <Text style={[styles.loginBtnText, { color: theme.background }]}>ENTRAR</Text>
                  </TouchableOpacity>

                  <View style={styles.dividerRow}>
                    <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                    <Text style={[styles.dividerText, { color: theme.textSecondary }]}>OU</Text>
                    <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                  </View>

                  <TouchableOpacity
                    style={[styles.registerBtn, { borderColor: theme.border }]}
                    onPress={() => router.push("/auth/cadastro")}
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
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  brandContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  logoIcon: {
    marginBottom: 8,
    shadowColor: "#ffe243",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2.5,
    marginTop: 6,
  },
  cardContainer: {
    marginVertical: 20,
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 20,
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
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    paddingLeft: 4,
  },
  forgotPassword: {
    fontSize: 12,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  glassInput: {
    height: 54,
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
  loginBtn: {
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  loginBtnText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.2,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: "700",
    marginHorizontal: 16,
    letterSpacing: 1.5,
  },
  registerBtn: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  registerBtnText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  footerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 10,
    textAlign: "center",
    lineHeight: 14,
    opacity: 0.6,
  },
});