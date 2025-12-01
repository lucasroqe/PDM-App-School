import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

interface HomeProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export default function Home({ navigation }: HomeProps) {
  const { user, logout } = useAuth();
  const [avisosNaoLidos, setAvisosNaoLidos] = useState(0);

  const isAdmin = user?.tipo_usuario === 'admin';
  const isProfessor = user?.tipo_usuario === 'professor';
  const isAluno = user?.tipo_usuario === 'aluno';

  useEffect(() => {
    if (isAluno) {
      loadAvisosNaoLidos();
      const interval = setInterval(loadAvisosNaoLidos, 30000);
      return () => clearInterval(interval);
    }
  }, [isAluno]);

  const loadAvisosNaoLidos = async () => {
    try {
      const response = await api.get('/avisos/nao-lidos');
      setAvisosNaoLidos(response.data.count || 0);
    } catch (error) {
      console.error('Erro ao carregar avisos não lidos:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-vindo, {user?.nome}</Text>
      </View>

      <View style={styles.menuContainer}>
        {(isAdmin || isProfessor) && (
          <>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('CadastroAluno')}
            >
              <Text style={styles.menuText}>Cadastrar Aluno</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('CadastroProfessor')}
            >
              <Text style={styles.menuText}>Cadastrar Professor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('CadastroDisciplina')}
            >
              <Text style={styles.menuText}>Cadastrar Disciplina</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Boletim')}
        >
          <Text style={styles.menuText}>Ver Boletim</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate('Avisos');
          }}
        >
          <View style={styles.menuItemWithBadge}>
            <Text style={styles.menuText}>Avisos Acadêmicos</Text>
            {isAluno && avisosNaoLidos > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{avisosNaoLidos}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <Button title="Sair" onPress={logout} color="#F44336" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  profileText: {
    fontSize: 16,
    color: "#666",
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuText: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "600",
  },
  menuItemWithBadge: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  badge: {
    backgroundColor: "#F44336",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  logoutContainer: {
    padding: 20,
    marginTop: 20,
  },
});
