import { createNativeStackNavigator } from "@react-navigation/native-stack";
/* Importamos primero la pagina principal de la seccion */
import { CuentaScreen } from "../screens/Cuenta/CuentaScreen";
/* Importamos el resto de las paginas implicitas de la seccion */
import { LoginScreen } from "../screens/Cuenta/LoginScreen/LoginScreen";
import { RegisterScreen } from "../screens/Cuenta/RegisterScreen/RegisterScreen";
import { screen } from "../utils";

const Stack = createNativeStackNavigator();

export function CuentaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        /* El name de la Screen debe ser unico por uso uso el atributo cuenta y no tab ya que esta utilizado */
        name={screen.cuenta.cuenta}
        component={CuentaScreen}
        options={{ title: "Cuenta",
        headerTitleAlign: "center"
        }}
      />
      <Stack.Screen
        name={screen.cuenta.login}
        component={LoginScreen}
        options={{ title: "Iniciar sesión",
        headerTitleAlign: "center"
        }}
      />
      <Stack.Screen
        name={screen.cuenta.register}
        component={RegisterScreen}
        options={{ title: "Crea tu cuenta",
        headerTitleAlign: "center"
        }}
      />
    </Stack.Navigator>
  );
}