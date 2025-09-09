import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  content: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
    color: "#222",
    fontWeight: "700",
  },

  // wrapper del Input (margen inferior y ancho completo dentro del modal)
  inputWrapper: {
    width: "100%",
    marginBottom: 6,
  },

  // contenedor interno del Input: fondo, padding y radio
  inputContainer: {
    backgroundColor: "#f5f6fa",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "android" ? 6 : 8,
    borderBottomWidth: 0,
  },

  // estilo del texto dentro del input
  input: {
    fontSize: 15,
    color: "#222",
  },

  // estilo del mensaje de error
  error: {
    color: "#d9534f",
    fontSize: 12,
    marginLeft: 6,
  },

  // botón: ancho total, padding y radio
  btnContainer: {
    width: "100%",
    marginTop: 12,
    borderRadius: 10,
    overflow: "hidden",
  },
  btn: {
    backgroundColor: "#00a680",
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnTitle: {
    fontWeight: "700",
    fontSize: 15,
  },
});
