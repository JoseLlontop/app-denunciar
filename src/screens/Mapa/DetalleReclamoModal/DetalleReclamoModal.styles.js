import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Estilos del Modal
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 300, // Alto mínimo para que se vea bien
    paddingTop: 12, // Espacio para el handle
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  
  // Estilos del contenido
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },

  // Estilos del InfoRow
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIconContainer: {
    width: 40, // Ancho fijo para alinear
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoTextContainer: {
    flex: 1, // Ocupa el resto del espacio
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});