import React from 'react';
import { View, Text, ScrollView } from 'react-native';

// Importamos los estilos del contenedor
import { styles } from './DetalleHistorialTab.styles'; 

// Importamos los nuevos componentes
import { HistorialPaginator } from './HistorialPaginator/HistorialPaginator';
import { FormularioFeedback } from './FormularioFeedback/FormularioFeedback';

export function DetalleHistorialTab({ reclamo }) {
  // Extraemos los datos que cada componente necesita
  const { historiales, id: reclamoId } = reclamo; 

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


      {/* --- 2. SECCIÓN ACCIONES / FEEDBACK --- */}
      <Text style={styles.sectionTitle}>Tu Feedback</Text>
      <FormularioFeedback reclamoId={reclamoId} />
      
    </ScrollView>
  );
}