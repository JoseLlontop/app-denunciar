import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  viewImage: {
    // Ya no es 'flexDirection: "row"'
    marginHorizontal: 16,
    marginTop: 11,
  },
  // 'scrollContent' se eliminó

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    // Centramos los items en el espacio disponible
    justifyContent: "flex-start", 
  },

  /* Botón 'Agregar' */
  addWrapper: {
    alignItems: "center",
    margin: 8, // Espaciado uniforme para el grid
    marginBottom: 4, // Mantenemos el margen inferior
  },
  // 'addCircle' se renombró y rediseñó -> 'addButton'
  addButton: {
    width: 72,
    height: 72,
    borderRadius: 10, // Para que coincida con las miniaturas
    backgroundColor: "#f0fdfa", // Un verde muy claro
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#00a680",
    borderStyle: "dashed", // Estilo más moderno para "agregar"
  },
  addLabel: {
    marginTop: 6,
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },

  /* Miniaturas */
  imageWrapper: {
    position: "relative",
    margin: 8, // Espaciado uniforme para el grid
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyle: {
    width: 72,
    height: 72,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    backgroundColor: "#f0f0f0", // Color de fondo mientras carga
  },

  /* Icono de eliminar sobre la miniatura */
  deleteIconContainer: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4, // Para que esté sobre la sombra de la imagen
  },

  /* Error */
  error: {
    marginHorizontal: 16,
    marginTop: 10,
    color: "#d9534f",
    fontSize: 12,
    paddingLeft: 6,
  },
});