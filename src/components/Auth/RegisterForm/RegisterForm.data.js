// Usamos Yup para la validación de formularios
import * as Yup from "yup";

export function initialValues() {
  return {
    nombre: "",
    telefono: "",
    email: "",
    password: "",
    repeatPassword: "",
  };
}

// El schema en Yup es un objeto que define las reglas de validación 
export function validationSchema() {
  return Yup.object({
    // nombre: obligatorio, mínimo 2 caracteres
    nombre: Yup.string()
      .trim()
      .min(2, "El nombre es demasiado corto")
      .required("El nombre es obligatorio"),

    // teléfono: opcional, pero si viene debe cumplir formato básico
    telefono: Yup.string()
      .trim()
      .matches(/^[0-9+()\s-]*$/, "Formato de teléfono inválido")
      .min(7, "El teléfono es muy corto")
      .max(20, "El teléfono es muy largo")
      .nullable(),

    // email: debe ser un email válido y es obligatorio
    email: Yup.string()
      .email("El email no es correcto")
      .required("El email es obligatorio"),

    // password: es obligatorio
    password: Yup.string().required("La contraseña es obligatoria"),

    // repeatPassword: es obligatorio y debe ser igual a password
    repeatPassword: Yup.string()
      .required("La contraseña es obligatoria")
      .oneOf([Yup.ref("password")], "Las contraseñas tienen que ser iguales"),
  });
}
