import axios from "axios";

// No Expo, localhost não funciona. USE O IP DA MÁQUINA
const getBaseURL = () => {
  if (__DEV__) {
    return "http://localhost:3333";
  }
  return "http://localhost:3333";
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = api.defaults.headers.common['Authorization'];
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error('Erro de conexão: Verifique se o servidor está rodando e se o IP está correto');
    }
    return Promise.reject(error);
  }
);