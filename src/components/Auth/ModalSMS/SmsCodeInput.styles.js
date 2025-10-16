import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  inputContainer: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f5f6fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#333',
    width: '100%',
    height: '100%',
  },
});