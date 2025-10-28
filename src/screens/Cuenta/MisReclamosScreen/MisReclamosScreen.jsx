import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  StyleSheet, // Import StyleSheet para los estilos dinámicos del texto del badge
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons"; 
import { styles } from "./MisReclamosScreen.styles";

import { apiFetch } from "../../../lib/apiClient";
import { API_BASE_URL } from "@env";
import { LoadingModal } from "../../../components/Shared/LoadingModal/LoadingModal";
import { getEstado } from '../../../lib/mapeoEstados'; 
import { getIncidentes } from "../../../lib/mapeoIncidentes";

// --- Helpers ---

function extractStatus(error) {
  if (!error?.message) return null;
  const m = error.message.match(/HTTP\s+(\d{3})/i);
  return m ? Number(m[1]) : null;
}

const formatFecha = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return "-";
  }
};

// --- Componente de Item (memoizado para performance) ---

const ReclamoItem = React.memo(({ item, requestDelete }) => {
  const categoriaAccentStyle = (categoria) => {
    switch (categoria) {
      case "alumbrado": return styles.accentAlumbrado;
      case "baches": return styles.accentBaches;
      case "residuos": return styles.accentResiduos;
      default: return styles.accentOtro;
    }
  };

  const estadoBadgeStyle = (estado) => {
    switch (estado) {
      case "pendiente": return { container: [styles.badge, styles.badgePendiente], text: styles.badgeTextPendiente };
      case "en_proceso": return { container: [styles.badge, styles.badgeProceso], text: styles.badgeTextProceso };
      case "resuelto": return { container: [styles.badge, styles.badgeResuelto], text: styles.badgeTextResuelto };
      default: return { container: [styles.badge, styles.badgeDefault], text: styles.badgeTextDefault };
    }
  };

  const categoriaTagStyle = (categoria) => {
    switch (categoria) {
      case "alumbrado": return [styles.tag, styles.tagAlumbrado];
      case "baches": return [styles.tag, styles.tagBaches];
      case "residuos": return [styles.tag, styles.tagResiduos];
      default: return [styles.tag, styles.tagOtro];
    }
  };

  const categoriaIcono = (categoria) => {
    switch (categoria) {
      case "alumbrado": return "bulb-outline";
      case "baches": return "car-sport-outline";
      case "residuos": return "trash-bin-outline";
      default: return "help-circle-outline";
    }
  };

  const estadoStyle = estadoBadgeStyle(item?.estado);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.card, categoriaAccentStyle(item?.categoria)]}
      accessibilityRole="button"
      accessibilityLabel={`Reclamo ${item?.titulo || ""}`}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item?.titulo || "Sin título"}</Text>
        <View style={styles.cardRight}>
          <View style={estadoStyle.container}>
            {/* Funcion para mapear el nombre de los estaods */}
            <Text style={[styles.badgeText, estadoStyle.text]}>
              {getEstado(item?.estado)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => requestDelete(item)}
            style={styles.deleteBtn}
            accessibilityRole="button"
            accessibilityLabel="Eliminar Reclamo"
          >
            <Icon name="trash-outline" size={20} color={styles.deleteBtnText.color} />
          </TouchableOpacity>
        </View>
      </View>

      {item?.descripcion ? (
        <Text style={styles.cardDesc} numberOfLines={3}>{item.descripcion}</Text>
      ) : null}

      <View style={styles.cardFooter}>
        <View style={categoriaTagStyle(item?.categoria)}>
          <Icon name={categoriaIcono(item?.categoria)} size={14} style={styles.tagIcon} />
          <Text style={styles.tagText}>{getIncidentes(item?.categoria) || "Otro"}</Text>
        </View>
        <Text style={styles.cardDate}>
          {item?.fecha_creacion ? `${formatFecha(item.fecha_creacion)}` : "—"}
        </Text>
      </View>
    </TouchableOpacity>
  );
});


// --- Componente Principal ---

export function MisReclamosScreen() {
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const data = await apiFetch(`${API_BASE_URL}/reclamos/mis-reclamos`);
      setReclamos(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Error al cargar tus reclamos. Deslizá para refrescar.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
  }, [loadData]);

  const requestDelete = useCallback((item) => {
    setToDelete({ id: item?.id, titulo: item?.titulo });
    setConfirmVisible(true);
  }, []);

  const handleDelete = async () => {
    if (!toDelete?.id) return;
    try {
      await apiFetch(`${API_BASE_URL}/reclamos/${toDelete.id}`, { method: "DELETE" });
      setReclamos((prev) => prev.filter((r) => r.id !== toDelete.id));
      Toast.show({ type: "success", position: "bottom", text1: "Reclamo Eliminado!" });
    } catch (e) {
      const code = extractStatus(e);
      let msg =
        code === 403
          ? "No tenés permiso para borrar este reclamo."
          : code === 404
          ? "El reclamo no existe."
          : "No se pudo eliminar el reclamo.";
      Toast.show({ type: "error", position: "bottom", text1: "Error", text2: msg });
    } finally {
      setConfirmVisible(false);
      setToDelete(null);
    }
  };

  if (loading) {
    return <LoadingModal show text="Cargando tus reclamos..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={loadData}>
              <Text style={styles.btnPrimaryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={reclamos}
          keyExtractor={(it) => String(it?.id)}
          renderItem={({ item }) => <ReclamoItem item={item} requestDelete={requestDelete} />}
          contentContainerStyle={
            reclamos.length === 0 ? styles.listEmptyContainer : styles.listContainer
          }
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Text style={styles.emptyTitle}>No tenés reclamos aún</Text>
              <Text style={styles.emptyText}>Cuando crees un reclamo, va a aparecer listado acá.</Text>
              <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={loadData}>
                <Text style={styles.btnOutlineText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[styles.btnPrimary.backgroundColor]} tintColor={styles.btnPrimary.backgroundColor} />
          }
        />
      </View>

      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Eliminar Reclamo</Text>
            <Text style={styles.modalMessage}>
              ¿Seguro que querés eliminar{" "}
              <Text style={styles.modalMessageStrong}>“{toDelete?.titulo || "este reclamo"}”</Text>
              ? Esta acción no se puede deshacer.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setConfirmVisible(false)}
                style={[styles.modalBtnContainer, styles.modalBtnContainerLeft]}
                activeOpacity={0.85}
              >
                <View style={[styles.modalBtn, styles.modalBtnSecondary]}>
                  <Text style={styles.modalBtnSecondaryText}>Cancelar</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={[styles.modalBtnContainer, styles.modalBtnContainerRight]}
                activeOpacity={0.85}
              >
                <View style={[styles.modalBtn, styles.modalBtnDanger]}>
                  <Text style={styles.modalBtnDangerText}>Eliminar</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default MisReclamosScreen;