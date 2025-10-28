import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Container with padding
  formContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 22,
  },

  // Card without margins
  card: {
    borderRadius: 8,
    padding: 16,
    margin: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // ---- STATUS BLOCK STYLES ----
  statusBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#FDBA74',   // light orange
    backgroundColor: '#FFF7ED', // very light amber background
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  statusTextWrap: {
    flex: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F59E0B', // amber 500
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 9999, // pill shape
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
  },
  statusDescription: {
    marginTop: 6,
    color: '#7C2D12', // amber 900
    fontSize: 13,
  },
  // ---- END STATUS STYLES ----

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 26,
    color: '#333',
    paddingRight: 64, // Keep space for potential icons/actions
  },

  sectionTitle1: { // Used for the first section
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 26,
    color: '#333',
    paddingRight: 64,
    marginTop: 10,
  },

  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  inputWrapper: {
    marginBottom: 0, // Inputs are tightly packed vertically
    width: '100%',
  },

  textArea: {
    minHeight: 80, // Allow description to be multi-line
    textAlignVertical: 'top', // Align text to top in Android
  },

  // --- ADJUSTED PICKER STYLES ---
pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
    // overflow: 'hidden', // <-- MUY BIEN que esto esté comentado, si no, no se vería el modal.
  },
  picker: {
    height: 60,      // <-- DESCOMENTA O AÑADE ESTA LÍNEA
    width: '90%',
    backgroundColor: '#fff', // <-- AÑADE ESTO para que tenga fondo blanco
    color: '#000',
  },
  // --- END ADJUSTED PICKER STYLES ---

  error: {
    marginBottom: 10, // Space below the picker/input
    marginLeft: 10, // Slight indent
    color: '#ff0000', // Standard error red
    fontSize: 12,
  },

  // Map button (no location selected)
  mapButton: {
    borderColor: '#00a680', // Green outline
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
  },

  // Map button (location selected)
  mapButtonSaved: {
    backgroundColor: '#00a680', // Solid green background
    borderRadius: 4,
    paddingVertical: 8,
  },

  mapButtonWrapper: {
    marginTop: 8,
    marginBottom: 6,
  },

  // Location status row
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#555', // Default text color
    flexShrink: 1, // Allow text to wrap if needed
  },
  locationTextSaved: {
    color: '#00a680', // Green text when saved
    fontWeight: '600',
  },
});