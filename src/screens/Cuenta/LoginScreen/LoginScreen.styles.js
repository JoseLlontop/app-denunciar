import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  headerImage: {
    width: width,
    height: height * 0.26,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    alignItems: 'center',
  },
  textRegister: {
    marginTop: 16,
    fontSize: 14,
    color: '#333',
  },
  btnRegister: {
    color: '#00a680',
    fontWeight: 'bold',
  },
});
