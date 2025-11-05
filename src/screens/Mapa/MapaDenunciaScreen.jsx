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
];

// --- LÓGICA DE COLOR ACTUALIZADA ---

/**
 * Convierte un color hexadecimal a formato RGBA.
 * @param {string} hex - El color en formato hexadecimal (ej. "#eab308")
 * @param {number} [alpha=1] - El valor de opacidad (de 0 a 1)
 * @returns {string} El color en formato "rgba(r, g, b, a)"
 */
const hexToRgba = (hex, alpha = 1) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return 'rgba(0, 0, 0, 0.2)'; // Fallback
  }
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Paleta de colores para categorías específicas
const CATEGORY_COLORS = {
  alumbrado: '#eab308',
  baches: '#0ea5e9',
  residuos: '#1f2937',
  default: '#1f2937', // Color por defecto para "el resto"
};

/**
 * Devuelve los colores (sólido y transparente) para una categoría.
 * @param {string} categoria - El valor 'dbValue' de la categoría (ej. "alumbrado")
 * @returns {{solid: string, transparent: string}} Un objeto con ambos colores.
 */
const getCategoryColor = (categoria) => {
  const solidColor = CATEGORY_COLORS[categoria] || CATEGORY_COLORS.default;
  return {
    solid: solidColor,
    transparent: hexToRgba(solidColor, 0.2) // Opacidad del 20% para el resplandor
  };
};
// --- FIN LÓGICA DE COLOR ---


export function MapaDenunciaScreen() {
  const navigation = useNavigation();
  const { user, isLoading: authLoading } = useAuth();
  const [reclamos, setReclamos] = useState([]);
  const [selectedReclamo, setSelectedReclamo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Estados de filtro 
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [isInitialFilterSet, setIsInitialFilterSet] = useState(false);
  
  // Estado de tracking 
  const [isTrackingChanges, setIsTrackingChanges] = useState(true);

  // fetchReclamos y useFocusEffect 
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

  // Lógica de filtrado y efectos 
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


  // handleMarkerPress y closeModal 
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
    setSelectedReclamo(null); 
  };

  const showFab = !authLoading && !!user;

  return (
      <View style={styles.container}>
        {/* UI de Filtros */}
        <View style={styles.filterContainer}>
          {/* FILTRO 1: ESTADOS  */}
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
          
          {/* FILTRO 2: CATEGORÍAS (ACTUALIZADO CON COLOR SÓLIDO) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollView}>
            {CATEGORIAS_FILTRO.map((filtro) => {
              const isActive = filtro.dbValue === filtroCategoria;
              
              let dynamicActiveStyle = {};
              
              if (isActive && filtro.dbValue !== 'todos') {
                // Obtenemos el objeto de colores
                const activeColors = getCategoryColor(filtro.dbValue);
                dynamicActiveStyle = { 
                  // Usamos el color sólido para el botón
                  backgroundColor: activeColors.solid, 
                  borderColor: activeColors.solid 
                };
              }

              return (
                <TouchableOpacity
                  key={filtro.dbValue}
                  style={[ 
                    styles.filterButton, 
                    isActive && styles.filterButtonActive, 
                    dynamicActiveStyle 
                  ]}
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

        {/* MapView y Marcadores (ACTUALIZADO CON AMBOS COLORES) */}
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
          {reclamosFiltrados.map((reclamo) => {
            
            // --- INICIO LÓGICA DE COLOR DINÁMICO ---
            // Obtenemos ambos colores
            const markerColors = getCategoryColor(reclamo.categoria);
            // --- FIN LÓGICA DE COLOR DINÁMICO ---

            return (
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
              {/* Aplicamos el color transparente al 'resplandor' (container) */}
              <View style={[styles.markerContainer, { backgroundColor: markerColors.transparent }]}>
                
                {/* Aplicamos el color sólido al 'core' del marcador */}
                <View style={[styles.markerCore, { backgroundColor: markerColors.solid }]}>
                  <Icon type="material-community" name="alert-circle" size={16} color="#fff" />
                </View>
              </View>
            </Marker>
            );
          })}
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

      {/* Modales  */}
      <DetalleReclamoModal 
        isVisible={isModalVisible}
        reclamo={selectedReclamo}
        onClose={closeModal}
      />
      <LoadingModal show={loading && !isModalVisible} text="Actualizando denuncias..." />
    </View>
  );
}