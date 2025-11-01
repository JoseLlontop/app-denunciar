import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // Card contenedor para la lista de opciones
  container: {
    width: width * 0.95,
    alignSelf: "center",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginVertical: 0,
  },

  // Cada fila (list item) en layout row
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  // Caja circular donde va el icono izquierdo
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f2fbf7", // ligero verde de apoyo
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  // Caja de texto: ocupa el espacio disponible entre icon y chevron
  textBox: {
    flex: 1,
    justifyContent: "center",
  },

  // Título principal de la opción
  title: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },

  // Chevron (si necesitás ajustar margen)
  chevron: {
    marginLeft: 8,
  },
});
