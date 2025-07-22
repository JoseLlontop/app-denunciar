import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: 180,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    // Centra el contenido dentro del modal
    alignItems: 'center',
  },
  animation: {
    width: 130,
    height: 130,
  },
  text: {
    color: '#646464',
    fontWeight: '600',
  },
});