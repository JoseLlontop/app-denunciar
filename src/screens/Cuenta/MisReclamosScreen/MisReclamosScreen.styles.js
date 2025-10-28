import { StyleSheet, Dimensions, Platform } from "react-native";
const { width } = Dimensions.get("window");

// --- Paleta de Colores y Constantes de Diseño ---
const PRIMARY = "#00a680";
const DANGER = "#e53935";
const BG = "#f7f8fa";
const CARD = "#ffffff";
const BORDER = "#e9eef1";
const TEXT_PRIMARY = "#0f172a";   // slate-900
const TEXT_SECONDARY = "#475569"; // slate-600
const TEXT_MUTED = "#64748b";     // slate-500

// --- Colores para Badges (Texto) ---
const COLOR_PENDIENTE = "#b45309"; // amber-700
const COLOR_PROCESO = "#1d4ed8";   // blue-700
const COLOR_RESUELTO = "#15803d";  // green-700
const COLOR_DEFAULT = "#334155";  // slate-700

export const styles = StyleSheet.create({
  safeArea: { paddingTop: 0, flex: 1, backgroundColor: BG, },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },

  screenTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },

  // List
  listContainer: { paddingBottom: 28 },
  listEmptyContainer: { flexGrow: 1, justifyContent: "center", paddingVertical: 24 },

  // Empty State
  emptyWrapper: { alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: TEXT_PRIMARY, marginBottom: 6 },
  emptyText: { fontSize: 14, color: TEXT_SECONDARY, marginBottom: 16, textAlign: "center", lineHeight: 20 },

  // Card
  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    paddingVertical: 18,   // + Padding vertical
    paddingHorizontal: 16, // + Padding horizontal
    marginTop: 14,         // + Separación entre tarjetas
    borderWidth: 1,
    borderColor: BORDER,
    borderLeftWidth: 5,    // Borde de acento
    width: "100%",         // Usa el 100% del contenedor en vez de % de la pantalla
    alignSelf: "center",
    ...Platform.select({
      ios: { shadowColor: "#0f172a", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },

  cardHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  cardRight: { alignItems: "flex-end", gap: 10 },
  cardTitle: { flex: 1, fontSize: 18, fontWeight: "700", color: TEXT_PRIMARY, lineHeight: 24 },
  cardDesc: { fontSize: 14, color: TEXT_SECONDARY, fontWeight: "400", marginVertical: 12, lineHeight: 21 }, // Jerarquía visual
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  cardDate: { fontSize: 12, color: TEXT_MUTED },

  // Tag de Categoría
  tag: {
    flexDirection: "row", // Para alinear ícono y texto
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagText: { fontSize: 12, fontWeight: "700", textTransform: "capitalize", color: TEXT_PRIMARY },
  tagIcon: { marginRight: 6, color: TEXT_SECONDARY },

  // Badges de Estado (nuevo estilo)
  badge: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 999 },
  badgeText: { fontSize: 11, fontWeight: "800", textTransform: "capitalize", letterSpacing: 0.4 },
  badgePendiente: { backgroundColor: "#fffbeb" },
  badgeProceso: { backgroundColor: "#eff6ff" },
  badgeResuelto: { backgroundColor: "#f0fdf4" },
  badgeDefault: { backgroundColor: "#f1f5f9" },
  // Colores de texto para badges
  badgeTextPendiente: { color: COLOR_PENDIENTE },
  badgeTextProceso: { color: COLOR_PROCESO },
  badgeTextResuelto: { color: COLOR_RESUELTO },
  badgeTextDefault: { color: COLOR_DEFAULT },

  // Botones
  btn: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 18, alignItems: "center" },
  btnPrimary: { backgroundColor: PRIMARY },
  btnPrimaryText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  btnOutline: { borderWidth: 1.5, borderColor: PRIMARY, paddingVertical: 10, borderRadius: 12 },
  btnOutlineText: { color: PRIMARY, fontWeight: "700" },

  // Botón de eliminar (con ícono)
  deleteBtn: { padding: 8, borderRadius: 999, backgroundColor: "#fef2f2" },
  deleteBtnText: { color: DANGER }, // Solo para tomar el color en el componente

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(2,6,23,0.5)", alignItems: "center", justifyContent: "center", padding: 20 },
  modalCard: { width: "100%", maxWidth: 400, backgroundColor: CARD, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: BORDER },
  modalTitle: { fontSize: 19, fontWeight: "800", marginBottom: 8, color: TEXT_PRIMARY, textAlign: "center" },
  modalMessage: { fontSize: 15, color: TEXT_SECONDARY, marginBottom: 24, lineHeight: 22, textAlign: "center" },
  modalMessageStrong: { fontWeight: "700", color: TEXT_PRIMARY },
  modalActions: { flexDirection: "row", gap: 12 },
  modalBtnContainer: { flex: 1 },
  modalBtnContainerLeft: {},
  modalBtnContainerRight: {},
  modalBtn: { paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  modalBtnSecondary: { backgroundColor: "#e2e8f0" },
  modalBtnSecondaryText: { color: TEXT_PRIMARY, fontWeight: "700" },
  modalBtnDanger: { backgroundColor: DANGER },
  modalBtnDangerText: { color: "#fff", fontWeight: "700" },

  // Acentos por categoría (borde izquierdo)
  accentAlumbrado: { borderLeftColor: "#22c55e" },
  accentBaches: { borderLeftColor: "#0ea5e9" },
  accentResiduos: { borderLeftColor: "#f59e0b" },
  accentOtro: { borderLeftColor: "#94a3b8" },

  // Tags por categoría
  tagAlumbrado: { backgroundColor: "#ecfdf5", borderColor: "#bbf7d0" },
  tagBaches: { backgroundColor: "#eef2ff", borderColor: "#c7d2fe" },
  tagResiduos: { backgroundColor: "#fff7ed", borderColor: "#fed7aa" },
  tagOtro: { backgroundColor: "#f1f5f9", borderColor: "#e2e8f0" },

  // Error box
  errorBox: { backgroundColor: "#fef2f2", borderColor: "#fecaca", borderWidth: 1, padding: 14, borderRadius: 12, marginBottom: 12 },
  errorText: { color: "#b91c1c", marginBottom: 12, fontWeight: "700", fontSize: 14 },
});