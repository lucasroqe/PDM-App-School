import React from "react";
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";

interface HomeProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export default function Home({ navigation }: HomeProps) {
  const { user, logout } = useAuth();

  const isAdmin = user?.tipo_usuario === 'admin';
  const isProfessor = user?.tipo_usuario === 'professor';
  const isAluno = user?.tipo_usuario === 'aluno';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-vindo, {user?.nome}</Text>
        <Text style={styles.profileText}>Perfil: {user?.tipo_usuario}</Text>
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
  logoutContainer: {
    padding: 20,
    marginTop: 20,
  },
});
