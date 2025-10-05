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

export function validationSchema() {
  return Yup.object({
    nombre: Yup.string()
      .trim()
      .min(2, "El nombre es demasiado corto")
      .required("El nombre es obligatorio"),

    // EXACTAMENTE 10 dígitos (código de área + número). Sin 0, sin 15, sin +54.
    telefono: Yup.string()
      .trim()
      .matches(/^\d{10}$/, "Debe tener 10 dígitos (sin +54)")
      .required("El teléfono es obligatorio"),

    email: Yup.string()
      .email("El email no es correcto")
      .required("El email es obligatorio"),

    password: Yup.string().required("La contraseña es obligatoria"),

    repeatPassword: Yup.string()
      .required("La contraseña es obligatoria")
      .oneOf([Yup.ref("password")], "Las contraseñas tienen que ser iguales"),
  });
}
