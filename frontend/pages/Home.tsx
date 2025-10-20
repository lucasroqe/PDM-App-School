import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bem-vindo, {user?.nome}</Text>
      <Text>Perfil: {user?.tipo}</Text>
      <Button title="Sair" onPress={logout} />
    </View>
  );
}
