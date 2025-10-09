import * as Yup from 'yup';

// Valores iniciales para el formulario de denuncia.

export function initialValues() {
  return {
    title: '',           // Título breve de la incidencia
    description: '',     // Descripción detallada
    category: '',        // Categoría seleccionada
    location: null,      // Coordenadas { latitude, longitude }
    images: [],          // Array de URIs de imágenes
  };
}

/**
 * Esquema de validación con Yup.
 */
export function validationSchema() {
  return Yup.object({

    title: Yup.string()
      .trim()
      .required('El título es obligatorio')
      .max(100, 'Máximo 100 caracteres'),

    description: Yup.string()
      .trim()
      .required('La descripción es obligatoria')
      .max(500, 'Máximo 500 caracteres'),

    category: Yup.string()
      .required('La categoría es obligatoria'),

    location: Yup.object()
      .shape({
        latitude: Yup.number().required(),
        longitude: Yup.number().required(),
      })
      .required('La ubicación es obligatoria')
      .nullable(),

    images: Yup.array()
      .of(Yup.string().url('Cada imagen debe ser una URL válida'))
      .notRequired(),
      //.min(1, 'Se requiere al menos una imagen')
      //.required('Las imágenes son obligatorias'),
  });
}