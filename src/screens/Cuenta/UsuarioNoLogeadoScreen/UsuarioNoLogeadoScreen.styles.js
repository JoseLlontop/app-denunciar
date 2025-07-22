import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    borderRadius: 12,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 4,
    overflow: 'hidden',
    marginBottom: 30,
  },
  image: {
    width: '100%',
    aspectRatio: 1.2,
  },
  title: {
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    marginHorizontal: 15,
    marginBottom: 20,
    color: '#666',
    lineHeight: 20,
  },
  highlight: {
    color: '#00a680',
    fontWeight: 'bold',
  },
  btnContainer: {
    width: width * 0.9,
  },
  btn: {
    backgroundColor: '#00a680',
    borderRadius: 25,
    paddingVertical: 12,
  },
});
