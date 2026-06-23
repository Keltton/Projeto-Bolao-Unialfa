import React from "react";
import {
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Colors } from "@/constants/theme";
import { styles } from "@/styles/auth/entradaStyle";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const theme = Colors.dark;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={require("../../assets/images/fundo-login.jpg")}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>
              <View style={styles.brandContainer}>
                <View style={styles.logoCircle}>
                  <Ionicons name="football" size={34} color={theme.primary} />
                </View>

                <Text style={styles.title}>
                  BOLÃO{"\n"}
                  <Text style={styles.titleHighlight}>ESPORTIVO</Text>
                </Text>

                <Text style={styles.subtitle}>A ELITE DOS PALPITES</Text>
              </View>

              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  activeOpacity={0.85}
                  onPress={() => router.push("/auth/login")}
                >
                  <Text style={styles.primaryButtonText}>Entrar</Text>
                  <Ionicons name="arrow-forward" size={18} color="#091421" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  activeOpacity={0.85}
                  onPress={() => router.push("/auth/cadastro")}
                >
                  <Text style={styles.secondaryButtonText}>Criar conta</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>ou</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.visitorButton}
                  activeOpacity={0.85}
                  onPress={() => router.replace("/(tabs)/ranking")}
                >
                  <Text style={styles.visitorButtonText}>
                    Continuar como visitante
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}