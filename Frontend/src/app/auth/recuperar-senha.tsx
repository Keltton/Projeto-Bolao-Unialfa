import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, ImageBackground, View, SafeAreaView, StatusBar, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { styles } from "@/styles/auth/recuperar-senhaStyle";
import { solicitarRecuperacaoSenha } from "@/services/authService";
import { getApiErrorMessage } from "@/services/api";
import { toastError, toastSuccess } from "@/util/toast";

export default function RecuperarSenha() {
  const router = useRouter();
  const theme = Colors.dark;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecuperar = async () => {
    if (!email.trim()) {
      toastError("Erro", "Por favor, digite seu e-mail.");
      return;
    }

    setLoading(true);
    try {
      const mensagem = await solicitarRecuperacaoSenha(email.trim());
      toastSuccess("Código enviado", mensagem);
      router.push({
        pathname: "/auth/nova-senha",
        params: { email: email.trim() },
      });
    } catch (error) {
      toastError(getApiErrorMessage(error, "Não foi possível solicitar a recuperação de senha."));
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
        <View style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={{ flex: 1 }}
            >
              <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
              <View style={styles.brandContainer}>
                <Ionicons name="football" size={56} color={theme.secondary} style={styles.logoIcon} />
                <Text style={[styles.title, { color: theme.text }]}>
                  BOLÃO{"\n"}
                  <Text style={{ color: theme.secondary }}>COPA 2026</Text>
                </Text>
              </View>

              <View style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.welcomeTitle, { color: theme.text }]}>Recuperar Senha</Text>
                  <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
                    Informe seu e-mail para receber um código de 6 dígitos.
                  </Text>
                </View>

                <View style={styles.form}>
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
                        editable={!loading}
                        style={[styles.textInput, { color: theme.text }]}
                      />
                    </View>
                  </View>

                  <View style={styles.actionsContainer}>
                    <TouchableOpacity
                      style={[styles.sendBtn, { backgroundColor: theme.secondary, opacity: loading ? 0.7 : 1 }]}
                      onPress={handleRecuperar}
                      disabled={loading}
                    >
                      <Text style={[styles.sendBtnText, { color: theme.background }]}>ENVIAR CÓDIGO</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.backToLoginBtn}
                      onPress={() => router.push("/auth/login")}
                      disabled={loading}
                    >
                      <Text style={[styles.backText, { color: theme.secondary }]}>
                        Voltar para o Login
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}
