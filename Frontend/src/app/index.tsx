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
        <ActivityIndicator size="large" color={theme.secondary} />
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
        <View
          style={[
            styles.overlay,
            { backgroundColor: "rgba(9, 20, 33, 0.85)" },
          ]}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>
              <View style={styles.brandContainer}>
                <Ionicons
                  name="football"
                  size={72}
                  color={theme.secondary}
                  style={styles.logoIcon}
                />

                <Text style={[styles.title, { color: theme.text }]}>
                  BOLÃO{"\n"}
                  <Text style={{ color: theme.secondary }}>COPA 2026</Text>
                </Text>

                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  RUMO AO HEXA!
                </Text>
              </View>

              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    { backgroundColor: theme.secondary },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => router.push("/auth/login")}
                >
                  <Text
                    style={[
                      styles.primaryButtonText,
                      { color: theme.background },
                    ]}
                  >
                    Entrar
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={theme.background}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    { borderColor: theme.secondary },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => router.push("/auth/cadastro")}
                >
                  <Text
                    style={[
                      styles.secondaryButtonText,
                      { color: theme.secondary },
                    ]}
                  >
                    Criar conta
                  </Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View
                    style={[
                      styles.dividerLine,
                      { backgroundColor: theme.border },
                    ]}
                  />
                  <Text style={[styles.dividerText, { color: theme.textSecondary }]}>
                    ou
                  </Text>
                  <View
                    style={[
                      styles.dividerLine,
                      { backgroundColor: theme.border },
                    ]}
                  />
                </View>

                <TouchableOpacity
                  style={styles.visitorButton}
                  activeOpacity={0.85}
                  onPress={() => router.replace("/(tabs)/partidas")}
                >
                  <Text
                    style={[
                      styles.visitorButtonText,
                      { color: theme.textSecondary },
                    ]}
                  >
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