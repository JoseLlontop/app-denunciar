import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
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
    marginTop: 12,
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
    marginTop: 16,
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
});
