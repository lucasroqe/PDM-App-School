import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Professor {
  id: number;
  nome: string;
}

interface CadastroDisciplinaProps {
  navigation?: {
    navigate: (screen: string) => void;
  };
}

export default function CadastroDisciplina({ navigation }: CadastroDisciplinaProps = {}) {
  const { user } = useAuth();
  const [nome, setNome] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("");
  const [professorId, setProfessorId] = useState("");
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfessores();
  }, []);

  const loadProfessores = async () => {
    try {
      const response = await api.get("/cadastro/professores");
      setProfessores(response.data);
    } catch (error) {
      console.error("Erro ao carregar professores:", error);
    }
  };

  const handleCadastro = async () => {
    if (!nome || !cargaHoraria || !professorId) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      await api.post("/cadastro/disciplina", {
        nome,
        carga_horaria: parseInt(cargaHoraria),
        professor_id: parseInt(professorId),
      });
      Alert.alert("Sucesso", "Disciplina cadastrada com sucesso!", [
        { text: "OK", onPress: () => {
          setNome("");
          setCargaHoraria("");
          setProfessorId("");
        }}
      ]);
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.error || "Erro ao cadastrar disciplina");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {navigation && (
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>Cadastro de Disciplina</Text>

      <TextInput
        placeholder="Nome da disciplina"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      <TextInput
        placeholder="Carga horária"
        value={cargaHoraria}
        onChangeText={setCargaHoraria}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Professor responsável:</Text>
        {professores.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum professor cadastrado</Text>
        ) : (
          professores.map((prof) => (
            <TouchableOpacity
              key={prof.id}
              style={[
                styles.professorOption,
                professorId === prof.id.toString() && styles.professorOptionSelected
              ]}
              onPress={() => setProfessorId(prof.id.toString())}
            >
              <Text style={[
                styles.professorText,
                professorId === prof.id.toString() && styles.professorTextSelected
              ]}>
                {prof.nome}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

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
    color: "#077a87",
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
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "500",
  },
  professorOption: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  professorOptionSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#e3f2fd",
  },
  professorText: {
    fontSize: 16,
    color: "#333",
  },
  professorTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
  emptyText: {
    color: "#999",
    fontStyle: "italic",
    marginTop: 10,
  },
});

