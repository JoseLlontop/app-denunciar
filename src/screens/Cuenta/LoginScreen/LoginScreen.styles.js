import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  headerImage: {
    width: width,
    height: height * 0.25,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
    alignItems: 'center',
  },
  textRegister: {
    marginBottom: 22,
    fontSize: 14,
    color: '#333',
  },
  btnRegister: {
    color: '#00a680',
    fontWeight: 'bold',
  },
});
