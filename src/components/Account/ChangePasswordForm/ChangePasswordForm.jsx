import React, { useState } from "react";
import { View, TouchableOpacity, ActivityIndicator, Text as RNText, Platform } from "react-native";
import { Input, Text, Icon } from "react-native-elements";
import { useFormik } from "formik";
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import Toast from "react-native-toast-message";
import { initialValues, validationSchema } from "./ChangePasswordForm.data";
import { styles } from "./ChangePasswordForm.styles";

function mapFirebaseError(code) {
  switch (code) {
    // Reautenticación
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return { field: "password", message: "La contraseña actual no es correcta." };
    case "auth/user-mismatch":
      return { field: null, message: "La credencial no corresponde al usuario actual." };
    case "auth/too-many-requests":
      return { field: null, message: "Demasiados intentos. Esperá unos minutos e intentá de nuevo." };
    case "auth/network-request-failed":
      return { field: null, message: "Problema de conexión. Verificá tu Internet." };
    case "auth/user-disabled":
      return { field: null, message: "La cuenta del usuario está deshabilitada." };

    // updatePassword
    case "auth/weak-password":
      return { field: "newPassword", message: "La nueva contraseña es muy débil (mínimo 6 caracteres)." };
    case "auth/requires-recent-login":
      return { field: null, message: "Por seguridad, iniciá sesión nuevamente y volvé a intentar." };

    default:
      return { field: null, message: "Ocurrió un error inesperado. Volvé a intentar." };
  }
}

export function ChangePasswordForm({ onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const onShowPassword = () => setShowPassword((prev) => !prev);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting, setFieldError, resetForm }) => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Toast.show({
          type: "error",
          position: "top",
          topOffset: Platform.OS === "ios" ? 60 : 40,
          text1: "No hay sesión activa",
          text2: "Iniciá sesión e intentá nuevamente.",
        });
        return;
      }

      try {
        setSubmitting(true);

        // 1) Reautenticar con la contraseña actual
        const credential = EmailAuthProvider.credential(currentUser.email || "", values.password);
        await reauthenticateWithCredential(currentUser, credential);
      } catch (err) {
        const { field, message } = mapFirebaseError(err?.code);
        if (field) setFieldError(field, message);
        Toast.show({
          type: "error",
          position: "top",
          topOffset: Platform.OS === "ios" ? 60 : 40,
          text1: "No pudimos verificar tu identidad",
          text2: message,
        });
        setSubmitting(false);
        return;
      }

      try {
        // 2) Cambiar contraseña
        await updatePassword(currentUser, values.newPassword);

        Toast.show({
          type: "success",
          position: "top",
          topOffset: Platform.OS === "ios" ? 60 : 40,
          text1: "Contraseña actualizada",
          text2: "Tu contraseña se cambió correctamente.",
        });

        resetForm();
        onClose?.();
      } catch (err) {
        const { field, message } = mapFirebaseError(err?.code);
        if (field) setFieldError(field, message);
        Toast.show({
          type: "error",
          position: "top",
          topOffset: Platform.OS === "ios" ? 60 : 40,
          text1: "No pudimos cambiar la contraseña",
          text2: message,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const EyeIcon = (k) => (
    <Icon
      key={k}
      type="material-community"
      name={showPassword ? "eye-off-outline" : "eye-outline"}
      color="#c2c2c2"
      onPress={onShowPassword}
    />
  );

  return (
    <View style={styles.content}>
      <Text key="title" h4 style={styles.title}>
        Cambiar contraseña
      </Text>

      <Input
        key="current-password"
        placeholder="Contraseña actual"
        containerStyle={styles.inputWrapper}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        secureTextEntry={!showPassword}
        rightIcon={EyeIcon("eye-current")}
        onChangeText={(t) => formik.setFieldValue("password", t)}
        errorMessage={formik.errors.password}
        errorStyle={styles.error}
      />

      <Input
        key="new-password"
        placeholder="Nueva contraseña"
        containerStyle={styles.inputWrapper}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        secureTextEntry={!showPassword}
        rightIcon={EyeIcon("eye-new")}
        onChangeText={(t) => formik.setFieldValue("newPassword", t)}
        errorMessage={formik.errors.newPassword}
        errorStyle={styles.error}
      />

      <Input
        key="confirm-password"
        placeholder="Repite nueva contraseña"
        containerStyle={styles.inputWrapper}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        secureTextEntry={!showPassword}
        rightIcon={EyeIcon("eye-confirm")}
        onChangeText={(t) => formik.setFieldValue("confirmNewPassword", t)}
        errorMessage={formik.errors.confirmNewPassword}
        errorStyle={styles.error}
      />

      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={[styles.btn, formik.isSubmitting && { opacity: 0.7 }]}
          onPress={formik.handleSubmit}
          activeOpacity={0.8}
          disabled={formik.isSubmitting}
          accessibilityRole="button"
        >
          {formik.isSubmitting ? (
            <ActivityIndicator />
          ) : (
            <RNText style={styles.btnTitle}>Cambiar contraseña</RNText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
