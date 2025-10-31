import React, { useState } from 'react'; 
import { 
  View, Text, ScrollView, Image, Dimensions, 
  TouchableOpacity, Modal as RNModal, SafeAreaView 
} from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';

import { getEstado } from '../../../lib/mapeoEstados';
import { getIncidentes } from '../../../lib/mapeoIncidentes';
import { styles } from './DetalleReclamoModal.styles';

const screenWidth = Dimensions.get('window').width;
const imageWidth = (screenWidth - 44) * 0.85; 
const imageHeight = imageWidth * 0.75; 

// InfoRow (Sin cambios)
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

// ImageViewerModal 
const ImageViewerModal = ({ visible, imageUrl, onClose }) => (
  <RNModal 
    visible={visible} 
    transparent={true} 
    onRequestClose={onClose} 
    animationType="fade"
  >
    <SafeAreaView style={styles.lightboxModal}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="close" type="material-community" size={36} color="#fff" />
      </TouchableOpacity>
      <View style={styles.lightboxContainer}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.lightboxImage} 
          resizeMode="contain" 
        />
      </View>
    </SafeAreaView>
  </RNModal>
);

// ImagenesReclamo 
const ImagenesReclamo = ({ imagenes, onImagePress }) => {
  if (!imagenes || imagenes.length === 0) {
    return null;
  }
  return (
    <View style={styles.imageSectionContainer}>
      <Text style={styles.imageSectionTitle}>Imágenes Registradas</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.imageScrollView}
        nestedScrollEnabled={true} 
      >
        {imagenes.map((img) => (
          <TouchableOpacity 
            key={img.id} 
            style={styles.imageContainer}
            onPress={() => onImagePress(img)}
            activeOpacity={0.8}
          >
            <Image 
              source={{ uri: img.url }} 
              style={[styles.image, { width: imageWidth, height: imageHeight }]} 
              resizeMode="cover" 
            />
          </TouchableOpacity>
        ))}
        <View style={{ width: 20 }} /> 
      </ScrollView>
    </View>
  );
};

export function DetalleReclamoModal({ isVisible, reclamo, onClose }) {
  
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  const handleCloseViewer = () => {
    setImagenSeleccionada(null);
  };

  return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}
        onSwipeComplete={onClose}
        swipeDirection="down"
        style={styles.modal}
        propagateSwipe={true}
      >
        <View style={styles.modalContent}>
          <View style={styles.handleBar} />
          
          {reclamo && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>{reclamo.titulo}</Text>
              
              <ImagenesReclamo 
                imagenes={reclamo.imagenes}
                onImagePress={setImagenSeleccionada}
              />
              
              <Text style={styles.description}>{reclamo.descripcion}</Text>
              
              {/* Bloque de InfoRows */}
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
              {/* --- Se eliminó el InfoRow de 'Ubicación' --- */}
              <InfoRow
                iconName="star-outline"
                label="Calificación Promedio"
                value={Number(reclamo.promedio_calificacion).toFixed(1)}
              />
              <InfoRow
                iconName="shield-check-outline"
                label="Confiabilidad"
                value={`${Number(reclamo.confiabilidad_calculada).toFixed(0)} %`}
              />

            </ScrollView>
          )}

          <ImageViewerModal
            visible={!!imagenSeleccionada}
            imageUrl={imagenSeleccionada?.url}
            onClose={handleCloseViewer}
          />
        </View>
      </Modal>
  );
}

