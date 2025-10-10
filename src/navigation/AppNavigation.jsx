import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { MapaStack } from './MapaStack';
import { DenunciaStack } from './DenunciaStack';
import { CuentaStack } from './CuentaStack';
import { screen } from '../utils/screenName';

const Tab = createBottomTabNavigator();

function tabIcon(routeName, size, color) {
  let iconName = 'circle';
  switch (routeName) {
    case screen.mapa.tab:
      iconName = 'map';
      break;
    case screen.cuenta.tab:
      iconName = 'account-circle';
      break;
    // El tab de denuncia está oculto; el ícono no se usa, pero lo dejamos por consistencia
    case screen.denuncia.tab:
      iconName = 'plus-circle-outline';
      break;
    default:
      iconName = 'circle';
  }
  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
}

// Mantiene montado DenunciaStack pero sin botón visible.
// Cuando estás dentro de DenunciaStack, oculta toda la barra.
function getDenunciaTabOptions() {
  return {
    headerShown: false,
    tabBarButton: () => null,       // oculta el botón del tab
    tabBarStyle: { display: 'none' } // oculta la barra cuando este tab está enfocado
  };
}

export function AppNavigation() {
  // Estilo global para dar “gutter” lateral y que los íconos no queden pegados a las esquinas
  const COMMON_TAB_BAR_STYLE = {
    paddingHorizontal: 42, 
    height: 70,
    paddingTop: 0,
    borderTopWidth: 0.5,
    borderTopColor: '#e5e5e5',
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#00a680',
        tabBarInactiveTintColor: '#777',
        tabBarIcon: ({ size, color }) => tabIcon(route.name, size, color),
        tabBarStyle: COMMON_TAB_BAR_STYLE,
        tabBarItemStyle: { paddingVertical: 4 }, // un poco de respiro vertical
      })}
    >
      <Tab.Screen
        name={screen.mapa.tab}
        component={MapaStack}
        options={{ title: 'Mapa' }}
      />

      {/* Tab montado pero oculto para poder navegar a Denuncia sin mostrarlo en la barra */}
      <Tab.Screen
        name={screen.denuncia.tab}
        component={DenunciaStack}
        options={getDenunciaTabOptions}
      />

      <Tab.Screen
        name={screen.cuenta.tab}
        component={CuentaStack}
        options={{ title: 'Cuenta' }}
      />
    </Tab.Navigator>
  );
}