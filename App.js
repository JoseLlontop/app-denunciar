import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-toast-message";
import { AppNavigation } from "./src/navigation/AppNavigation";
import { AuthProvider } from "./src/context/AuthContext";
import 'react-native-get-random-values';

import { LogBox } from 'react-native';

// Oculta el warning 
LogBox.ignoreLogs([
  'Each child in a list should have a unique "key" prop',
]);
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated and will be removed in a future release',
]);
LogBox.ignoreLogs([
  '[expo-image-picker] `ImagePicker.MediaTypeOptions` have been deprecated',
]);

LogBox.ignoreLogs([
  'This method is deprecated (as well as all React Native Firebase namespaced API) and will be',
]);

export default function App() {
  return (
    <RootSiblingParent>
      {/* El AuthProvider envuelve a todo para que el token/usuario esté disponible en la app */}
      <AuthProvider>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>

        {/* Montar Toast una sola vez y al final del árbol */}
        <Toast topOffset={Platform.OS === "ios" ? 60 : 40} />
      </AuthProvider>
    </RootSiblingParent>
  );
}
