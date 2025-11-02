import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements'; // Importamos Icon

// Importamos los estilos del contenedor
import { styles } from './DetalleHistorialTab.styles'; 

// Importamos los nuevos componentes
import { HistorialPaginator } from './HistorialPaginator/HistorialPaginator';
import { FormularioFeedback } from './FormularioFeedback/FormularioFeedback';

// Importamos el hook de autenticación
import { useAuth } from '../../../context/AuthContext'; // Ajusta esta ruta si es necesario

export function DetalleHistorialTab({ reclamo }) {
  // Extraemos los datos que cada componente necesita
  const { historiales, id: reclamoId } = reclamo; 

  // Obtenemos el usuario del contexto de autenticación
  const { user } = useAuth();

  return (
    // El ScrollView principal se mantiene
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* --- 1. SECCIÓN HISTORIAL --- */}
      <Text style={styles.sectionTitle}>Historial de Cambios</Text>
      <HistorialPaginator historiales={historiales} />


      {/* --- 2. SECCIÓN ACCIONES / FEEDBACK (CONDICIONAL) --- */}
      
      {/* Separador */}
      <Text style={styles.sectionTitle}>Tu Opinión</Text>

      {/* Mostramos el formulario si el usuario está logueado,
        o un mensaje de invitación si no lo está.
      */}
      {user ? (
        // El usuario ESTÁ logueado
        <FormularioFeedback reclamoId={reclamoId} />
      ) : (
        // El usuario NO ESTÁ logueado
        <View style={styles.loginRequiredContainer}>
          <Icon 
            type="material-community" 
            name="login-variant" 
            size={32} 
            color={styles.loginRequiredIcon.color} // Usamos el color del estilo
          />
          <Text style={styles.loginRequiredText}>
            Inicia sesión para votar si el reclamo existe, calificar la solución y recibir notificaciones.
          </Text>
        </View>
      )}
      
    </ScrollView>
  );
}