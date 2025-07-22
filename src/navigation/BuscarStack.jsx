import { createNativeStackNavigator } from "@react-navigation/native-stack";
/* Importamos primero la pagina principal de la seccion */
import { BuscarScreen } from "../screens/Buscar/BuscarScreen";
/* Importamos el resto de las paginas implicitas de la seccion */

import { screen } from "../utils";

const Stack = createNativeStackNavigator();

export function BuscarStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={screen.buscar.buscar}
        component={BuscarScreen}
        options={{ title: "Buscar Denuncia",
        headerTitleAlign: "center"
        }}
      />
    </Stack.Navigator>
  );
}