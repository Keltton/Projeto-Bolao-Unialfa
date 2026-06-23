import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, ImageBackground, View, SafeAreaView, StatusBar, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { styles } from "@/styles/auth/nova-senhaStyle";
import { redefinirSenha } from "@/services/authService";
import { getApiErrorMessage } from "@/services/api";
import { toastError, toastSuccess } from "@/util/toast";

export default function NovaSenha() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const theme = Colors.dark;

  const [codigo, setCodigo] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSalvarSenha = async () => {
    if (!codigo.trim() || !senha.trim() || !confirmarSenha.trim()) {
      toastError("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (codigo.trim().length !== 6) {
      toastError("Erro", "O código deve ter 6 dígitos.");
      return;
    }

    if (senha.length < 6) {
      toastError("Erro", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      toastError("Erro", "As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const mensagem = await redefinirSenha(codigo.trim(), senha);
      toastSuccess("Sucesso", mensagem);
      router.replace("/auth/login");
    } catch (error) {
      toastError(getApiErrorMessage(error, "Não foi possível redefinir a senha."));
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
                  <Text style={[styles.welcomeTitle, { color: theme.text }]}>Nova Senha</Text>
                  <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
                    {email
                      ? `Digite o código enviado para ${email} e defina sua nova senha.`
                      : "Digite o código recebido por e-mail e defina sua nova senha."}
                  </Text>
                </View>

                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Código de verificação</Text>
                    <View style={[styles.glassInput, { borderColor: theme.border }]}>
                      <Ionicons name="key-outline" size={20} color={theme.textSecondary} />
                      <TextInput
                        value={codigo}
                        onChangeText={setCodigo}
                        placeholder="000000"
                        placeholderTextColor="rgba(189, 202, 185, 0.5)"
                        keyboardType="number-pad"
                        maxLength={6}
                        editable={!loading}
                        style={[styles.textInput, { color: theme.text, letterSpacing: 4 }]}
                      />
                    </View>
                  </View>

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
                        editable={!loading}
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
                        editable={!loading}
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

                  <View style={styles.actionsContainer}>
                    <TouchableOpacity
                      style={[styles.saveBtn, { backgroundColor: theme.secondary, opacity: loading ? 0.7 : 1 }]}
                      onPress={handleSalvarSenha}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color={theme.background} />
                      ) : (
                        <Text style={[styles.saveBtnText, { color: theme.background }]}>SALVAR SENHA</Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.backToLoginBtn}
                      onPress={() => router.push("/auth/recuperar-senha")}
                      disabled={loading}
                    >
                      <Text style={[styles.backText, { color: theme.secondary }]}>
                        Solicitar novo código
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
