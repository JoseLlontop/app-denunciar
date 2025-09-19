import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");
const PRIMARY = "#00a680";
const DANGER = "#e53935";

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

  // "Card" que envuelve las opciones de cuenta (View estilado)
  cardOptions: {
    width: width * 0.95,
    backgroundColor: "#fff",      // ← para emular Card
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

  // Wrapper del botón de logout
  logoutWrapper: {
    width: width * 0.95,
    marginTop: 18,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
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
    backgroundColor: "#fff",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTextStyle: {
    color: PRIMARY,
    fontWeight: "700",
    fontSize: 16,
  },

  /* ===== Modal de confirmación ===== */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111",
  },
  modalMessage: {
    fontSize: 14,
    color: "#444",
    marginBottom: 16,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10, // RN 0.71+ soporta gap; si usás una versión anterior, avisame y lo cambio por márgenes
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
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
