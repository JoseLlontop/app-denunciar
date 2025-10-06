import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Overlay, Icon } from "react-native-elements";
import { styles } from "./Modal.styles";

export function Modal({
  show,
  close,
  children,
  showCloseButton = true,
  fullWidth = false,
}) {
  // Normaliza children en un array y asegura keys internas si faltan
  const childrenArray = React.Children.toArray(children);

  return (
    <Overlay
      isVisible={show}
      onBackdropPress={close}
      overlayStyle={[styles.overlay, fullWidth && styles.overlayFull]}
    >
      {/* Encabezado con 'drag indicator' y botón cerrar */}
      <View style={styles.header}>
        <View style={styles.dragIndicator} />
        {showCloseButton && (
          <TouchableOpacity onPress={close} style={styles.closeButton}>
            <Icon name="close" type="material-community" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Contenido scrollable */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {childrenArray}
      </ScrollView>
    </Overlay>
  );
}

export default Modal;
