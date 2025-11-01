import { StyleSheet } from 'react-native';

const colors = {
  primary: '#00a680',
  white: '#FFFFFF',
  textPrimary: '#212121',
  textSecondary: '#757575',
  background: '#f9f9f9',
  lightGray: '#E0E0E0',
  border: '#eee',
  red: '#F44336',
  green: '#4CAF50',
  yellow: '#FFD700',
  disabled: '#BDBDBD',
};

export const styles = StyleSheet.create({
  // --- Contenedores Principales ---
  container: {
    flex: 1, 
  },
  scrollContentContainer: {
    paddingVertical: 16,
    paddingBottom: 40, 
  },
  loadingContainer: {
    height: 300, 
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Títulos y Separadores ---
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
    paddingHorizontal: 4, 
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24, 
    marginHorizontal: 4,
  },
  
  // --- Estilos del Historial (Item) ---
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2, 
  },
  textContainer: {
    flex: 1,
  },
  comentario: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  fecha: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },

  // --- NUEVO: Paginador de Historial ---
  historialPaginatorContainer: {
    marginBottom: 12, // Espacio antes del separador
  },
  paginatorControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: -4, // Acerca los controles al item
  },
  paginatorButton: {
    padding: 8, // Área de toque más grande
  },
  paginatorButtonDisabled: {
    // No se necesita estilo extra, el color del icono ya lo maneja
  },
  paginatorText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  
  // --- Estilos de Feedback (Sin cambios) ---
  actionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  feedbackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    marginHorizontal: 4,
  },
  feedbackButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  feedbackButtonText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
    color: colors.textPrimary,
  },
  feedbackButtonTextActive: {
    color: colors.white,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 6,
  },
  suscripcionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  suscripcionTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  suscripcionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  suscripcionSubText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});