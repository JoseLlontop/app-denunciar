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
    marginBottom: 10,
    marginTop: 8,
  },

  // --- NUEVO ---
  // Contenedor para el ícono que reemplaza al avatar
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 24, // Círculo
    backgroundColor: "#f2f4f3", // Fondo suave
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18, // Espacio antes del texto
  },
  
  // --- ESTILOS DE AVATAR ELIMINADOS ---
  // avatarContainer y avatarImage fueron removidos

  // Contenedor de textos (nombre + email)
  textContainer: {
    flex: 1,
    justifyContent: "center",
    // marginLeft: 6 (removido, ahora el iconContainer maneja el espacio)
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
    marginBottom: 4, // Añadido para separar del nuevo texto
  },

  // --- NUEVO ---
  // Estilo base para el texto de verificación
  verificationText: {
    fontSize: 13,
    fontWeight: "600",
  },
  // Variante para email verificado
  verified: {
    color: "#00a680", // Verde (mismo de tu app)
  },
  // Variante para email no verificado
  unverified: {
    color: "#f57c00", // Naranja
  },
});