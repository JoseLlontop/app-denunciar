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
  loadingContainer: {
    height: 300, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // --- Estilos de Feedback ---
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
    marginBottom: 20,
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
    marginTop: 0,
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