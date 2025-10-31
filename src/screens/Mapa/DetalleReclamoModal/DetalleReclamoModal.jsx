import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';

// Ajustamos las rutas de importación (un nivel más arriba)
import { getEstado } from '../../../lib/mapeoEstados';
import { getIncidentes } from '../../../lib/mapeoIncidentes';
import { styles } from './DetalleReclamoModal.styles';

// Definimos InfoRow aquí adentro, ya que solo lo usa este modal
const InfoRow = ({ iconName, iconType, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconContainer}>
      <Icon type={iconType || 'material-community'} name={iconName} size={22} color="#00a680" />
    </View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

export function DetalleReclamoModal({ isVisible, reclamo, onClose }) {

console.log("DetalleReclamoModal renderizado con reclamo:", reclamo);
  
  return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}    // Prop para cerrar al tocar fondo
        onSwipeComplete={onClose}   // Prop para cerrar al deslizar
        swipeDirection="down"
        style={styles.modal}
        // La lógica de limpiar el reclamo (onModalWillHide)
        // se manejará en el componente padre, dentro de la función `closeModal`.
      >
        <View style={styles.modalContent}>
          <View style={styles.handleBar} />
          
          {/* Mostramos el contenido solo si 'reclamo' no es null.
            El componente padre (Mapa) se encargará de mostrar un 
            LoadingModal *mientras* 'reclamo' es null (durante la carga).
            Esto replica tu lógica original.
          */}
          {reclamo && (
            <>
              <Text style={styles.title}>{reclamo.titulo}</Text>
              <Text style={styles.description}>{reclamo.descripcion}</Text>
              <InfoRow
                iconName="format-list-bulleted"
                label="Categoría"
                value={getIncidentes(reclamo.categoria)}
              />
              <InfoRow
                iconName="progress-check"
                label="Estado"
                value={getEstado(reclamo.estado)}
              />
              <InfoRow
                iconName="calendar-range"
                label="Fecha de Creación"
                value={new Date(reclamo.fecha_creacion).toLocaleDateString()}
              />
            </>
          )}
        </View>
      </Modal>
  );
}