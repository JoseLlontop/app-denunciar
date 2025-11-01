import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { styles } from './HistorialPaginator.styles'; // Estilos propios

// --- COMPONENTE INTERNO: HistorialItem ---
const HistorialItem = ({ item }) => {
  const fecha = new Date(item.fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
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
        <Text style={styles.fecha}>Registrado: {fecha}</Text>
      </View>
    </View>
  );
};

export function HistorialPaginator({ historiales }) {
  // Estado para el paginador
  const [indiceHistorialActual, setIndiceHistorialActual] = useState(0);

  // Ordenamos el historial (solo se calcula una vez)
  const historialesOrdenados = useMemo(() => 
    [...(historiales || [])].sort((a, b) => 
      new Date(b.fecha) - new Date(a.fecha)
    ), [historiales]);

  // --- MANEJADORES: Paginación de historial ---
  const handleNextHistorial = () => {
    if (indiceHistorialActual < historialesOrdenados.length - 1) {
      setIndiceHistorialActual(prev => prev + 1);
    }
  };

  const handlePrevHistorial = () => {
    if (indiceHistorialActual > 0) {
      setIndiceHistorialActual(prev => prev - 1);
    }
  };

  if (historialesOrdenados.length === 0) {
    return (
      <Text style={styles.emptyText}>Aún no hay historial de cambios.</Text>
    );
  }

  return (
    // Contenedor del Paginador
    <View style={styles.historialPaginatorContainer}>
      
      {/* Item de historial actual */}
      <HistorialItem item={historialesOrdenados[indiceHistorialActual]} />

      {/* Controles de paginación */}
      <View style={styles.paginatorControls}>
        <TouchableOpacity
          onPress={handlePrevHistorial}
          disabled={indiceHistorialActual === 0}
          style={[styles.paginatorButton, indiceHistorialActual === 0 && styles.paginatorButtonDisabled]}
        >
          <Icon type="material-community" name="chevron-left" color={indiceHistorialActual === 0 ? "#ccc" : "#00a680"} size={28} />
        </TouchableOpacity>

        <Text style={styles.paginatorText}>
          {`${indiceHistorialActual + 1} de ${historialesOrdenados.length}`}
        </Text>

        <TouchableOpacity
          onPress={handleNextHistorial}
          disabled={indiceHistorialActual === historialesOrdenados.length - 1}
          style={[styles.paginatorButton, indiceHistorialActual === historialesOrdenados.length - 1 && styles.paginatorButtonDisabled]}
        >
          <Icon type="material-community" name="chevron-right" color={indiceHistorialActual === historialesOrdenados.length - 1 ? "#ccc" : "#00a680"} size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
}