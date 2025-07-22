// Usamos Yup para la validación de formularios
import * as Yup from "yup";

export function initialValues() {
  return {
    email: "",
    password: "",
    repeatPassword: "",
  };
}

// El schema en Yup es un objeto que define las reglas de validación 
export function validationSchema() {
  return Yup.object({
    // Realizamos validaciones para cada campo del formulario
    // email: debe ser un email válido y es obligatorio
    // password: es obligatorio
    // repeatPassword: es obligatorio y debe ser igual a password
    email: Yup.string()
      .email("El email no es correcto")
      .required("El email es obligatorio"),

    password: Yup.string().required("La contraseña es obligatoria"),

    repeatPassword: Yup.string()
      .required("La contraseña es obligatoria")
      .oneOf([Yup.ref("password")], "Las contraseñas tienen que ser iguales"),
  });
}