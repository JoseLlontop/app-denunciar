import * as Yup from "yup";

export function initialValues() {
  return {
    newPhone: "",
    password: "",
  };
}

export function validationSchema() {
  return Yup.object({
    newPhone: Yup.string()
      .matches(/^[0-9]+$/, "Solo debe contener números")
      .length(10, "El teléfono debe tener 10 dígitos (sin 0 ni 15)")
      .required("El nuevo teléfono es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria"),
  });
}