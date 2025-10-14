import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { screen } from '../../utils/screenName';
import { styles } from './MapaDenunciaScreen.styles';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LoadingModal } from '../../components/Shared/LoadingModal';
import { API_BASE_URL } from '@env';
import axios from 'axios';
import Modal from 'react-native-modal'; // <-- 1. Importar desde la nueva librería

const api = axios.create({
  baseURL: API_BASE_URL,
});

export function MapaDenunciaScreen() {
  const navigation = useNavigation();
  const { user, isLoading: authLoading } = useAuth();
  const [reclamos, setReclamos] = useState([]);
  const [selectedReclamo, setSelectedReclamo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false); // <-- 2. Nuevo estado para controlar la visibilidad

  useEffect(() => {
    const fetchReclamos = async () => {
      try {
        const { data } = await api.get('/reclamos/');
        setReclamos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReclamos();
  }, []);

  const handleMarkerPress = async (reclamoId) => {
    try {
      const { data } = await api.get(`/reclamos/${reclamoId}`);
      setSelectedReclamo(data);
      setModalVisible(true); // <-- 3. Mostrar el modal
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setModalVisible(false); // <-- Función para cerrar el modal
  };

  const showFab = !authLoading && !!user;

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
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
              latitude: reclamo.latitud,
              longitude: reclamo.longitud,
            }}
            title={reclamo.titulo}
            onPress={() => handleMarkerPress(reclamo.id)}
          />
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

      {/* 4. Reemplazar BottomSheet con Modal */}
      {selectedReclamo && (
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={closeModal} // Cierra al tocar fuera
          onSwipeComplete={closeModal} // Cierra al deslizar hacia abajo
          swipeDirection="down"
          style={styles.modal} // Estilo para posicionarlo abajo
        >
          <View style={styles.modalContent}>
            <View style={styles.handleBar} />
            <Text style={styles.title}>{selectedReclamo.titulo}</Text>
            <Text style={styles.description}>{selectedReclamo.descripcion}</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Categoría:</Text>
              <Text style={styles.value}>{selectedReclamo.categoria}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Estado:</Text>
              <Text style={styles.value}>{selectedReclamo.estado}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Fecha:</Text>
              <Text style={styles.value}>
                {new Date(selectedReclamo.fecha_creacion).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Modal>
      )}

      <LoadingModal show={loading} text="Cargando" />
    </View>
  );
}