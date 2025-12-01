import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";

interface LoginProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export default function Login({ navigation }: LoginProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha email e senha");
      return;
    }

    setLoading(true);
    try {
      await login(email, senha);
    } catch (error: any) {
      Alert.alert(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOGIN</Text>
      <Text style={styles.subtitle}>Sistema de Gerenciamento Acadêmico</Text>

      <TextInput
        placeholder="abc@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="1234"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
      />

      <Button
        title={loading ? "Entrando..." : "Entrar"}
        onPress={handleLogin}
        disabled={loading}
        color="#6d0787"
      />

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Não tem conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CadastroAluno')}>
          <Text style={styles.registerLink}>Cadastre-se como Aluno</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CadastroProfessor')}>
          <Text style={styles.registerLink}>Cadastre-se como Professor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#999999"
  },
  registerContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  registerLink: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 5,
  },
});
