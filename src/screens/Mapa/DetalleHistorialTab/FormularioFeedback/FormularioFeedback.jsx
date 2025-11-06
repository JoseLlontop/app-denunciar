import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Icon } from 'react-native-elements';
import Toast from 'react-native-toast-message';

import { styles } from './FormularioFeedback.styles'; 
import { apiFetch } from '../../../../lib/apiClient';
import { API_BASE_URL } from '@env';

// --- COMPONENTE INTERNO: StarRating ---
const StarRating = ({ rating, setRating }) => (
  <View style={styles.starContainer}>
    {[1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity key={star} onPress={() => setRating(prev => (prev === star ? 0 : star))}>
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
);

export function FormularioFeedback({ reclamoId, estado }) {
  // --- ESTADOS ---
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [miFeedback, setMiFeedback] = useState(null); 
  const [existe, setExiste] = useState(null); 
  const [calidad, setCalidad] = useState(0); 
  const [suscripcion, setSuscripcion] = useState(false); 

  // --- EFECTOS ---
  useEffect(() => {
    // Cargar el feedback existente
    const fetchMiFeedback = async () => {
      if (!reclamoId) return;
      
      setLoading(true);
      try {
        const misFeedbacks = await apiFetch(`${API_BASE_URL}/feedbacks/mis-feedbacks`); 
        const feedbackActual = misFeedbacks.find(fb => fb.reclamo_id === reclamoId); 

        if (feedbackActual) {
          setMiFeedback(feedbackActual); 
          setExiste(feedbackActual.existe); 
          // Solo setear calidad si el estado es resuelto, sino, mantener en 0
          setCalidad(estado === 'resuelto' ? (feedbackActual.calidad_solucion || 0) : 0); 
          setSuscripcion(feedbackActual.suscripcion || false); 
        } else {
          setMiFeedback(null); 
          setExiste(null); 
          setCalidad(0); 
          setSuscripcion(false); 
        }

      } catch (error) {
        console.error("Error al cargar mi feedback:", error); 
      } finally {
        setLoading(false); 
      }
    };

    fetchMiFeedback();
  }, [reclamoId, estado]); // Agregamos 'estado' a las dependencias

  // --- MANEJADORES ---
  const handleSaveFeedback = useCallback(async () => {

    setSubmitting(true); 
    
    const body = {
      reclamo_id: reclamoId,
      existe: existe,
      // Si el estado no es resuelto, forzamos calidad a 0 en el envío
      calidad_solucion: estado === 'resuelto' ? calidad : 0,
      suscripcion: suscripcion,
    }; 

    try {
      let feedbackGuardado;
      if (miFeedback) {
        feedbackGuardado = await apiFetch(
          `${API_BASE_URL}/feedbacks/${miFeedback.id}`, 
          { method: 'PUT', body }
        ); 
        Toast.show({ type: 'success', text1: 'Feedback actualizado' }); 
      } else {
        feedbackGuardado = await apiFetch(
          `${API_BASE_URL}/feedbacks/`, 
          { method: 'POST', body }
        ); 
        Toast.show({ type: 'success', text1: 'Feedback enviado' }); 
      }
      setMiFeedback(feedbackGuardado); 
    } catch (error) {
      console.error("Error al guardar feedback:", error); 
      Toast.show({
        type: 'error',
        text1: 'Error al guardar',
        text2: error.message || 'Inténtalo de nuevo más tarde.',
      }); 
    } finally {
      setSubmitting(false); 
    }
  }, [reclamoId, miFeedback, existe, calidad, suscripcion, estado]); // Agregamos 'estado'

  // --- RENDER ---
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00a680" />
      </View>
    ); 
  }

  return (
    <View>
      {/* Botones Existe / No Existe */}
      <Text style={styles.actionLabel}>¿El problema reportado existe?</Text> 
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={[styles.feedbackButton, existe === true && styles.feedbackButtonActive]}
          onPress={() => setExiste(prev => (prev === true ? null : true))}
        >
          <Icon name="check" type="material-community" color={existe === true ? '#fff' : '#4CAF50'} size={20} />
          <Text style={[styles.feedbackButtonText, existe === true && styles.feedbackButtonTextActive]}>
            Sí, existe
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.feedbackButton, existe === false && styles.feedbackButtonActive]}
          onPress={() => setExiste(prev => (prev === false ? null : false))}
        >
          <Icon name="close" type="material-community" color={existe === false ? '#fff' : '#F44336'} size={20} />
          <Text style={[styles.feedbackButtonText, existe === false && styles.feedbackButtonTextActive]}>
            No existe
          </Text>
        </TouchableOpacity>
      </View> 

      {/* Rating de Calidad (Condicional) */}
      {estado === 'resuelto' ? (
        <>
          <Text style={styles.actionLabel}>Califica la calidad de la solución (1-5)</Text> 
          <StarRating rating={calidad} setRating={setCalidad} /> 
        </>
      ) : (
        <View style={styles.infoBox}>
          <Icon 
            type="material-community" 
            name="lock-outline" 
            color={styles.infoText.color} 
            size={22} 
          />
          <Text style={styles.infoText}>
            Podrás calificar la calidad de la solución cuando el reclamo esté resuelto.
          </Text>
        </View>
      )}


      {/* Botón de Suscripción */}
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
    </View>
  );
}