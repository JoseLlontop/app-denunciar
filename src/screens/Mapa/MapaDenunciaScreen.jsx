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

// Componentes y utilidades importadas
import { getEstado } from "../../lib/mapeoEstados";
import { getIncidentes } from "../../lib/mapeoIncidentes";
import { DetalleReclamoModal } from './DetalleReclamoModal/DetalleReclamoModal';

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

  // Estados de filtro (sin cambios)
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [isInitialFilterSet, setIsInitialFilterSet] = useState(false);
  
  // Estado de tracking (sin cambios)
  const [isTrackingChanges, setIsTrackingChanges] = useState(true);

  // fetchReclamos y useFocusEffect (sin cambios)
  const fetchReclamos = useCallback(async () => {
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

  // Lógica de filtrado y efectos (sin cambios)
  const reclamosFiltrados = useMemo(() => {
    let reclamosTemp = reclamos;

    if (filtroEstado !== 'todos') {
      reclamosTemp = reclamosTemp.filter(reclamo => reclamo.estado === filtroEstado);
    }
    if (filtroCategoria !== 'todos') {
      reclamosTemp = reclamosTemp.filter(reclamo => reclamo.categoria === filtroCategoria);
    }

    return reclamosTemp;
  }, [reclamos, filtroEstado, filtroCategoria]); 

  useEffect(() => {
    if (isTrackingChanges) {
      const timer = setTimeout(() => {
        setIsTrackingChanges(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isTrackingChanges]);

  useEffect(() => {
    if (reclamos.length > 0 && !isInitialFilterSet) {
      setIsTrackingChanges(true); 
      setFiltroEstado('resuelto');
      setIsInitialFilterSet(true);
    }
  }, [reclamos, isInitialFilterSet]);


  // handleMarkerPress (sin cambios en su lógica)
  const handleMarkerPress = async (reclamoId) => {
    setModalVisible(true);
    setIsDetailLoading(true);
    setSelectedReclamo(null); // Limpia el reclamo anterior
    try {
      const { data } = await api.get(`/reclamos/${reclamoId}`);
      setSelectedReclamo(data);
    } catch (error) {
      console.error("Error al obtener detalle del reclamo:", error);
      setModalVisible(false); // Cierra si hay error
    } finally {
      setIsDetailLoading(false);
    }
  };

  // closeModal (AHORA TAMBIÉN LIMPIA EL ESTADO)
  const closeModal = () => {
    setModalVisible(false);
    // Limpiamos el estado al cerrar para que no se vea
    // la data anterior la próxima vez que se abra.
    setSelectedReclamo(null); 
  };

  const showFab = !authLoading && !!user;

  return (
      <View style={styles.container}>
        {/* UI de Filtros (sin cambios) */}
        <View style={styles.filterContainer}>
          {/* FILTRO 1: ESTADOS */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollView}>
            {ESTADOS_FILTRO.map((filtro) => {
              const isActive = filtro.dbValue === filtroEstado;
              return (
                <TouchableOpacity
                  key={filtro.dbValue}
                  style={[ styles.filterButton, isActive && styles.filterButtonActive ]}
                  onPress={() => {
                    setIsTrackingChanges(true); 
                    setFiltroEstado(filtro.dbValue);
                  }}
                >
                  <Text style={[ styles.filterButtonText, isActive && styles.filterButtonTextActive ]}>
                    {filtro.legible}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          
          {/* FILTRO 2: CATEGORÍAS  */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollView}>
            {CATEGORIAS_FILTRO.map((filtro) => {
              const isActive = filtro.dbValue === filtroCategoria;
              return (
                <TouchableOpacity
                  key={filtro.dbValue}
                  style={[ styles.filterButton, isActive && styles.filterButtonActive ]}
                  onPress={() => {
                    setIsTrackingChanges(true); 
                    setFiltroCategoria(filtro.dbValue);
                  }}
                >
                  <Text style={[ styles.filterButtonText, isActive && styles.filterButtonTextActive ]}>
                    {filtro.legible}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* MapView y Marcadores */}
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
          mapPadding={{ top: Platform.OS === 'ios' ? 170 : 140, right: 0, bottom: 0, left: 0 }}
        >
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

      {/* FAB */}
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

      {/* Usamos el nuevo componente */}
      <DetalleReclamoModal 
        isVisible={isModalVisible}
        reclamo={selectedReclamo}
        onClose={closeModal}
      />

      {/* Los LoadingModal siguen aquí, ya que son parte de la UI de esta pantalla */}
      <LoadingModal show={loading && !isModalVisible} text="Actualizando denuncias..." />
      
      {/* Este LoadingModal se encarga de la carga *del detalle* */}
      <LoadingModal show={isDetailLoading} text="Cargando detalles..." />
    </View>
  );
}