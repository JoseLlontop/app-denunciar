import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // Card contenedor para destacar la sección de usuario
  card: {
    width: width * 0.95,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    flexDirection: "row",
    // Sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    // Sombra Android
    elevation: 4,
    alignSelf: "center",
    marginVertical: 10,
  },

  // Contenedor del avatar para dar borde y sombra
  avatarContainer: {
    marginRight: 20,
    // fondo suave para que la silueta sea visible cuando NO hay imagen
    backgroundColor: "#f2f4f3",
    // borde blanco para separación respecto al card
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 999, // circulo perfecto
    // sombra extra para resaltar avatar
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  // estilo de la imagen interna del avatar (por si se necesita ajustar)
  avatarImage: {
    resizeMode: "cover",
  },

  // Contenedor de textos (nombre + email)
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },

  // Nombre del usuario con mayor peso visual
  displayName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 2,
  },

  // Email en color secundario y tamaño reducido
  email: {
    fontSize: 15,
    color: "#6b6b6b",
  },
});
