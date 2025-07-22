import { initializeApp } from "firebase/app";
import { getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb-7TaQKOLyK499gMV6Rip1YyEObubu4U",
  authDomain: "app-denunciar-municipalidad.firebaseapp.com",
  projectId: "app-denunciar-municipalidad",
  storageBucket: "app-denunciar-municipalidad.firebasestorage.app",
  messagingSenderId: "755994254656",
  appId: "1:755994254656:web:f93beaa7d7c2ea4d3b6ea5"
};

// Initialize Firebase
//export const initFirebase = initializeApp(firebaseConfig);

// Inicializa la app de Firebase (solo una vez)
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Configura Firebase Auth con persistencia nativa
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Exporta lo necesario
export { app, auth };