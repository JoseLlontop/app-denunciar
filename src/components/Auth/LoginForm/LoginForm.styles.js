import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // --- Estilos de la Tarjeta de Login (Tus estilos originales) ---
  card: {
    width: width * 0.9,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    alignSelf: 'center',
    marginVertical: 20,
  },
  content: {
    alignItems: 'center',
  },
  input: {
    width: '100%',
    marginTop: 7,
  },
  inputContainer: {
    backgroundColor: '#f5f6fa',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderBottomWidth: Platform.OS === 'android' ? 0 : StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
  },
  icon: {
    color: '#8e8e93',
  },
  btnContainer: {
    marginTop: 7,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  btn: {
    backgroundColor: '#00a680',
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },

  // --- NUEVOS ESTILOS: Para el Modal SMS (Overlay) ---
  smsOverlay: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1, // Asegura que esté por encima de otros elementos del modal
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333', // Un color de texto legible
  },
  buttonSMS: {
    backgroundColor: '#00a680', // Mismo color que el botón de login
    borderRadius: 12,
    paddingVertical: 14,
  },
});