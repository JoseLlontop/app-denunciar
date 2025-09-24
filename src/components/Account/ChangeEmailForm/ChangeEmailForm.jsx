import React, { useState } from "react";
import { View, TouchableOpacity, ActivityIndicator, Text as RNText, Platform } from "react-native";
import { Input, Text, Icon } from "react-native-elements";
import { useFormik } from "formik";
import {
  getAuth,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import Toast from "react-native-toast-message";
import { initialValues, validationSchema } from "./ChangeEmailForm.data";
import { styles } from "./ChangeEmailForm.styles";

function mapFirebaseError(code) {
  switch (code) {
    // Reautenticación
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return { field: "password", message: "La contraseña no es correcta." };
    case "auth/user-mismatch":
      return { field: null, message: "La credencial no corresponde al usuario actual." };
    case "auth/too-many-requests":
      return { field: null, message: "Demasiados intentos. Esperá unos minutos e intentá de nuevo." };
    case "auth/network-request-failed":
      return { field: null, message: "Problema de conexión. Verificá tu Internet." };
    case "auth/user-disabled":
      return { field: null, message: "La cuenta del usuario está deshabilitada." };

    // updateEmail
    case "auth/invalid-email":
      return { field: "email", message: "El formato de email no es válido." };
    case "auth/email-already-in-use":
      return { field: "email", message: "Ese email ya está en uso por otra cuenta." };
    case "auth/requires-recent-login":
      return { field: null, message: "Por seguridad, iniciá sesión nuevamente y volvé a intentar." };

    default:
      return { field: null, message: "Ocurrió un error inesperado. Volvé a intentar." };
  }
}

export function ChangeEmailForm({ onClose, onReload }) {
  const [showPassword, setShowPassword] = useState(false);
  const onShowPassword = () => setShowPassword((prev) => !prev);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting, setFieldError, resetForm }) => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      // Sesión no disponible
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

      // Evitar mismo email
      const newEmail = values.email.trim();
      if ((currentUser.email || "").toLowerCase() === newEmail.toLowerCase()) {
        setFieldError("email", "El nuevo email es igual al actual.");
        return;
      }

      try {
        setSubmitting(true);

        // 1) Reautenticar
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
        // 2) Actualizar email
        await updateEmail(currentUser, newEmail);

        Toast.show({
          type: "success",
          position: "top",
          topOffset: Platform.OS === "ios" ? 60 : 40,
          text1: "Email actualizado",
          text2: "Si es necesario, te pediremos verificar el nuevo email.",
        });

        onReload?.();
        onClose?.();
        resetForm();
      } catch (err) {
        const { field, message } = mapFirebaseError(err?.code);
        if (field) setFieldError(field, message);
        Toast.show({
          type: "error",
          position: "top",
          topOffset: Platform.OS === "ios" ? 60 : 40,
          text1: "No pudimos cambiar el email",
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
        Cambiar email
      </Text>

      <Input
        key="email-input"
        placeholder="Nuevo email"
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#9e9e9e"
        containerStyle={styles.inputWrapper}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        onChangeText={(t) => formik.setFieldValue("email", t)}
        errorMessage={formik.errors.email}
        errorStyle={styles.error}
      />

      <Input
        key="password-input"
        placeholder="Contraseña actual"
        placeholderTextColor="#9e9e9e"
        containerStyle={styles.inputWrapper}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        secureTextEntry={!showPassword}
        rightIcon={EyeIcon("eye-email")}
        onChangeText={(t) => formik.setFieldValue("password", t)}
        errorMessage={formik.errors.password}
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
            <RNText style={styles.btnTitle}>Cambiar email</RNText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
