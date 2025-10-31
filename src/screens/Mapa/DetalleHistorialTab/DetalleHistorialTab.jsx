import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { styles } from './DetalleHistorialTab.styles';

// Componente para un solo item del historial
const HistorialItem = ({ item }) => {
  const fecha = new Date(item.fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.itemContainer}>
      <View style={styles.iconContainer}>
        <Icon 
          type="material-community" 
          name="comment-processing-outline" 
          size={24} 
          color="#00a680" 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.comentario}>{item.comentario}</Text>
        <Text style={styles.fecha}>Registrado: {fecha} hs</Text>
      </View>
    </View>
  );
};

// Componente principal del Tab
export function DetalleHistorialTab({ historiales }) {
  if (!historiales || historiales.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Aún no hay historial de cambios.</Text>
      </View>
    );
  }

  // Ordenamos del más nuevo al más viejo
  const historialesOrdenados = [...historiales].sort((a, b) => 
    new Date(b.fecha) - new Date(a.fecha)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Historial de Cambios</Text>
      {historialesOrdenados.map((item) => (
        <HistorialItem key={item.id} item={item} />
      ))}
    </View>
  );
}