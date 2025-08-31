import { StyleSheet, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  overlay: {
    width: "90%",                     // ancho responsive por defecto
    maxHeight: "85%",                 // evita que ocupe más que la pantalla
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingTop: 12,                   // espacio para el header
    paddingBottom: 16,
    paddingHorizontal: 16,
    // sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    // sombra Android
    elevation: 8,
    alignSelf: "center",
  },

  // Variante para cuando quieras modal más ancho
  overlayFull: {
    width: Math.min(600, width * 0.97), // ancho máximo razonable en tablets
  },

  // Header pequeño: indicador y (opcional) botón cerrar
  header: {
    position: "absolute",
    top: 8,
    left: 0,
    right: 0,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  dragIndicator: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e6e6e6",
  },
  closeButton: {
    position: "absolute",
    right: 6,
    top: -2,
    padding: 6,
    borderRadius: 20,
  },

  // Área donde se coloca el contenido: padding para separar del header
  content: {
    paddingTop: 28,   // deja espacio debajo del header
  },
});
