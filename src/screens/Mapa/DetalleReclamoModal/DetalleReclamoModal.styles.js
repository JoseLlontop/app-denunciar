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
    paddingHorizontal: 36,
    paddingTop: 12,
    paddingBottom: 30,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    
    maxHeight: screenHeight * 1, // Mantenemos tu cambio
    minHeight: screenHeight * 0.4, // Altura mínima para el loader inicial
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  
  // --- Loader "inline" ---
  inlineLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0,166,128,0.05)',
    marginBottom: 10,
  },
  inlineLoadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#00a680',
    fontWeight: '500',
  },
  
  fullLoadingContainer: {
    height: screenHeight * 0.4, // Ocupa la altura mínima
    alignItems: 'center',
    justifyContent: 'center',
  },

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

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 6,
    marginBottom: 18, 
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#ffffff', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  tabButtonTextActive: {
    color: '#00a680', 
  },
});