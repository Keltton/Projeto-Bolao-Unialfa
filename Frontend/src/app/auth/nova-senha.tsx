import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

export default function ForgotPassword() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../../../assets/images/brasil.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Nova Senha</Text>

        <Text style={styles.subtitle}>
          Informe seu e-mail para receber as instruções de recuperação da sua conta.
        </Text>

        <TextInput
          placeholder="Nova senha"
          placeholderTextColor="#999"
          secureTextEntry
          
        />

        <TextInput
    placeholder="Confirmar nova senha"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>
          Enviar Link
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.backText}>
            Voltar para o Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  logo: {
    width: 70,
    height: 70,
    alignSelf: "center",
    resizeMode: "contain",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 30,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },

  sendButton: {
    backgroundColor: "#137C3F",
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  backText: {
    textAlign: "center",
    marginTop: 22,
    color: "#137C3F",
    fontWeight: "600",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});