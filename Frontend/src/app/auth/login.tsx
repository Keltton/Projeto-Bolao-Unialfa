import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  View,
} from "react-native";

export default function Login() {
  return (
    <ImageBackground
      source={require("../../../assets/images/fundo-login.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image
          source={require("../../../assets/images/brasil.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Bolão da Copa</Text>

        <Text style={styles.subtitle}>
          Faça seus palpites e acompanhe sua posição no ranking.
        </Text>

        <TextInput
          placeholder="Digite seu e-mail"
          placeholderTextColor="#AFAFAF"
          style={styles.input}
        />

        <TextInput
          placeholder="Digite sua senha"
          secureTextEntry
          placeholderTextColor="#AFAFAF"
          style={styles.input}
        />

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>
            Esqueci minha senha
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>
            ENTRAR
          </Text>
        </TouchableOpacity>

        <Text style={styles.separator}>OU</Text>

        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>
            CRIAR CONTA
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  logo: {
    width: 110,
    height: 110,
    alignSelf: "center",
    resizeMode: "contain",
    marginBottom: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 2,
  },

  subtitle: {
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 35,
    paddingHorizontal: 10,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#1E8E3E",
    borderRadius: 14,
    paddingHorizontal: 18,
    color: "#FFF",
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    fontSize: 15,
  },

  forgotPassword: {
    color: "#E9C94A",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "500",
    fontSize: 16,
    textDecorationLine: "underline",
  },

  loginButton: {
    backgroundColor: "#E9C94A",
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  loginButtonText: {
    color: "#1A1A1A",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },

  separator: {
    color: "#FFFFFF",
    textAlign: "center",
    marginVertical: 18,
    fontWeight: "600",
    opacity: 0.8,
  },

  registerButton: {
    borderWidth: 1.5,
    borderColor: "#E9C94A",
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  registerButtonText: {
    color: "#E9C94A",
    fontWeight: "700",
    fontSize: 16,
  },
});