import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  // Contenedor general del formulario dentro del modal
  content: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },

  // Título (opcional) para orientar al usuario
  title: {
    marginBottom: 10,
    textAlign: "center",
    color: "#222",
    fontWeight: "700",
  },

  // Wrapper de cada Input: ancho completo dentro del modal
  inputWrapper: {
    width: "100%",
    marginBottom: 10,
  },

  // Estilo del contenedor interno del Input (fondo + padding + radio)
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

  // Estilo del mensaje de error (pequeño y claro)
  error: {
    color: "#d9534f",
    fontSize: 12,
    marginLeft: 6,
  },

  // Contenedor del botón: ancho completo, borde redondeado y overflow para ripple correcto
  btnContainer: {
    width: "100%",
    marginTop: 12,
    borderRadius: 10,
    overflow: "hidden",
  },

  // Botón principal con color primario y padding vertical
  btn: {
    backgroundColor: "#00a680",
    paddingVertical: 12,
    borderRadius: 10,
  },
});
