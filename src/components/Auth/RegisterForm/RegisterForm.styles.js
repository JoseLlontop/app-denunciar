import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    width: width * 0.85,           // Match width of other cards
    backgroundColor: '#ffffff',
    borderRadius: 12,             // Consistent border radius
    padding: 16,                  // Menos padding para inputs más compactos
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginVertical: 12,           // Menos margen alrededor del form
  },
  input: {
    marginTop: 12,                 // Espacio reducido entre inputs
    marginBottom: -10,               // Espacio reducido entre inputs
  },
  inputContainer: {
    backgroundColor: '#f5f6fa',
    borderRadius: 8,
    paddingHorizontal: 5,        // Padding ligeramente reducido
    borderBottomWidth: Platform.OS === 'android' ? 0 : StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
  },
  icon: {
    color: '#8e8e93',
  },
  buttonContainer: {
    marginTop: 16,                // Separación reducida antes del botón
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#00a680',   // Use same primary color
    paddingVertical: 12,           // Altura de botón algo menor
    borderRadius: 12,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },

  buttonSMS: {
    backgroundColor: '#00a680',   // Use same primary color
    paddingVertical: 12,           // Altura de botón algo menor
    borderRadius: 12,
    paddingHorizontal: 12
  },

  smsOverlay: {
      width: '90%',
      padding: 24,
      borderRadius: 12,
      backgroundColor: '#ffffff',
      alignItems: 'center', // Centra los elementos
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 8,
      color: '#121212',
    },
    modalText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 12,
      lineHeight: 22,
    },
    closeButtonContainer: {
    position: 'absolute', // Clave para posicionarlo libremente
    top: 10,
    right: 10,
    zIndex: 1, // Asegura que esté por encima de otros elementos si fuera necesario
  },
  recaptchaContainer: {
    // Fondo oscuro semitransparente que cubre toda la pantalla
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // Centra el contenido verticalmente
    justifyContent: 'center',
    // Centra el contenido horizontalmente
    alignItems: 'center',
  },
});
