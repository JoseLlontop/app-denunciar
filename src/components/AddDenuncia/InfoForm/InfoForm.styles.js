import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Nuevo contenedor externo con padding para evitar pérdida de márgenes tras cerrar el modal
  formContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },

  // Card sin márgenes; el espacio lo da formContainer
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

  // ---- NUEVOS ESTILOS PARA EL BLOQUE DE ESTADO ----
  statusBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#FDBA74',   // naranja claro
    backgroundColor: '#FFF7ED', // fondo ámbar muy claro
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
    backgroundColor: '#F59E0B', // ámbar 500
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 9999,
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
  },
  statusDescription: {
    marginTop: 6,
    color: '#7C2D12', // ámbar 900
    fontSize: 13,
  },
  // ---- FIN NUEVOS ESTILOS ----

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 26,
    color: '#333',
    paddingRight: 64,
  },

  sectionTitle1: {
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
    marginBottom: 0,
    width: '100%',
  },

  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  halfWidth: {
    width: (width - 64) / 2,
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
    height: 60,
    width: '100%',
  },

  error: {
    marginTop: 4,
    color: '#ff0000',
    fontSize: 12,
  },

  // Botón mapa (sin ubicación)
  mapButton: {
    borderColor: '#00a680',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
  },

  // Botón mapa cuando HAY ubicación (feedback visual)
  mapButtonSaved: {
    backgroundColor: '#00a680',
    borderRadius: 4,
    paddingVertical: 8,
  },

  mapButtonWrapper: {
    marginTop: 8,
    marginBottom: 6,
  },

  // Estado de ubicación
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
    color: '#555',
    flexShrink: 1,
  },

  locationTextSaved: {
    color: '#00a680',
    fontWeight: '600',
  },
});