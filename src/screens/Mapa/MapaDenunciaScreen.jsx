import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
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
import { getEstado } from "../../lib/mapeoEstados";
import { getIncidentes } from "../../lib/mapeoIncidentes";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Definición de opciones de filtro
const ESTADOS_FILTRO = [
  { dbValue: 'todos', legible: 'Todos' },
  { dbValue: 'pendiente', legible: getEstado('pendiente') },
  { dbValue: 'en_progreso', legible: getEstado('en_progreso') },
  { dbValue: 'resuelto', legible: getEstado('resuelto') },
];

const CATEGORIAS_FILTRO = [
  { dbValue: 'todos', legible: 'Todas' },
  { dbValue: 'alumbrado', legible: getIncidentes('alumbrado') },
  { dbValue: 'baches', legible: getIncidentes('baches') },
  { dbValue: 'residuos', legible: getIncidentes('residuos') },
]

export function MapaDenunciaScreen() {
  const navigation = useNavigation();
  const { user, isLoading: authLoading } = useAuth();
  const [reclamos, setReclamos] = useState([]);
  const [selectedReclamo, setSelectedReclamo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // NUEVO: Estado para el filtro de categoría
  const [filtroCategoria, setFiltroCategoria] = useState('todos');

  // 1. Inicia el filtro en 'todos' para la carga inicial
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // 2. Flag para controlar el seteo del filtro por defecto
  const [isInitialFilterSet, setIsInitialFilterSet] = useState(false);
  
  // Estado para controlar el redibujado de marcadores (soluciona parpadeo)
  const [isTrackingChanges, setIsTrackingChanges] = useState(true);

  const fetchReclamos = useCallback(async () => {
    // 1. Activa el tracking antes de cargar datos
    setIsTrackingChanges(true); 
    setLoading(true);
    try {
      const { data } = await api.get('/reclamos/');
      setReclamos(data);
    } catch (error) {
      console.error("Error al obtener los reclamos:", error);
      setReclamos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReclamos();
      return () => {};
    }, [fetchReclamos])
  );

  // Lógica de filtrado con useMemo (AHORA COMBINADA)
  const reclamosFiltrados = useMemo(() => {
    let reclamosTemp = reclamos;

    // 1. Aplicar filtro de estado
    if (filtroEstado !== 'todos') {
      reclamosTemp = reclamosTemp.filter(reclamo => reclamo.estado === filtroEstado);
    }

    // 2. Aplicar filtro de categoría sobre el resultado anterior
    if (filtroCategoria !== 'todos') {
      reclamosTemp = reclamosTemp.filter(reclamo => reclamo.categoria === filtroCategoria);
    }

    return reclamosTemp;
  }, [reclamos, filtroEstado, filtroCategoria]); 

  // 2. Efecto para desactivar el tracking después de un redibujado
  useEffect(() => {
    if (isTrackingChanges) {
      // Damos un tiempo para que el mapa renderice los cambios
      const timer = setTimeout(() => {
        setIsTrackingChanges(false);
      }, 500); // 500ms es un valor seguro

      return () => clearTimeout(timer);
    }
  }, [isTrackingChanges]); // Se ejecuta cada vez que isTrackingChanges se pone en 'true'

  // 3. useEffect para aplicar el filtro por defecto ('resuelto') después de la carga
  useEffect(() => {
    // Si hay reclamos cargados y aún no hemos seteado el filtro inicial...
    if (reclamos.length > 0 && !isInitialFilterSet) {
      
      // Activa el tracking para el cambio de filtro
      setIsTrackingChanges(true); 
      
      // Aplica el filtro 'resuelto'
      setFiltroEstado('resuelto');
      
      // Marca que el filtro inicial ya fue aplicado
      setIsInitialFilterSet(true);
    }
  }, [reclamos, isInitialFilterSet]); // Depende de 'reclamos' y del flag


  const handleMarkerPress = async (reclamoId) => {
    setModalVisible(true);
    setIsDetailLoading(true);
    setSelectedReclamo(null);
    try {
      const { data } = await api.get(`/reclamos/${reclamoId}`);
      setSelectedReclamo(data);
    } catch (error) {
      console.error("Error al obtener detalle del reclamo:", error);
      setModalVisible(false);
    } finally {
      setIsDetailLoading(false);
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
        {/* 4. MODIFICADO: UI DEL FILTRO (AÑADIDA SEGUNDA BARRA) */}
        <View style={styles.filterContainer}>
          {/* FILTRO 1: ESTADOS */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollView}>
            {ESTADOS_FILTRO.map((filtro) => {
              const isActive = filtro.dbValue === filtroEstado;
              return (
                <TouchableOpacity
                  key={filtro.dbValue}
                  style={[
                    styles.filterButton,
                    isActive && styles.filterButtonActive,
                  ]}
                  onPress={() => {
                    setIsTrackingChanges(true); 
                    setFiltroEstado(filtro.dbValue);
                  }}
                >
                  <Text style={[
                    styles.filterButtonText,
                    isActive && styles.filterButtonTextActive,
                  ]}>
                    {filtro.legible}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          
          {/* FILTRO 2: CATEGORÍAS  */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollView}>
            {CATEGORIAS_FILTRO.map((filtro) => {
              const isActive = filtro.dbValue === filtroCategoria; // <- Usa estado de categoría
              return (
                <TouchableOpacity
                  key={filtro.dbValue}
                  style={[
                    styles.filterButton,
                    isActive && styles.filterButtonActive,
                  ]}
                  onPress={() => {
                    setIsTrackingChanges(true); 
                    setFiltroCategoria(filtro.dbValue); // <- Usa set de categoría
                  }}
                >
                  <Text style={[
                    styles.filterButtonText,
                    isActive && styles.filterButtonTextActive,
                  ]}>
                    {filtro.legible}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

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
          // 5. MODIFICADO: mapPadding aumentado para dar espacio a la nueva barra de filtros
          mapPadding={{ top: Platform.OS === 'ios' ? 170 : 140, right: 0, bottom: 0, left: 0 }}
        >
          {/* MAPA USA AHORA los reclamos FILTRADOS */}
          {reclamosFiltrados.map((reclamo) => (
            <Marker
              key={reclamo.id}
              coordinate={{
                latitude: Number(reclamo.latitud),
                longitude: Number(reclamo.longitud),
              }}
              title={reclamo.titulo}
              onPress={() => handleMarkerPress(reclamo.id)}
              tracksViewChanges={isTrackingChanges} 
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
          {selectedReclamo && (
            <>
              <Text style={styles.title}>{selectedReclamo.titulo}</Text>
              <Text style={styles.description}>{selectedReclamo.descripcion}</Text>
              <InfoRow
                iconName="format-list-bulleted"
                label="Categoría"
                value={getIncidentes(selectedReclamo.categoria)}
              />
              <InfoRow
                iconName="progress-check"
                label="Estado"
                value={getEstado(selectedReclamo.estado)}
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

      <LoadingModal show={loading && !isModalVisible} text="Actualizando denuncias..." />
      <LoadingModal show={isDetailLoading} text="Cargando detalles..." />
    </View>
  );
}