import { StyleSheet, Dimensions, Platform } from 'react-native';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Contenedor principal seguro que respeta el notch
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  // Estilos del ScrollView
  container: {
    padding: 0,            // Espacio interno general
    alignItems: 'center',   // Centrar hijos horizontalmente
    backgroundColor: '#f2f2f2',
  },
  // Wrapper para el botón de submit
  submitWrapper: {
    width: width * 0.9,     // 90% del ancho de pantalla
    marginVertical: 20,     // Separación superior e inferior
    borderRadius: 8,        // Bordes redondeados
    overflow: 'hidden',     // Para que el ripple no se salga
  },
  // Estilo del botón de submit
  submitButton: {
    backgroundColor: '#00a680', // Color primario de la app
    paddingVertical: 14,         // Altura del botón
    borderRadius: 8,             // Bordes redondeados
    marginBottom: 14,              // Separación superior
  },
});
