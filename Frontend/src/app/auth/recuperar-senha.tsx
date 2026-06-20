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

export default function RecuperarSenha() {
  const router = useRouter();
  const theme = Colors.dark; // Visual escuro premium da Copa

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRecuperar = async () => {
    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, digite seu e-mail.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/api/auth/recuperar-senha", { email });

      Alert.alert(
        "E-mail Enviado",
        "Se o e-mail estiver cadastrado, você receberá em instantes as instruções de recuperação.",
        [{ text: "Configurar Nova Senha", onPress: () => router.push("/auth/nova-senha") }]
      );
    } catch (error: any) {
      console.log("Password recovery error:", error);
      const isNetworkError = !error.response;

      if (isNetworkError) {
        Alert.alert(
          "Modo Offline / Testes",
          "O backend está desligado. Deseja simular o envio do e-mail e ir para a tela de redefinição de senha?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Simular e Avançar",
              onPress: () => router.push("/auth/nova-senha")
            }
          ]
        );
      } else {
        const msg = error.response?.data?.mensagem || error.response?.data?.message || "Erro ao solicitar recuperação.";
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

              {/* Card Recuperação */}
              <View style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.welcomeTitle, { color: theme.text }]}>Recuperar Senha</Text>
                  <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
                    Informe seu e-mail para receber as instruções de recuperação da sua conta.
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

                  {/* Actions */}
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity
                      style={[styles.sendBtn, { backgroundColor: theme.secondary }]}
                      onPress={handleRecuperar}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color={theme.background} />
                      ) : (
                        <Text style={[styles.sendBtnText, { color: theme.background }]}>ENVIAR LINK</Text>
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
  sendBtn: {
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  sendBtnText: {
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
