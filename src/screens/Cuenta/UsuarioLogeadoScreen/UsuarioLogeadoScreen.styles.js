import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");
const PRIMARY = "#00a680";
const DANGER = "#e53935";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: -23,
  },

  // Contenedor principal del ScrollView
  container: {
    paddingVertical: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    flexGrow: 1,
  },

  // "Card" que envuelve las opciones de cuenta (View estilado)
  cardOptions: {
    width: width * 0.95,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#eee",
  },

  // Wrapper del botón de logout (ahora con alignItems center)
  logoutWrapper: {
    width: width * 0.95,
    marginTop: 18,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",   // <-- centra el contenido horizontalmente
    justifyContent: "center",
    paddingVertical: 8,
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

  // Botón personalizado (reemplaza RNE Button para evitar PadView)
  btnTouchable: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    width: "60%",            // ancho controlado para que quede centrado y agradable
  },
  btnTextStyle: {
    color: PRIMARY,
    fontWeight: "600",
    fontSize: 16,
  },

  /* ===== Modal de confirmación ===== */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "90%",               // ancho responsivo
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111",
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#444",
    marginBottom: 18,
    lineHeight: 20,
    textAlign: "center",
  },

  /* Acciones del modal: contenedores flex para botones iguales */
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // contenedor de cada botón para controlar espacio y flex
  modalBtnContainer: {
    flex: 1,
  },
  modalBtnContainerLeft: {
    marginRight: 8,
  },
  modalBtnContainerRight: {
    marginLeft: 8,
  },

  // estilos compartidos del botón
  modalBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  modalBtnSecondary: {
    backgroundColor: "#f1f1f1",
  },
  modalBtnSecondaryText: {
    color: "#222",
    fontWeight: "600",
  },
  modalBtnDanger: {
    backgroundColor: DANGER,
  },
  modalBtnDangerText: {
    color: "#fff",
    fontWeight: "700",
  },
});
