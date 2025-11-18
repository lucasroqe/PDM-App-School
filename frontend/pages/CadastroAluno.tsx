import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface CadastroAlunoProps {
  navigation?: {
    navigate: (screen: string) => void;
  };
}

export default function CadastroAluno({ navigation }: CadastroAlunoProps = {}) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [curso, setCurso] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!email || !senha || !nome || !matricula || !curso) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      await api.post("/cadastro/aluno", {
        email,
        senha,
        nome,
        matricula,
        curso,
      });
      Alert.alert("Sucesso", "Aluno cadastrado com sucesso!", [
        { 
          text: "OK", 
          onPress: () => {
            setEmail("");
            setSenha("");
            setNome("");
            setMatricula("");
            setCurso("");
            if (navigation) {
              navigation.navigate('Login');
            }
          }
        }
      ]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Erro ao cadastrar aluno";
      const errorDetails = error.response?.data?.details;
      Alert.alert(
        "Erro", 
        errorDetails ? `${errorMessage}\n\nDetalhes: ${errorDetails}` : errorMessage
      );
      console.error("Erro completo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {user && navigation && (
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>Cadastro de Aluno</Text>

      <TextInput
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
        style={styles.input}
      />

      <TextInput
        placeholder="Curso"
        value={curso}
        onChangeText={setCurso}
        style={styles.input}
      />

      <Button
        title={loading ? "Cadastrando..." : "Cadastrar"}
        onPress={handleCadastro}
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
});

