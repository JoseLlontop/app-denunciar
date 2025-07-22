import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2',   // Match global app background
  },
  headerImage: {
    width: width,
    height: height * 0.26,        // Aumentada altura para imagen más grande
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  formContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,        // Consistent horizontal padding
    paddingTop: 8,                // Menos espacio arriba para compensar imagen más grande
    alignItems: 'center',
  },
});