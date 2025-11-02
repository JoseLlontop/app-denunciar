import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({

    buttonUnirse: {
    backgroundColor: '#00a680',   // Use same primary color
    paddingVertical: 12,           // Altura de botón algo menor
    borderRadius: 12,
  },
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
    // Centra el contenido verticalmente
    justifyContent: 'center',
    // Centra el contenido horizontalmente
    alignItems: 'center',
  },

  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    marginHorizontal: -10, // Compensa el padding negativo del input
  },
  checkboxContainer: {
    padding: 0,
    margin: 0,
    marginRight: 8, // Espacio entre check y texto
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  termsText: {
    fontSize: 14,
    color: '#4f4f4f',
    flexShrink: 1, // Permite que el texto se ajuste si no cabe
  },
  termsLink: {
    color: '#00a680', // Color primario
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  buttonUnirseDisabled: {
    backgroundColor: '#00a680', // Un verde más pálido (deshabilitado)
    paddingVertical: 12,
    borderRadius: 12,
  },
  
  buttonTitleDisabled: {
    color: '#ffffff', // Mantenemos el texto blanco sobre el fondo verde pálido
  },
  
  warningText: {
    marginTop: 15,
    marginHorizontal: 10,
    fontSize: 14,
    color: '#666', // Un color más suave
    textAlign: 'center',
    fontStyle: 'italic',
  },

});
