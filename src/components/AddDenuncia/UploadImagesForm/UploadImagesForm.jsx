import React, { useState, memo } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Modal, 
} from "react-native";
import { Icon, Avatar } from "react-native-elements"; 
import * as ImagePicker from "expo-image-picker";
import { map, filter } from "lodash";
import { ImageSourceModal } from "./ImageSourceModal";
import { styles } from "./UploadImagesForm.styles";

export const UploadImagesForm = memo((props) => {
  const { formik } = props;
  const [showImageSource, setShowImageSource] = useState(false);
  
  // Estado del diálogo actualizado
  const [dialog, setDialog] = useState({
    isVisible: false,
    title: "",
    message: "",
    confirmText: "Aceptar",
    onConfirm: () => closeDialog(),
    cancelText: 'Cancelar',
    onCancel: () => closeDialog(),
    showCancel: false,
    type: "info", 
  });

  const closeDialog = () => setDialog((prev) => ({ ...prev, isVisible: false }));

  const selectImageSource = () => {
    setShowImageSource(true);
  };
  const closeImageSource = () => {
    setShowImageSource(false);
  };

  // --- LÓGICA DE PERMISOS (Actualizada con 'type') ---
  const handlePermission = async (type) => {
    const isCamera = type === "camera";
    const request = isCamera
      ? ImagePicker.requestCameraPermissionsAsync
      : ImagePicker.requestMediaLibraryPermissionsAsync;
    const permissionName = isCamera ? "cámara" : "galería";

    const { status } = await request();
    if (status !== "granted") {
      setDialog({
        isVisible: true,
        title: "Permisos requeridos",
        message: `Necesitas conceder permisos de ${permissionName} para usar esta función.`,
        confirmText: "Entendido",
        onConfirm: closeDialog,
        showCancel: false,
        onCancel: closeDialog,
        type: "info", 
      });
      return false;
    }
    return true;
  };

  // --- LÓGICA DE CÁMARA ---
  const openCamera = async () => {
    const hasPermission = await handlePermission("camera");
    if (!hasPermission) return;

    closeImageSource(); // Close the modal after selection
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      //aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets ? result.assets[0].uri : result.uri;
      formik.setFieldValue("images", [...formik.values.images, uri]);
    }
  };

  // --- LÓGICA DE GALERÍA ---
  const openGallery = async () => {
    const hasPermission = await handlePermission("gallery");
    if (!hasPermission) return;

    closeImageSource(); // Close the modal after selection
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      //aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets ? result.assets[0].uri : result.uri;
      formik.setFieldValue("images", [...formik.values.images, uri]);
    }
  };

  // --- LÓGICA DE BORRADO ---
  const confirmRemoveImage = (img) => {
    setDialog({
      isVisible: true,
      title: "Eliminar imagen",
      message: "¿Estás seguro de eliminar esta imagen?",
      confirmText: "Eliminar",
      showCancel: true,
      onCancel: closeDialog,
      onConfirm: () => {
        const result = filter(formik.values.images, (image) => image !== img);
        formik.setFieldValue("images", result);
        closeDialog();
      },
      type: "danger", 
    });
  };

  return (
    <>
      <ScrollView style={styles.viewImage} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {/* Botón agregar */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.addWrapper}
            onPress={selectImageSource}
          >
            <View style={styles.addButton}>
              <Icon
                type="material-community"
                name="camera-plus"
                size={28}
                color="#00a680"
              />
            </View>
            <Text style={styles.addLabel}>Agregar</Text>
          </TouchableOpacity>

          {/* Miniaturas */}
          {map(formik.values.images, (image) => (
            <View key={image} style={styles.imageWrapper}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => confirmRemoveImage(image)}
              >
                <Avatar
                  source={{ uri: image }}
                  size="medium" // Consistent size
                  containerStyle={styles.imageStyle} // Use style from styles.js
                />
                <Icon
                  name="close-circle"
                  type="material-community"
                  containerStyle={styles.deleteIconContainer} // Use style from styles.js
                  color="#ff4d4f" // Standard delete color
                  size={20}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Error de validación */}
      {formik.errors.images ? (
        <Text style={styles.error}>{formik.errors.images}</Text>
      ) : null}

      {/* Modal de selección de imagen */}
      <ImageSourceModal
        isVisible={showImageSource}
        onClose={closeImageSource}
        onOpenCamera={openCamera}
        onOpenGallery={openGallery}
      />

      {/* --- NUEVO MODAL --- */}
      <Modal
        visible={dialog.isVisible}
        transparent
        animationType="fade"
        onRequestClose={dialog.onCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{dialog.title}</Text>
            
            {/* Usamos ScrollView por si el mensaje es largo, como en tu Dialog */}
            <ScrollView style={{ maxHeight: 150, marginBottom: 4 }}>
              <Text style={styles.modalMessage}>{dialog.message}</Text>
            </ScrollView>

            <View style={styles.modalActions}>
              {/* Botón Cancelar (condicional) */}
              {dialog.showCancel && (
                <TouchableOpacity
                  onPress={dialog.onCancel}
                  style={styles.modalBtnContainer}
                  activeOpacity={0.85}
                >
                  <View style={[styles.modalBtn, styles.modalBtnSecondary]}>
                    <Text style={styles.modalBtnSecondaryText}>
                      {dialog.cancelText}Cancelar
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Botón Confirmar (con estilo dinámico) */}
              <TouchableOpacity
                onPress={dialog.onConfirm}
                style={styles.modalBtnContainer}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.modalBtn,
                    dialog.type === "danger"
                      ? styles.modalBtnDanger  // Estilo rojo
                      : styles.modalBtnPrimary, // Estilo azul/verde
                  ]}
                >
                  <Text
                    style={
                      dialog.type === "danger"
                        ? styles.modalBtnDangerText
                        : styles.modalBtnPrimaryText
                    }
                  >
                    {dialog.confirmText}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
});