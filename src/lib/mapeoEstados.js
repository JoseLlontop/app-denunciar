
export function getEstado(dbStatus) {
  switch (dbStatus) {
    case 'pendiente':
      return 'Esperando Revisión';
    case 'en_progreso':
      return 'Trabajo en Progreso';
    case 'resuelto':
      return 'Trabajo Finalizado';
    default:
      // Si el estado no es uno de los conocidos,
      // devuelve el mismo que recibió o un texto por defecto.
      return dbStatus || 'Estado Desconocido';
  }
}