import React from "react";
import { View } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { useFormik } from "formik";
import { getAuth, updateProfile } from "firebase/auth";
import Toast from "react-native-toast-message";
import { initialValues, validationSchema } from "./ChangeDisplayNameForm.data";
import { styles } from "./ChangeDisplayNameForm.styles";

export function ChangeDisplayNameForm(props) {
  const { onClose, onReload } = props;

  const formik = useFormik({
    // Valores iniciales del formulario
    initialValues: initialValues(),
    // Validación con Yup
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const { displayName } = formValue;
        // CurrentUser es el usuario autenticado actualmente
        const currentUser = getAuth().currentUser;
        // Actualizar el perfil del usuario con el nuevo displayName
        await updateProfile(currentUser, { displayName });

        onReload();
        onClose();
      } catch (error) {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error al cambiar el nombre y apellidos",
        });
      }
    },
  });

  return (
    <View style={styles.content}>
      {/* Título compacto para orientar al usuario */}
      <Text h4 style={styles.title}>
        Cambiar nombre y apellidos
      </Text>

      <Input
        placeholder="Nombre y apellidos"
        // icono derecho suave
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#9e9e9e",
        }}
        // estilo visual del input
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        containerStyle={styles.inputWrapper}
        errorStyle={styles.error}
        onChangeText={(text) => formik.setFieldValue("displayName", text)}
        errorMessage={formik.errors.displayName}
      />

      <Button
        title="Guardar cambios"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        titleStyle={styles.btnTitle}
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
      />
    </View>
  );
}