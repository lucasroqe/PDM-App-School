import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CadastroAluno from "./pages/CadastroAluno";
import CadastroProfessor from "./pages/CadastroProfessor";
import CadastroDisciplina from "./pages/CadastroDisciplina";
import Boletim from "./pages/Boletim";
import Avisos from "./pages/Avisos";
import CriarAviso from "./pages/CriarAviso";
import { AuthProvider, useAuth } from "./context/AuthContext";

type Screen = 'Login' | 'Home' | 'CadastroAluno' | 'CadastroProfessor' | 'CadastroDisciplina' | 'Boletim' | 'Avisos' | 'CriarAviso';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('Login');

  useEffect(() => {
    if (!loading) {
      if (user && currentScreen === 'Login') {
        setCurrentScreen('Home');
      } else if (!user && currentScreen !== 'Login' && currentScreen !== 'CadastroAluno' && currentScreen !== 'CadastroProfessor') {
        setCurrentScreen('Login');
      }
    }
  }, [user, loading, currentScreen]);

  const navigation = {
    navigate: (screen: Screen) => {
      setCurrentScreen(screen);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    if (currentScreen === 'CadastroAluno') {
      return <CadastroAluno navigation={navigation} />;
    }
    if (currentScreen === 'CadastroProfessor') {
      return <CadastroProfessor navigation={navigation} />;
    }
    return <Login navigation={navigation} />;
  }

  switch (currentScreen) {
    case 'CadastroAluno':
      return <CadastroAluno navigation={navigation} />;
    case 'CadastroProfessor':
      return <CadastroProfessor navigation={navigation} />;
    case 'CadastroDisciplina':
      return <CadastroDisciplina navigation={navigation} />;
    case 'Boletim':
      return <Boletim navigation={navigation} />;
    case 'Avisos':
      return <Avisos navigation={navigation} />;
    case 'CriarAviso':
      return <CriarAviso navigation={navigation} />;
    case 'Home':
    default:
      return <Home navigation={navigation} />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
