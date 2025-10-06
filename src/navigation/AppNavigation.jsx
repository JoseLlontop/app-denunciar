import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MapaStack } from "./MapaStack"; 
import { DenunciaStack } from "./DenunciaStack";
import { BuscarStack } from "./BuscarStack";
import { CuentaStack } from "./CuentaStack";
import { screen } from "../utils";

const Tab = createBottomTabNavigator();

export function AppNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#00a680", /* Color cuando me encuentro en esa seccion*/
        tabBarInactiveTintColor: "#646464", /* Color cuando no me encuentro en esa seccion */
        tabBarIcon: ({ color, size }) => screenOptions(route, color, size),
      })}
    >
      {/* Con options indico el nombre de la seccion que se va a mostrar por pantalla */}
      <Tab.Screen name={screen.mapa.tab} component={MapaStack} options={{title: "Mapa"}} />
      <Tab.Screen name={screen.denuncia.tab} component={DenunciaStack} options={{title: "Denuncia"}} />
      {/* <Tab.Screen name={screen.buscar.tab} component={BuscarStack} options={{title: "Buscar"}} /> */}
      <Tab.Screen name={screen.cuenta.tab} component={CuentaStack} options={{title: "Cuenta"}} />
    </Tab.Navigator>
  );
}

function screenOptions(route, color, size) {
  let iconName;
  switch (route.name) {
    case screen.mapa.tab:
      iconName = "map";
      break;
    case screen.denuncia.tab:
      iconName = "plus-circle-outline";
      break;
   /* case screen.buscar.tab:
      iconName = "magnify";
      break;  */
    case screen.cuenta.tab:
      iconName = "account-circle";
      break;
    default:
      iconName = "circle";
  }
  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
}
