import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Icon } from 'react-native-elements';
import Toast from 'react-native-toast-message';

// Importamos los estilos 
import { styles } from './DetalleHistorialTab.styles'; 

// Importamos el cliente API y la URL base
import { apiFetch } from '../../../lib/apiClient'; //
import { API_BASE_URL } from '@env'; //

// --- COMPONENTE INTERNO: HistorialItem ---
// (Sin cambios)
const HistorialItem = ({ item }) => {
  const fecha = new Date(item.fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }); //

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
}; //

// --- COMPONENTE INTERNO: StarRating ---
// (Sin cambios)
const StarRating = ({ rating, setRating }) => (
  <View style={styles.starContainer}>
    {[1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity key={star} onPress={() => setRating(star)}>
        <Icon 
          type="material-community" 
          name={star <= rating ? "star" : "star-outline"}
          size={32} 
          color={star <= rating ? "#FFD700" : "#ccc"}
          containerStyle={styles.star}
        />
      </TouchableOpacity>
    ))}
  </View>
); //

// --- COMPONENTE PRINCIPAL: DetalleHistorialTab ---
export function DetalleHistorialTab({ reclamo }) {
  // Extraemos los datos del reclamo
  const { historiales, id: reclamoId } = reclamo; //

  // --- ESTADOS ---
  const [loading, setLoading] = useState(true); //
  const [submitting, setSubmitting] = useState(false); //
  
  // Estado para guardar el feedback *existente* del usuario
  const [miFeedback, setMiFeedback] = useState(null); //
  
  // Estados para el formulario de feedback
  const [existe, setExiste] = useState(null); //
  const [calidad, setCalidad] = useState(0); //
  const [suscripcion, setSuscripcion] = useState(false); //

  // --- NUEVO ESTADO: Índice para el paginador de historial ---
  const [indiceHistorialActual, setIndiceHistorialActual] = useState(0);

  // --- EFECTOS ---
  // (Sin cambios: Cargar el feedback existente)
  useEffect(() => {
    const fetchMiFeedback = async () => {
      if (!reclamoId) return;
      
      setLoading(true);
      try {
        const misFeedbacks = await apiFetch(`${API_BASE_URL}/feedbacks/mis-feedbacks`); //
        const feedbackActual = misFeedbacks.find(fb => fb.reclamo_id === reclamoId); //

        if (feedbackActual) {
          setMiFeedback(feedbackActual); //
          setExiste(feedbackActual.existe); //
          setCalidad(feedbackActual.calidad_solucion || 0); //
          setSuscripcion(feedbackActual.suscripcion || false); //
        } else {
          setMiFeedback(null); //
          setExiste(null); //
          setCalidad(0); //
          setSuscripcion(false); //
        }

      } catch (error) {
        console.error("Error al cargar mi feedback:", error); //
      } finally {
        setLoading(false); //
      }
    };

    fetchMiFeedback();
  }, [reclamoId]); //

  // --- MANEJADORES ---
  // (Sin cambios: Guardar el feedback)
  const handleSaveFeedback = useCallback(async () => {
    
    if (existe === null) {
      Alert.alert("Falta información", "Por favor, indica si el reclamo 'Existe' o 'No Existe'."); //
      return;
    }
    if (calidad === 0) {
      Alert.alert("Falta información", "Por favor, califica la solución (de 1 a 5 estrellas)."); //
      return;
    }

    setSubmitting(true); //
    
    const body = {
      reclamo_id: reclamoId,
      existe: existe,
      calidad_solucion: calidad,
      suscripcion: suscripcion,
    }; //

    try {
      let feedbackGuardado;
      
      if (miFeedback) {
        feedbackGuardado = await apiFetch(
          `${API_BASE_URL}/feedbacks/${miFeedback.id}`, 
          { method: 'PUT', body }
        ); //
        Toast.show({ type: 'success', text1: 'Feedback actualizado' }); //
      } else {
        feedbackGuardado = await apiFetch(
          `${API_BASE_URL}/feedbacks/`, 
          { method: 'POST', body }
        ); //
        Toast.show({ type: 'success', text1: 'Feedback enviado' }); //
      }
      
      setMiFeedback(feedbackGuardado); //

    } catch (error) {
      console.error("Error al guardar feedback:", error); //
      Toast.show({
        type: 'error',
        text1: 'Error al guardar',
        text2: error.message || 'Inténtalo de nuevo más tarde.',
      }); //
    } finally {
      setSubmitting(false); //
    }

  }, [reclamoId, miFeedback, existe, calidad, suscripcion]); //

  // Ordenamos el historial (como ya estaba)
  const historialesOrdenados = [...(historiales || [])].sort((a, b) => 
    new Date(b.fecha) - new Date(a.fecha)
  ); //

  // --- NUEVOS MANEJADORES: Paginación de historial ---
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

  // --- RENDER ---
  // (Sin cambios: Spinner de carga)
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00a680" />
      </View>
    ); //
  }

  return (
    // El ScrollView principal se mantiene
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* --- 1. SECCIÓN HISTORIAL (MODIFICADA) --- */}
      <Text style={styles.sectionTitle}>Historial de Cambios</Text>
      
      {historialesOrdenados.length > 0 ? (
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
      ) : (
        // (Sin cambios: Texto si no hay historial)
        <Text style={styles.emptyText}>Aún no hay historial de cambios.</Text> //
      )}

      {/* --- 2. SECCIÓN ACCIONES / FEEDBACK (SIN CAMBIOS) --- */}
      <View style={styles.separator} /> 

      <Text style={styles.sectionTitle}>Tu Feedback</Text> 

      {/* Botones Existe / No Existe */}
      <Text style={styles.actionLabel}>¿El problema reportado existe?</Text> 
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={[styles.feedbackButton, existe === true && styles.feedbackButtonActive]}
          onPress={() => setExiste(true)}
        >
          <Icon name="check" type="material-community" color={existe === true ? '#fff' : '#4CAF50'} size={20} />
          <Text style={[styles.feedbackButtonText, existe === true && styles.feedbackButtonTextActive]}>
            Sí, existe
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.feedbackButton, existe === false && styles.feedbackButtonActive]}
          onPress={() => setExiste(false)}
        >
          <Icon name="close" type="material-community" color={existe === false ? '#fff' : '#F44336'} size={20} />
          <Text style={[styles.feedbackButtonText, existe === false && styles.feedbackButtonTextActive]}>
            No existe
          </Text>
        </TouchableOpacity>
      </View> 

      {/* Rating de Calidad */}
      <Text style={styles.actionLabel}>Califica la calidad de la solución (1-5)</Text> 
      <StarRating rating={calidad} setRating={setCalidad} /> 

      {/* Botón de Suscripción */}
      <Text style={styles.actionLabel}>Notificaciones</Text> 
      <TouchableOpacity 
        style={styles.suscripcionButton} 
        onPress={() => setSuscripcion(prev => !prev)}
        activeOpacity={0.7}
      >
        <Icon 
          type="material-community"
          name={suscripcion ? "bell" : "bell-outline"}
          color={suscripcion ? "#00a680" : "#777"}
          size={24}
        />
        <View style={styles.suscripcionTextContainer}>
          <Text style={styles.suscripcionText}>
            {suscripcion ? "Suscrito" : "Suscribirme"}
          </Text>
          <Text style={styles.suscripcionSubText}>
            Recibirás notificaciones sobre los avances de este reclamo.
          </Text>
        </View>
      </TouchableOpacity> 

      {/* Botón de Guardar */}
      <TouchableOpacity 
        style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
        onPress={handleSaveFeedback}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>
            {miFeedback ? "Actualizar Feedback" : "Enviar Feedback"}
          </Text>
        )}
      </TouchableOpacity> 
      
    </ScrollView>
  );
}