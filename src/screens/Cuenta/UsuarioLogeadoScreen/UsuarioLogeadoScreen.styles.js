import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  // Contenedor principal del ScrollView
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    flexGrow: 1,
  },

  // Card que envuelve las opciones de cuenta (coherente con otros cards)
  cardOptions: {
    width: width * 0.95,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    // sombra ligera
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 10,
    marginBottom: 6,
  },

  // Wrapper del botón de logout: lo separa visualmente y mantiene consistencia de ancho
  logoutWrapper: {
    width: width * 0.95,
    marginTop: 18,
    borderRadius: 12,
    overflow: "hidden",
    // fondo blanco sutil para que el botón destaque si quieres un footer visible
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    // sombra pequeña para separar del fondo
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  // estilos del botón (se mantiene fondo blanco y texto en color primario para look "link")
  btnContainer: {
    width: "100%",
  },
  btnStyles: {
    backgroundColor: "#fff", // fondo blanco (botón tipo fila)
    paddingVertical: 14,
    borderRadius: 0, // el container tiene el borderRadius
  },
  btnTextStyle: {
    color: "#00a680", // color primario de la app
    fontWeight: "700",
  },
});
