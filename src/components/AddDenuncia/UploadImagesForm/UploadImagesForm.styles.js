import { StyleSheet, Dimensions } from "react-native";

// Get screen width for potentially constraining dialog width
const screenWidth = Dimensions.get('window').width;

// --- Paleta de Colores (traída de tu .styles.js de ejemplo) ---
const PRIMARY = "#00a680";
const DANGER = "#e53935";
const CARD = "#ffffff";
const BORDER = "#e9eef1";
const TEXT_PRIMARY = "#0f172a";   // slate-900
const TEXT_SECONDARY = "#475569"; // slate-600

export const styles = StyleSheet.create({
  viewImage: {
    // Ya no es 'flexDirection: "row"'
    marginHorizontal: 16,
    marginTop: 11,
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "flex-start", // Start items from the left
  },

  /* Botón 'Agregar' */
  addWrapper: {
    alignItems: "center",
    marginTop: 6, // Uniform spacing for the grid
    marginBottom: 0, // Keep bottom margin
  },
  addButton: {
    width: 72,
    height: 72,
    borderRadius: 10, // Match thumbnail radius
    backgroundColor: "#f0fdfa", // Very light green
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#00a680", // Green border color
    borderStyle: "dashed", // Dashed style for "add"
  },
  addLabel: {
    marginTop: 6,
    fontSize: 12,
    color: "#333", // Dark gray text
    textAlign: "center",
  },

  /* Miniaturas */
  imageWrapper: {
    position: "relative",
    margin: 9, // Uniform spacing for the grid
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyle: {
    width: 72,
    height: 72,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e6e6e6", // Light gray border
    // Shadow properties for Android (elevation) and iOS (shadow*)
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    backgroundColor: "#f0f0f0", // Placeholder background while image loads
  },

  /* Icono de eliminar sobre la miniatura */
  deleteIconContainer: {
    position: "absolute",
    top: -2,
    right: -4,
    backgroundColor: "#fff", // White background for the icon circle
    borderRadius: 12,      // Make it a circle
    overflow: "hidden",     // Ensure icon stays within bounds if needed
    elevation: 4,          // Android shadow (above image)
    // iOS shadow for the delete icon itself
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  /* Error Text Style */
  error: {
    marginHorizontal: 16,
    marginTop: 10,
    color: "#d9534f", // Standard error color (Bootstrap's danger red)
    fontSize: 12,
    paddingLeft: 6,
  },

 /* --- ESTILOS DE MODAL (COPIADOS DE MisReclamosScreen.styles.js) --- */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: BORDER,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 16,
    color: TEXT_PRIMARY,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    marginBottom: 24,
    lineHeight: 22,
    textAlign: "center",
  },
  modalMessageStrong: {
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12, // 'gap' funciona en React Native moderno
  },
  modalBtnContainer: {
    flex: 1,
  },
  modalBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  
  // Estilo Botón Secundario (Cancelar)
  modalBtnSecondary: {
    backgroundColor: "#e2e8f0",
  },
  modalBtnSecondaryText: {
    fontWeight: "700",
  },
  
  // Estilo Botón Peligro (Eliminar)
  modalBtnDanger: {
    backgroundColor: DANGER,
  },
  modalBtnDangerText: {
    color: "#fff",
    fontWeight: "700",
  },
  
  // Estilo Botón Primario (Aceptar / Entendido)
  modalBtnPrimary: {
    backgroundColor: PRIMARY,
  },
  modalBtnPrimaryText: {
    color: "#fff",
    fontWeight: "700",
  },
  /* ------------------------------------------------------------------ */
});