import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, ImageBackground, View, SafeAreaView, StatusBar, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { styles } from "@/styles/auth/recuperar-senhaStyle";

export default function RecuperarSenha() {
  const router = useRouter();
  const theme = Colors.dark; // Visual escuro premium da Copa

  const [email, setEmail] = useState("");

  const handleRecuperar = () => {
    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, digite seu e-mail.");
      return;
    }

    Alert.alert(
      "E-mail Enviado",
      "Um link de redefinição de senha foi enviado para seu e-mail. Vamos configurar sua nova senha.",
      [{ text: "OK", onPress: () => router.push("/auth/nova-senha") }]
    );
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
                    >
                      <Text style={[styles.sendBtnText, { color: theme.background }]}>ENVIAR CÓDIGO</Text>
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
