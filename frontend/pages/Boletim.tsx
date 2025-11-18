import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface BoletimProps {
  navigation?: {
    navigate: (screen: string) => void;
  };
}

interface BoletimItem {
  disciplina_id: number;
  disciplina_nome: string;
  carga_horaria: number;
  professor_nome: string;
  ano_semestre: string;
  nota1?: number;
  nota2?: number;
  nota3?: number;
  media_final?: number;
  situacao_final: string;
}

interface BoletimData {
  aluno_id: number;
  aluno_nome: string;
  matricula: string;
  curso: string;
  disciplinas: BoletimItem[];
}

export default function Boletim({ navigation }: BoletimProps = {}) {
  const { user } = useAuth();
  const [boletim, setBoletim] = useState<BoletimData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoletim();
  }, []);

  const loadBoletim = async () => {
    try {
      setLoading(true);
      const url = '/boletim';
      
      const response = await api.get(url);
      setBoletim(response.data);
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.error || "Erro ao carregar boletim");
    } finally {
      setLoading(false);
    }
  };

  const formatarNota = (nota?: number): string => {
    return nota !== null && nota !== undefined ? nota.toFixed(2) : "-";
  };

  const getSituacaoColor = (situacao: string): string => {
    switch (situacao.toLowerCase()) {
      case 'aprovado':
        return '#4CAF50';
      case 'reprovado':
        return '#F44336';
      case 'em andamento':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando boletim...</Text>
      </View>
    );
  }

  if (!boletim) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Nenhum dado encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {navigation && (
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      )}
      <View style={styles.header}>
        <Text style={styles.title}>Boletim Acadêmico</Text>
        <Text style={styles.studentName}>{boletim.aluno_nome}</Text>
        <Text style={styles.studentInfo}>Matrícula: {boletim.matricula}</Text>
        <Text style={styles.studentInfo}>Curso: {boletim.curso}</Text>
      </View>

      {boletim.disciplinas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma disciplina encontrada</Text>
        </View>
      ) : (
        boletim.disciplinas.map((disciplina) => (
          <View key={disciplina.disciplina_id} style={styles.disciplinaCard}>
            <View style={styles.disciplinaHeader}>
              <Text style={styles.disciplinaNome}>{disciplina.disciplina_nome}</Text>
              <Text style={styles.anoSemestre}>{disciplina.ano_semestre}</Text>
            </View>
            
            <Text style={styles.professorText}>Professor: {disciplina.professor_nome}</Text>
            <Text style={styles.cargaHoraria}>Carga horária: {disciplina.carga_horaria}h</Text>

            <View style={styles.notasContainer}>
              <View style={styles.notaItem}>
                <Text style={styles.notaLabel}>Nota 1:</Text>
                <Text style={styles.notaValue}>{formatarNota(disciplina.nota1)}</Text>
              </View>
              <View style={styles.notaItem}>
                <Text style={styles.notaLabel}>Nota 2:</Text>
                <Text style={styles.notaValue}>{formatarNota(disciplina.nota2)}</Text>
              </View>
              <View style={styles.notaItem}>
                <Text style={styles.notaLabel}>Nota 3:</Text>
                <Text style={styles.notaValue}>{formatarNota(disciplina.nota3)}</Text>
              </View>
              <View style={[styles.notaItem, styles.mediaItem]}>
                <Text style={styles.mediaLabel}>Média Final:</Text>
                <Text style={styles.mediaValue}>{formatarNota(disciplina.media_final)}</Text>
              </View>
            </View>

            <View style={styles.situacaoContainer}>
              <Text style={[
                styles.situacaoText,
                { color: getSituacaoColor(disciplina.situacao_final) }
              ]}>
                {disciplina.situacao_final.toUpperCase()}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    padding: 15,
    paddingTop: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  studentName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 5,
  },
  studentInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  disciplinaCard: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disciplinaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  disciplinaNome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  anoSemestre: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  professorText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  cargaHoraria: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  notasContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 15,
    marginTop: 10,
  },
  notaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  notaLabel: {
    fontSize: 14,
    color: "#666",
  },
  notaValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  mediaItem: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  mediaLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  mediaValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  situacaoContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "center",
  },
  situacaoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
  },
});

