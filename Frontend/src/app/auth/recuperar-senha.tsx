import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { View, Text, TextInput } from "react-native";

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

      <TextInput
          placeholder="Digite seu e-mail"
      />

      <TouchableOpacity>
  <Text>ENVIAR LINK</Text>
</TouchableOpacity>

    </View>
  );
}