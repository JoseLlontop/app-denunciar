import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  viewImage: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 18,
  },
  scrollContent: {
    alignItems: "center",
    paddingRight: 8,
  },

  /* Botón 'Agregar' */
  addWrapper: {
    alignItems: "center",
    marginRight: 12,
  },
  addCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#00a680",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
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
    marginRight: 12,
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
  },

  /* Icono de eliminar sobre la miniatura */
  deleteIconContainer: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
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
