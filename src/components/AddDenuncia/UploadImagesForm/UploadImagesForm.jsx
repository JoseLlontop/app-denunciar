import React, { useState, memo } from "react"; 
import { ScrollView, View, TouchableOpacity } from "react-native";
import { Icon, Avatar, Text, Dialog } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { map, filter } from "lodash";
import { ImageSourceModal } from "./ImageSourceModal";
import { styles } from "./UploadImagesForm.styles";

export const UploadImagesForm = memo((props) => {
  const { formik } = props;
  const [showImageSource, setShowImageSource] = useState(false);
  const [dialog, setDialog] = useState({
    isVisible: false,
    title: "",
    message: "",
    confirmText: "Aceptar",
    onConfirm: () => closeDialog(),
    cancelText: "Cancelar",
    onCancel: () => closeDialog(),
    showCancel: false,
  });

  const closeDialog = () => setDialog((prev) => ({ ...prev, isVisible: false }));

  const selectImageSource = () => {
    setShowImageSource(true);
  };
  const closeImageSource = () => {
    setShowImageSource(false);
  };

  // --- LÓGICA DE PERMISOS ---
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
      });
      return false;
    }
    return true;
  };

  // --- LÓGICA DE CÁMARA ---
  const openCamera = async () => {
    const hasPermission = await handlePermission("camera");
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      // Simplemente guardamos la URI local en Formik.
      const uri = result.assets ? result.assets[0].uri : result.uri; // Para compatibilidad
      formik.setFieldValue("images", [...formik.values.images, uri]);
    }
  };

  // --- LÓGICA DE GALERÍA  ---
  const openGallery = async () => {
    const hasPermission = await handlePermission("gallery");
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      // --- LÓGICA MODIFICADA ---
      // Simplemente guardamos la URI local en Formik.
      const uri = result.assets ? result.assets[0].uri : result.uri; // Para compatibilidad
      formik.setFieldValue("images", [...formik.values.images, uri]);
    }
  };

  // --- LÓGICA DE BORRADO ---
  // Esta lógica ya era correcta, solo filtra el array.
  // Ahora filtrará el array de URIs locales, lo cual es perfecto.
  const confirmRemoveImage = (img) => {
    setDialog({
      isVisible: true,
      title: "Eliminar imagen",
      message: "¿Estás segur@ de eliminar esta imagen?",
      confirmText: "Eliminar",
      showCancel: true,
      onCancel: closeDialog,
      onConfirm: () => {
        const result = filter(
          formik.values.images,
          (image) => image !== img
        );
        formik.setFieldValue("images", result);
        closeDialog();
      },
    });
  };

  // --- renderDialogActions ---
  const renderDialogActions = () => {
    const actions = [];
    if (dialog.showCancel) {
      actions.push(
        <Dialog.Button
          key="dialog-action-cancel"
          title={dialog.cancelText}
          onPress={dialog.onCancel}
        />
      );
    }
    actions.push(
      <Dialog.Button
        key="dialog-action-confirm"
        title={dialog.confirmText}
        onPress={dialog.onConfirm}
      />
    );
    return actions;
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
          {/* El componente Avatar puede renderizar URIs locales "file://" sin problema */}
          {map(formik.values.images, (image) => (
            <View 
              key={image} 
              style={styles.imageWrapper}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => confirmRemoveImage(image)}
              >
                <Avatar
                  source={{ uri: image }}
                  size="medium"
                  containerStyle={styles.imageStyle}
                />
                <Icon
                  name="close-circle"
                  type="material-community"
                  containerStyle={styles.deleteIconContainer}
                  color="#ff4d4f"
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

      {/* Dialog */}
      {/* Sigue siendo útil para los permisos y la confirmación de borrado */}
      <Dialog isVisible={dialog.isVisible} onBackdropPress={dialog.onCancel}>
        <Dialog.Title title={dialog.title} />
        <Text>{dialog.message}</Text>
        <Dialog.Actions>
          {renderDialogActions()}
        </Dialog.Actions>
      </Dialog>
    </>
  );
});