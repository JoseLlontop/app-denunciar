import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  // Contenedor principal del formulario (dentro del modal)
  content: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },

  // Título del formulario
  title: {
    marginBottom: 10,
    textAlign: "center",
    color: "#222",
    fontWeight: "700",
  },

  // Wrapper de cada input para tomar el 100% del ancho disponible
  inputWrapper: {
    width: "100%",
    marginBottom: 10,
  },

  // Contenedor interno del input: fondo suave, padding y radio
  inputContainer: {
    backgroundColor: "#f5f6fa",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "android" ? 6 : 8,
    borderBottomWidth: 0,
  },

  // Texto dentro del input
  input: {
    fontSize: 15,
    color: "#222",
  },

  // Mensaje de error pequeño y legible
  error: {
    color: "#d9534f",
    fontSize: 12,
    marginLeft: 6,
  },

  // Contenedor del botón para que ocupe todo el ancho disponible
  btnContainer: {
    width: "100%",
    marginTop: 12,
    borderRadius: 10,
    overflow: "hidden", // para que el ripple no se salga del borde
  },

  // Botón principal con color primario y padding
  btn: {
    backgroundColor: "#00a680",
    paddingVertical: 12,
    borderRadius: 10,
  },

  // Título del botón
  btnTitle: {
    fontWeight: "700",
    fontSize: 15,
  },
});
