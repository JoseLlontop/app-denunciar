
export function getIncidentes(dbIncidentes) {
  switch (dbIncidentes) {
    case 'alumbrado':
      return 'Alumbrado';
    case 'baches':
      return 'Bache';
    case 'residuos':
      return 'Residuos';
    default:
      // Si el incidente no es uno de los conocidos,
      // devuelve el mismo que recibió o un texto por defecto.
      
      // CORREGIDO: Usaba 'dbStatus' en lugar de 'dbIncidentes'
      return 'Incidente Desconocido';
  }
}