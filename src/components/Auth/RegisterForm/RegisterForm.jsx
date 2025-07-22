import { useState } from "react";
import { View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { useFormik } from "formik";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
// import Toast from "react-native-toast-message";
import { screen } from "../../../utils";
import { initialValues, validationSchema } from "./RegisterForm.data";
import { styles } from "./RegisterForm.styles";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  // Usamos formik para controlar los datos del formulario y la validación
  const formik = useFormik({

    // Valores iniciales del formulario
    initialValues: initialValues(),
    // Usamos otro atributo de formik para realizar validaciones del formulario
    validationSchema: validationSchema(),
    // Solo muestra los errores al enviar el formulario
    validateOnChange: false,

    // En formValue tenemos los valores del formulario
    onSubmit: async (formValue) => {
      try {
        const auth = getAuth();
        await createUserWithEmailAndPassword(
          auth,
          formValue.email,
          formValue.password
        );
        navigation.navigate(screen.cuenta.cuenta);
      } catch (error) {
        // Usamos Toast para mostrar mensajes de error
//        Toast.show({
//          type: "error",
//          position: "bottom",
//text1: "Error al registrarse, intentelo mas tarde",
//        });
      }
    },
  });

  // Función para mostrar/ocultar la contraseña
  const showHidenPassword = () => setShowPassword((prevState) => !prevState);

  return (
    <View style={styles.content}>

      <Input
        placeholder="Correo electronico"
        containerStyle={styles.input}
        // Agrega un icono al final del input
        rightIcon={
          <Icon type="material-community" name="at" iconStyle={styles.icon} />
        }
        // Cuando el usuario escribe en el input, se actualiza el valor del campo "email" en nuestro formik
        onChangeText={(text) => formik.setFieldValue("email", text)}
        errorMessage={formik.errors.email}
      />

      <Input
        placeholder="Contraseña"
        containerStyle={styles.input}
        // Para mostrar/ocultar la contraseña
        secureTextEntry={showPassword ? false : true}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.icon}
            onPress={showHidenPassword}
          />
        }
        onChangeText={(text) => formik.setFieldValue("password", text)}
        errorMessage={formik.errors.password}
      />

      <Input
        placeholder="Repetir contraseña"
        containerStyle={styles.input}
        secureTextEntry={showPassword ? false : true}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.icon}
            onPress={showHidenPassword}
          />
        }
        onChangeText={(text) => formik.setFieldValue("repeatPassword", text)}
        errorMessage={formik.errors.repeatPassword}
      />

      <Button
        title="Unirse"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        // Enviamos el formulario y ejecutamos la función onSubmit de formik
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
      />

    </View>
  );
}