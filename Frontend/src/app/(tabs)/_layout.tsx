import { Tabs } from "expo-router";
import { ActivityIndicator, Platform, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";

export default function TabsLayout() {
  const themeColors = Colors.dark;
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: themeColors.secondary,
          tabBarInactiveTintColor: themeColors.textSecondary,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            paddingBottom: Platform.OS === "ios" ? 0 : 4,
          },
          tabBarStyle: {
            backgroundColor: themeColors.backgroundElement,
            borderTopColor: themeColors.border,
            height: Platform.OS === "ios" ? 88 : 72,
            paddingBottom: Platform.OS === "ios" ? 30 : 8,
            paddingTop: 8,
          },
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          href: isAuthenticated ? "/(tabs)" : null,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="partidas"
        options={{
          title: "Partidas",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "football" : "football-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="palpites"
        options={{
          title: "Palpites",
          href: isAuthenticated ? "/(tabs)/palpites" : null,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: "Ranking",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "trophy" : "trophy-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: isAuthenticated ? "Perfil" : "Entrar",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
      {isLoading ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: themeColors.background,
          }}
        >
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      ) : null}
    </>
  );
}
