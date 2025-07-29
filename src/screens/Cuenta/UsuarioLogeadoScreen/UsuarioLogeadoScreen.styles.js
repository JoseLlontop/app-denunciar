import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: width * 0.9,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
  },
  imageContainer: {
    alignSelf: 'center',       // Centra el contenedor de la imagen
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  btnContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  btnPrimary: {
    backgroundColor: '#00a680',
    borderRadius: 8,
    paddingVertical: 12,
  },
  btnOutline: {
    borderColor: '#00a680',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 12,
  },
  btnOutlineTitle: {
    color: '#00a680',
    fontWeight: '700',
  },
});
