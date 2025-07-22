import { createNativeStackNavigator } from "@react-navigation/native-stack";
/* Importamos primero la pagina principal de la seccion */
import { MapaDenunciaScreen } from "../screens/Mapa/MapaDenunciaScreen";
/* Importamos el resto de las paginas implicitas de la seccion */

import { screen } from "../utils";

const Stack = createNativeStackNavigator();

export function MapaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={screen.mapa.mapa}
        component={MapaDenunciaScreen}
        options={{ title: "Mapa de Denuncias",
        headerTitleAlign: "center"
        }}
      />
    </Stack.Navigator>
  );
}