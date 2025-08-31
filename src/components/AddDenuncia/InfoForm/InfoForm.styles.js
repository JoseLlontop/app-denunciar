import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    margin: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },

  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  inputWrapper: {
    marginBottom: 16,
    width: '100%',
  },

  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  halfWidth: {
    width: (width - 64) / 2, // card padding + gap
  },

  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },

  picker: {
    height: 50,
    width: '100%',
  },

  error: {
    marginTop: 4,
    color: '#ff0000',
    fontSize: 12,
  },

  mapButton: {
    borderColor: '#00a680',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
  },

  mapButtonWrapper: {
    marginTop: 8,
    marginBottom: 16,
  },

  submitButton: {
    backgroundColor: '#00a680',
    borderRadius: 4,
    paddingVertical: 12,
  },

  submitWrapper: {
    marginTop: 8,
    marginBottom: 16,
  },
});
