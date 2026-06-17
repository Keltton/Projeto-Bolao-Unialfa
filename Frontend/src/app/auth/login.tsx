import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
} from "react-native";

export default function Login() {
  return (
    <ImageBackground
      source={require("../../../assets/images/fundo-login.jpg")}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../../assets/images/bola.png")}
          style={{
            width: 120,
            height: 120,
          }}
        />

        <Text>Tela de Login</Text>
      </View>
    </ImageBackground>
  );
}