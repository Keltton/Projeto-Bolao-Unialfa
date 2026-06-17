import React from "react";
import { View, Text, ImageBackground } from "react-native";

export default function Login() {
  return (
    <ImageBackground
      source={require("../../../assets/images/fundo-login.jpg")}
      style={{ flex: 1 }}
    >
      <View>
        <Text>Tela de Login</Text>
      </View>
    </ImageBackground>
  );
}