import React from "react";
import { BottomSheet, ListItem, Icon } from "react-native-elements";

/**
 * Componente BottomSheet para seleccionar el origen de la imagen (Cámara o Galería).
 * Esta versión no usa .map() y agrega keys estáticas para evitar errores.
 */
export function ImageSourceModal(props) {
  const { isVisible, onClose, onOpenCamera, onOpenGallery } = props;

  const handleCameraPress = () => {
    onClose();
    onOpenCamera();
  };

  const handleGalleryPress = () => {
    onClose();
    onOpenGallery();
  };

  return (
    <BottomSheet isVisible={isVisible} onBackdropPress={onClose}>
      {/* Opción 1: Tomar Foto (con key) */}
      <ListItem key="camera-option" onPress={handleCameraPress} bottomDivider>
        <Icon
          name="camera-outline"
          type="material-community"
          color="#666"
        />
        <ListItem.Content>
          <ListItem.Title>Tomar Foto</ListItem.Title>
        </ListItem.Content>
      </ListItem>

      {/* Opción 2: Abrir Galería (con key) */}
      <ListItem key="gallery-option" onPress={handleGalleryPress} bottomDivider>
        <Icon
          name="image-outline"
          type="material-community"
          color="#666"
        />
        <ListItem.Content>
          <ListItem.Title>Abrir Galería</ListItem.Title>
        </ListItem.Content>
      </ListItem>

      {/* Opción 3: Cancelar (con key) */}
      <ListItem
        key="cancel-option"
        containerStyle={{ backgroundColor: "#f2f2f2" }}
        onPress={onClose}
      >
        <ListItem.Content>
          <ListItem.Title
            style={{ color: "#d9534f", textAlign: "center", fontWeight: "bold" }}
          >
            Cancelar
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </BottomSheet>
  );
}