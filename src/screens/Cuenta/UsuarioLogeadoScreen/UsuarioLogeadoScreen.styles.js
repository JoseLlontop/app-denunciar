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

  container: {
    paddingVertical: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    flexGrow: 1,
  },

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
    marginTop: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#eee",
  },

  /* Sección Mis Reclamos */
  reclamosWrapper: {
    width: width * 0.95,
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
    /* backgroundColor: PRIMARY, */
    borderWidth: 1,
    borderColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },

  /* Wrapper del botón de logout */
  logoutWrapper: {
    width: width * 0.95,
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
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

  /* Botón base */
  btnTouchable: {
    paddingVertical: 18,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    width: "100%",
  },
  btnTextStyle: {
    color: PRIMARY,
    fontWeight: "600",
    fontSize: 16,
  },

btnTouchable1: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    width: "100%",
  },

  /* Variantes del botón */
  btnPrimary: {
    backgroundColor: PRIMARY,
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 17,
  },

  /* ===== Modal ===== */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "90%",
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
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalBtnContainer: {
    flex: 1,
  },
  modalBtnContainerLeft: {
    marginRight: 8,
  },
  modalBtnContainerRight: {
    marginLeft: 8,
  },
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