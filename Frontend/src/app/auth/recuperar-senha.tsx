import React from "react";
import { Image } from "react-native";
import { View, Text } from "react-native";

export default function ForgotPassword() {
  return (
    <View>
        <Image
        source={require("../../../assets/images/bola.png")}
        style={{
          width: 70,
          height: 70,
        }}
      />
      <Text>Recuperar Senha</Text>

      <Text>
        Informe seu e-mail para receber as instruções de recuperação.
      </Text>

    </View>
  );
}