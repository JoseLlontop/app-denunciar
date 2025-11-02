import { StyleSheet } from 'react-native';

const colors = {
  textPrimary: '#212121',
  textSecondary: '#757575',
  background: '#f9f9f9',
  border: '#eee',
};

export const styles = StyleSheet.create({
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
    marginTop: 10,
    marginBottom: 32,
    fontStyle: 'italic',
  },

  // --- Paginador de Historial ---
  historialPaginatorContainer: {
    marginBottom: 15,
  },
  paginatorControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: -12, 
  },
  paginatorButton: {
    padding: 8, 
  },
  paginatorButtonDisabled: {
    // No se necesita
  },
  paginatorText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});