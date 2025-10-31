import { StyleSheet, Dimensions, Platform } from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  // Estilos del Modal
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 30,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    
    // --- ¡ESTE ES EL CAMBIO DE ALTURA! ---
    maxHeight: screenHeight * 1, // Antes era 0.85
    // --- ---------------------------- ---
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  
  // (El resto de los estilos no cambian)
  // ...
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIconContainer: {
    width: 40, 
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoTextContainer: {
    flex: 1,
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
  imageSectionContainer: {
    marginBottom: 12, 
  },
  imageSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
  },
  imageScrollView: {
    paddingLeft: 2, 
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden', 
    marginRight: 10, 
    backgroundColor: '#eee', 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    borderRadius: 12, 
  },
  lightboxModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30, 
    right: 20,
    zIndex: 10, 
    padding: 10, 
  },
  lightboxContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxImage: {
    width: screenWidth,         
    height: screenHeight * 0.8, 
  },
});
