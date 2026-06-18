import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";

export default function Cadastro() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Image
            source={require("../../../assets/images/brasil.png")}
            style={styles.logo}
          />

          <Text style={styles.title}>Criar Conta</Text>

          <Text style={styles.subtitle}>
            Preencha seus dados para participar do Bolão da Copa.
          </Text>

          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            placeholder="Digite seu nome"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            placeholder="Digite seu e-mail"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            style={styles.input}
          />

          <Text style={styles.label}>Confirmar Senha</Text>
          <TextInput
            placeholder="Confirme sua senha"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>
              CRIAR CONTA
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.loginText}>
              Já possui uma conta?{" "}
              <Text style={styles.loginHighlight}>
                Entrar
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 28,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 8,
  },

  logo: {
    width: 140,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 30,
  },

  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 4,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FAFAFA",
    marginBottom: 14,
    fontSize: 15,
  },

  registerButton: {
    backgroundColor: "#137C3F",
    height: 58,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,

    shadowColor: "#137C3F",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  loginText: {
    textAlign: "center",
    marginTop: 22,
    color: "#6B7280",
    fontSize: 14,
  },

  loginHighlight: {
    color: "#137C3F",
    fontWeight: "700",
  },
});