import React, { useEffect } from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-toast-message";
import { AppNavigation } from "./src/navigation/AppNavigation";
import { AuthProvider } from "./src/context/AuthContext";
import 'react-native-get-random-values';

// Importa SÓLO el módulo V1 por defecto
import appCheck from '@react-native-firebase/app-check';
// Mantenemos la importación de Core para la verificación (opcional aquí)
import { getApps } from '@react-native-firebase/app';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['This method is deprecated']); // Ignoramos el warning V1

export default function App() {

  useEffect(() => {
    const initializeAppCheckBasic = async () => {
      try {
        // Verificación simple de Core
        if (getApps().length > 0) {
          console.log('[Firebase Core] Listo.');
        } else {
          console.warn('[Firebase Core] No listo.');
          // Podría ser un problema si falla aquí
        }

        // Intento directo de usar el módulo V1
        console.log('[App Check] Intentando obtener instancia V1...');
        const appCheckInstance = appCheck(); // <-- ¿Falla aquí con ReferenceError?

        console.log('[App Check] Instancia V1 obtenida. Llamando a activate...');
        await appCheckInstance.activate('playIntegrity'); // <-- ¿Falla aquí?

        console.log('[App Check] ¡Activado con éxito (V1)!');

      } catch (error) {
         // Si falla aquí, es casi seguro un problema de enlace nativo
         console.error('[App Check] Error durante inicialización BÁSICA (V1):', error);
         if (error instanceof ReferenceError && error.message.includes("appCheck")) {
            console.error('--> Sugerencia: El módulo @r-n-firebase/app-check no parece estar enlazado nativamente. Asegúrate de que la instalación fue correcta y reconstruye.');
         } else {
            console.error('--> Sugerencia: Revisa logs nativos (Logcat).');
         }
      }
    };

    initializeAppCheckBasic();
  }, []);

  return (
    <RootSiblingParent>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
        <Toast topOffset={Platform.OS === "ios" ? 60 : 40} />
      </AuthProvider>
    </RootSiblingParent>
  );
}