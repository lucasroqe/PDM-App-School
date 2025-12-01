import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity,
  RefreshControl 
} from "react-native";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface AvisosProps {
  navigation?: {
    navigate: (screen: string) => void;
    addListener?: (event: string, callback: () => void) => () => void;
  };
}

interface Aviso {
  id: number;
  titulo: string;
  conteudo: string;
  autor_id: number;
  autor_nome?: string;
  tipo: string;
  criado_em: string;
  atualizado_em: string;
  ativo: boolean;
  lido?: boolean;
}

export default function Avisos({ navigation }: AvisosProps = {}) {
  const { user } = useAuth();
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAvisos();
  }, []);

  const loadAvisos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/avisos');
      setAvisos(response.data.avisos || []);
    } catch (error: any) {
      Alert.alert(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAvisos();
    setRefreshing(false);
  };

  const getTipoColor = (tipo: string): string => {
    switch (tipo) {
      case 'institucional':
        return '#2196F3';
      case 'lembrete':
        return '#FF9800';
      case 'geral':
      default:
        return '#4CAF50';
    }
  };

  const getTipoLabel = (tipo: string): string => {
    switch (tipo) {
      case 'institucional':
        return 'Institucional';
      case 'lembrete':
        return 'Lembrete';
      case 'geral':
      default:
        return 'Geral';
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando avisos...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {navigation && (
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      )}

      <View style={styles.header}>
        <Text style={styles.title}>Avisos Acadêmicos</Text>
        {(user?.tipo_usuario === 'admin' || user?.tipo_usuario === 'professor') && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation?.navigate('CriarAviso')}
          >
            <Text style={styles.createButtonText}>+ Novo Aviso</Text>
          </TouchableOpacity>
        )}
      </View>

      {avisos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum aviso disponível</Text>
        </View>
      ) : (
        avisos.map((aviso) => (
          <TouchableOpacity
            key={aviso.id}
            style={[
              styles.avisoCard,
              user?.tipo_usuario === 'aluno' && !aviso.lido && styles.avisoNaoLido
            ]}

            activeOpacity={0.7}
          >
            <View style={styles.avisoHeader}>
              <View style={styles.avisoHeaderLeft}>
                <Text style={styles.avisoTitulo}>{aviso.titulo}</Text>
                <View style={[styles.tipoBadge, { backgroundColor: getTipoColor(aviso.tipo) }]}>
                  <Text style={styles.tipoText}>{getTipoLabel(aviso.tipo)}</Text>
                </View>
              </View>
              {user?.tipo_usuario === 'aluno' && !aviso.lido && (
                <View style={styles.naoLidoBadge}>
                  <Text style={styles.naoLidoText}>NOVO</Text>
                </View>
              )}
            </View>

            <Text style={styles.avisoConteudo}>{aviso.conteudo}</Text>

            <View style={styles.avisoFooter}>
              <Text style={styles.avisoAutor}>
                Por: {aviso.autor_nome || 'Sistema'}
              </Text>
            </View>
          </TouchableOpacity>
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
    marginBottom: 15,
    color: "#333",
  },
  createButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
  avisoCard: {
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
  avisoNaoLido: {
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    backgroundColor: "#E3F2FD",
  },
  avisoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  avisoHeaderLeft: {
    flex: 1,
  },
  avisoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  tipoBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tipoText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  naoLidoBadge: {
    backgroundColor: "#F44336",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 10,
  },
  naoLidoText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  avisoConteudo: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  avisoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  avisoAutor: {
    fontSize: 12,
    color: "#999",
  },
  avisoData: {
    fontSize: 12,
    color: "#999",
  },
});

