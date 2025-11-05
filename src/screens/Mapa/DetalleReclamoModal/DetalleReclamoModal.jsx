import React, { useState, useEffect, useCallback, useRef } from 'react'; // Importamos useRef
import { 
  View, Text, ScrollView, Image, Dimensions, 
  TouchableOpacity, Modal as RNModal, SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';

import { getEstado } from '../../../lib/mapeoEstados';
import { getIncidentes } from '../../../lib/mapeoIncidentes';
import { styles } from './DetalleReclamoModal.styles';

import { DetalleHistorialTab } from '../DetalleHistorialTab/DetalleHistorialTab';

// Importamos los helpers de API 
import { apiFetch } from '../../../lib/apiClient'; 
import { API_BASE_URL } from '@env';

const screenWidth = Dimensions.get('window').width;
const imageWidth = (screenWidth - 44) * 0.80; 
const imageHeight = imageWidth * 0.65; 

// --- Componentes Internos (InfoRow, ImageViewerModal, ImagenesReclamo, TabSelector) ---

// InfoRow 
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

// TabSelector 
const TabSelector = ({ activeTab, onSelectTab }) => (
  <View style={styles.tabContainer}>
    <TouchableOpacity
      style={[styles.tabButton, activeTab === 'detalles' && styles.tabButtonActive]}
      onPress={() => onSelectTab('detalles')}
    >
      <Text style={[styles.tabButtonText, activeTab === 'detalles' && styles.tabButtonTextActive]}>
        Detalles
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tabButton, activeTab === 'historial' && styles.tabButtonActive]}
      onPress={() => onSelectTab('historial')}
    >
      <Text style={[styles.tabButtonText, activeTab === 'historial' && styles.tabButtonTextActive]}>
        Seguimiento
      </Text>
    </TouchableOpacity>
  </View>
);


// --- Componente Principal ---

export function DetalleReclamoModal({ isVisible, reclamo, onClose }) {
  
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [activeTab, setActiveTab] = useState('detalles');
  const [reclamoData, setReclamoData] = useState(null);
  const [isLoadingDetalles, setIsLoadingDetalles] = useState(false);
  
  // --- Usamos un Ref para rastrear la pestaña ANTERIOR ---
  const prevActiveTabRef = useRef('detalles');

  // --- Efecto para setear datos iniciales ---
  // Sincroniza el estado local y resetea el ref de la pestaña
  useEffect(() => {
    if (reclamo) {
      setReclamoData(reclamo);
      // Resetea el tracker de pestaña a 'detalles'
      prevActiveTabRef.current = 'detalles'; 
    }
  }, [reclamo]); 

  // --- Función para re-fetchear los detalles  ---
  const fetchReclamoDetalle = useCallback(async () => {
    if (!reclamoData?.id) return; 

    setIsLoadingDetalles(true);
    try {
      const data = await apiFetch(`${API_BASE_URL}/reclamos/${reclamoData.id}`);
      setReclamoData(data); 
    } catch (error) {
      console.error("Error al refrescar el reclamo:", error);
    } finally {
      setIsLoadingDetalles(false);
    }
  }, [reclamoData?.id]);

  // --- Efecto para disparar el fetch al cambiar de tab ---
  useEffect(() => {
    
    // Comparamos la pestaña actual con la *anterior* (guardada en el ref)
    if (activeTab === 'detalles' && prevActiveTabRef.current === 'historial') {
      // Si estamos en 'detalles' y venimos de 'historial', refrescamos.
      fetchReclamoDetalle();
    }
    
    // Actualizamos el ref con la pestaña actual para la próxima comparación
    prevActiveTabRef.current = activeTab;

  }, [activeTab, fetchReclamoDetalle]); // Dependencias: la pestaña y la función


  const handleCloseViewer = () => {
    setImagenSeleccionada(null);
  };

  // --- handleCloseModal ---
  const handleCloseModal = () => {
    onClose();
    setTimeout(() => {
      setActiveTab('detalles'); 
      setReclamoData(null); 
      prevActiveTabRef.current = 'detalles'; // Reseteamos el ref al cerrar
    }, 300); 
  };

  return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={handleCloseModal}
        onSwipeComplete={handleCloseModal}
        swipeDirection="down"
        style={styles.modal}
        propagateSwipe={true}
      >
        <View style={styles.modalContent}>
          <View style={styles.handleBar} />
          
          {reclamoData ? ( 
            <ScrollView showsVerticalScrollIndicator={false}>
              
              <TabSelector activeTab={activeTab} onSelectTab={setActiveTab} />

              {/* VISTA 1: DETALLES */}
              {activeTab === 'detalles' && (
                <View>
                  {/* Indicador de carga sobre los detalles */}
                  {isLoadingDetalles && (
                    <View style={styles.inlineLoadingContainer}>
                      <ActivityIndicator size="small" color="#00a680" />
                      <Text style={styles.inlineLoadingText}>Actualizando...</Text>
                    </View>
                  )}

                  <Text style={styles.title}>{reclamoData.titulo}</Text>
                  
                  <ImagenesReclamo 
                    imagenes={reclamoData.imagenes}
                    onImagePress={setImagenSeleccionada}
                  />
                  
                  <Text style={styles.description}>{reclamoData.descripcion}</Text>
                  
                  <InfoRow
                    iconName="format-list-bulleted"
                    label="Categoría"
                    value={getIncidentes(reclamoData.categoria)}
                  />
                  <InfoRow
                    iconName="progress-check"
                    label="Estado"
                    value={getEstado(reclamoData.estado)}
                  />
                  <InfoRow
                    iconName="calendar-range"
                    label="Fecha de Creación"
                    value={new Date(reclamoData.fecha_creacion).toLocaleDateString()}
                  />
                  <InfoRow
                    iconName="star-outline"
                    label="Calificación Promedio"
                    value={Number(reclamoData.promedio_calificacion).toFixed(1)}
                  />
                  <InfoRow
                    iconName="shield-check-outline"
                    label="Confiabilidad"
                    value={`${Number(reclamoData.confiabilidad_calculada).toFixed(0)} %`}
                  />
                </View>
              )}

              {/* VISTA 2: SEGUIMIENTO */}
              {activeTab === 'historial' && (
                <DetalleHistorialTab reclamo={reclamoData} />
              )}

            </ScrollView>
          ) : (
             <View style={styles.inlineLoadingContainer}>
                <ActivityIndicator size="large" color="#00a680" />
             </View>
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