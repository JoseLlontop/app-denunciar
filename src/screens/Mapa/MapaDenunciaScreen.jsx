import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { screen } from '../../utils/screenName';
import { styles, customMapStyle } from './MapaDenunciaScreen.styles';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LoadingModal } from '../../components/Shared/LoadingModal';
import { API_BASE_URL } from '@env';
import axios from 'axios';
import Modal from 'react-native-modal';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export function MapaDenunciaScreen() {
  const navigation = useNavigation();
  const { user, isLoading: authLoading } = useAuth();
  const [reclamos, setReclamos] = useState([]);
  const [selectedReclamo, setSelectedReclamo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [trackChanges, setTrackChanges] = useState(true);

  // --- 1. NUEVO ESTADO PARA CONTROLAR LA CARGA DEL DETALLE ---
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const fetchReclamos = useCallback(async () => {
    setTrackChanges(true);
    setLoading(true);
    try {
      const { data } = await api.get('/reclamos/');
      setReclamos(data);
    } catch (error) {
      console.error("Error al obtener los reclamos:", error);
      setReclamos([]);
    } finally {
      setLoading(false);
      setTimeout(() => setTrackChanges(false), 500);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReclamos();
      return () => {};
    }, [fetchReclamos])
  );

  // --- 2. MODIFICAMOS LA FUNCIÓN PARA USAR EL NUEVO ESTADO DE CARGA ---
  const handleMarkerPress = async (reclamoId) => {
    setModalVisible(true);       // Abrimos el modal vacío inmediatamente
    setIsDetailLoading(true);    // Activamos el loader de pantalla completa
    setSelectedReclamo(null);      // Nos aseguramos de que no haya datos previos
    try {
      const { data } = await api.get(`/reclamos/${reclamoId}`);
      setSelectedReclamo(data);      // Cuando llegan los datos, se renderizan en el modal
    } catch (error) {
      console.error("Error al obtener detalle del reclamo:", error);
      setModalVisible(false);      // Si hay un error, cerramos el modal
    } finally {
      setIsDetailLoading(false);   // Desactivamos el loader de pantalla completa
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const showFab = !authLoading && !!user;

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

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={customMapStyle}
        initialRegion={{
          latitude: -34.9213,
          longitude: -57.9545,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {reclamos.map((reclamo) => (
          <Marker
            key={reclamo.id}
            coordinate={{
              latitude: Number(reclamo.latitud),
              longitude: Number(reclamo.longitud),
            }}
            title={reclamo.titulo}
            onPress={() => handleMarkerPress(reclamo.id)}
            tracksViewChanges={trackChanges}
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerCore}>
                 <Icon type="material-community" name="alert-circle" size={16} color="#fff" />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {showFab && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate(screen.denuncia.tab, {
              screen: screen.denuncia.denuncia,
            })
          }
          accessibilityRole="button"
          accessibilityLabel="Agregar denuncia"
        >
          <Icon type="material-community" name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        onSwipeComplete={closeModal}
        swipeDirection="down"
        style={styles.modal}
        onModalWillHide={() => setSelectedReclamo(null)}
      >
        <View style={styles.modalContent}>
          <View style={styles.handleBar} />
          {/* --- 3. ELIMINAMOS EL LOADER INTERNO --- */}
          {/* Ahora solo mostramos el contenido cuando `selectedReclamo` tiene datos */}
          {selectedReclamo && (
            <>
              <Text style={styles.title}>{selectedReclamo.titulo}</Text>
              <Text style={styles.description}>{selectedReclamo.descripcion}</Text>
              <InfoRow
                iconName="format-list-bulleted"
                label="Categoría"
                value={selectedReclamo.categoria}
              />
              <InfoRow
                iconName="progress-check"
                label="Estado"
                value={selectedReclamo.estado}
              />
              <InfoRow
                iconName="calendar-range"
                label="Fecha de Creación"
                value={new Date(selectedReclamo.fecha_creacion).toLocaleDateString()}
              />
            </>
          )}
        </View>
      </Modal>

      {/* Loader para la carga inicial de denuncias */}
      <LoadingModal show={loading && !isModalVisible} text="Actualizando denuncias..." />

      {/* --- 4. NUEVO LOADER PARA EL DETALLE, UBICADO EN LA CAPA PRINCIPAL --- */}
      <LoadingModal show={isDetailLoading} text="Cargando detalles..." />
    </View>
  );
}