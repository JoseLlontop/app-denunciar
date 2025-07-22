import { createNativeStackNavigator } from "@react-navigation/native-stack";
/* Importamos primero la pagina principal de la seccion */
import { DenunciaScreen } from "../screens/Denuncia/DenunciaScreen";
/* Importamos el resto de las paginas implicitas de la seccion */

import { screen } from "../utils";

const Stack = createNativeStackNavigator();

export function DenunciaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={screen.denuncia.denuncia}
        component={DenunciaScreen}
        options={{ title: "Registrar Denuncia",
        headerTitleAlign: "center"
        }}
      />
    </Stack.Navigator>
  );
}