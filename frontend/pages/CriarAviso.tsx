import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface CriarAvisoProps {
  navigation?: {
    navigate: (screen: string) => void;
  };
}

export default function CriarAviso({ navigation }: CriarAvisoProps = {}) {
  const { user } = useAuth();
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [tipo, setTipo] = useState<"geral" | "lembrete" | "institucional">("geral");
  const [loading, setLoading] = useState(false);

  const handleCriarAviso = async () => {
    if (!titulo.trim()) {
      Alert.alert("Erro", "O título é obrigatório");
      return;
    }

    if (!conteudo.trim()) {
      Alert.alert("Erro", "O conteúdo é obrigatório");
      return;
    }

    try {
      setLoading(true);
      await api.post("/avisos", {
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        tipo,
      });

      Alert.alert("Sucesso", "Aviso criado com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            setTitulo("");
            setConteudo("");
            setTipo("geral");
            navigation?.navigate("Avisos");
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Erro ao criar aviso"
      );
    } finally {
      setLoading(false);
    }
  };

  if (user?.tipo_usuario !== "admin" && user?.tipo_usuario !== "professor") {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Você não tem permissão para criar avisos
        </Text>
        {navigation && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Criar Novo Aviso</Text>
        {navigation && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Avisos")}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Digite o título do aviso"
            placeholderTextColor="#999"
            maxLength={255}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Aviso</Text>
          <View style={styles.tipoContainer}>
            <TouchableOpacity
              style={[
                styles.tipoButton,
                tipo === "geral" && styles.tipoButtonActive,
              ]}
              onPress={() => setTipo("geral")}
            >
              <Text
                style={[
                  styles.tipoButtonText,
                  tipo === "geral" && styles.tipoButtonTextActive,
                ]}
              >
                Geral
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tipoButton,
                tipo === "lembrete" && styles.tipoButtonActive,
              ]}
              onPress={() => setTipo("lembrete")}
            >
              <Text
                style={[
                  styles.tipoButtonText,
                  tipo === "lembrete" && styles.tipoButtonTextActive,
                ]}
              >
                Lembrete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tipoButton,
                tipo === "institucional" && styles.tipoButtonActive,
              ]}
              onPress={() => setTipo("institucional")}
            >
              <Text
                style={[
                  styles.tipoButtonText,
                  tipo === "institucional" && styles.tipoButtonTextActive,
                ]}
              >
                Institucional
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Conteúdo *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={conteudo}
            onChangeText={setConteudo}
            placeholder="Digite o conteúdo do aviso"
            placeholderTextColor="#999"
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleCriarAviso}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Criar Aviso</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 150,
    paddingTop: 12,
  },
  tipoContainer: {
    flexDirection: "row",
    gap: 10,
  },
  tipoButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  tipoButtonActive: {
    borderColor: "#007AFF",
    backgroundColor: "#E3F2FD",
  },
  tipoButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  tipoButtonTextActive: {
    color: "#007AFF",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
    textAlign: "center",
    marginBottom: 20,
  },
});

