import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

export default function TabsLayout() {
  const themeColors = Colors.dark; // Forçar visual escuro premium conforme mockups

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: themeColors.secondary, // Amarelo Copa
        tabBarInactiveTintColor: themeColors.textSecondary, // Cinza/Verde fosco
        tabBarStyle: {
          backgroundColor: themeColors.backgroundElement, // Azul estádio escuro card
          borderTopColor: themeColors.border,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
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
          title: "Perfil",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
