import { StyleSheet } from 'react-native';

const colors = {
  textPrimary: '#212121',
  textSecondary: '#757575', // Añadido para el nuevo texto
  border: '#eee',
  background: '#f9f9f9', // Añadido para el fondo del contenedor
};

export const styles = StyleSheet.create({
  // --- Contenedores Principales ---
  container: {
    flex: 1, 
  },
  scrollContentContainer: {
    paddingVertical: 4, // Respetando tu archivo
    paddingBottom: 40, 
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

  // --- NUEVO: Estilos para el mensaje de "Iniciar Sesión" ---
  loginRequiredContainer: {
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  loginRequiredIcon: {
     color: colors.textSecondary, // Color para el ícono
  },
  loginRequiredText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
  },
});