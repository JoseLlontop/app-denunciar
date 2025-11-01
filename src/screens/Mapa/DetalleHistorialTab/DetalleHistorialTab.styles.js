import { StyleSheet } from 'react-native';

const colors = {
  textPrimary: '#212121',
  border: '#eee',
};

export const styles = StyleSheet.create({
  // --- Contenedores Principales ---
  container: {
    flex: 1, 
  },
  scrollContentContainer: {
    paddingVertical: 6,
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
});