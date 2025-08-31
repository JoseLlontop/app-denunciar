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
  return (
    <Overlay
      isVisible={show}
      onBackdropPress={close}
      overlayStyle={[styles.overlay, fullWidth && styles.overlayFull]}
    >
      {/* Pequeño encabezado con 'drag indicator' y botón cerrar */}
      <View style={styles.header}>
        <View style={styles.dragIndicator} />
        {showCloseButton && (
          <TouchableOpacity onPress={close} style={styles.closeButton}>
            <Icon name="close" type="material-community" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Contenido: scrollable para evitar overflow en pantallas pequeñas */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {children}
      </ScrollView>
    </Overlay>
  );
}