import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, senha);
    } catch {
      Alert.alert("Erro", "Falha no login");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ marginBottom: 10, borderWidth: 1, padding: 8 }} />
      <TextInput placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} style={{ marginBottom: 20, borderWidth: 1, padding: 8 }} />

      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}
