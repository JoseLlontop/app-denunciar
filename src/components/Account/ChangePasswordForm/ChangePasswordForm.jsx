import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, ActivityIndicator, Text as RNText, StyleSheet } from "react-native";
import { Input, Text, Icon } from "react-native-elements";
import { useFormik } from "formik";
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { initialValues, validationSchema } from "./ChangePasswordForm.data";
import { styles } from "./ChangePasswordForm.styles";

function mapFirebaseError(code) {
  switch (code) {
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
  const [banner, setBanner] = useState(null); // { type, title, text }
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const onShowPassword = () => setShowPassword((prev) => !prev);

  const showBannerAndClose = (payload, delayMs) => {
    setBanner(payload);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onClose?.();
      setBanner(null);
    }, delayMs);
  };

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting, setFieldError, resetForm }) => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setBanner({ type: "error", title: "Sin sesión", text: "Iniciá sesión e intentá nuevamente." });
        setSubmitting(false);
        return; // ⬅️ NO cerramos el modal en error
      }

      try {
        setSubmitting(true);
        const credential = EmailAuthProvider.credential(currentUser.email || "", values.password);
        await reauthenticateWithCredential(currentUser, credential);
      } catch (err) {
        const { field, message } = mapFirebaseError(err?.code);
        if (field) setFieldError(field, message);
        setBanner({ type: "error", title: "No pudimos verificar tu identidad", text: message });
        setSubmitting(false);
        return; // ⬅️ NO cerramos el modal en error
      }

      try {
        await updatePassword(currentUser, values.newPassword);
        resetForm();

        // ✅ ÉXITO: banner y cierre automático breve
        showBannerAndClose(
          { type: "success", title: "Contraseña actualizada", text: "Tu contraseña se cambió correctamente." },
          1200
        );
      } catch (err) {
        const { field, message } = mapFirebaseError(err?.code);
        if (field) setFieldError(field, message);
        setBanner({ type: "error", title: "No pudimos cambiar la contraseña", text: message });
        // ⬅️ NO cerramos el modal en error
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

      {banner && (
        <View
          style={[
            localStyles.feedback,
            banner.type === "success" ? localStyles.success : localStyles.error,
          ]}
        >
          <Icon
            type="material-community"
            name={banner.type === "success" ? "check-circle" : "alert-circle"}
            color={banner.type === "success" ? "#1e7e34" : "#c62828"}
            size={18}
            containerStyle={{ marginRight: 8 }}
          />
          <View style={{ flex: 1 }}>
            <RNText style={localStyles.feedbackTitle}>{banner.title}</RNText>
            {!!banner.text && <RNText style={localStyles.feedbackText}>{banner.text}</RNText>}
          </View>
        </View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  feedback: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  success: {
    backgroundColor: "#e8f5e9",
    borderColor: "#a5d6a7",
  },
  error: {
    backgroundColor: "#ffebee",
    borderColor: "#ef9a9a",
  },
  feedbackTitle: {
    fontWeight: "600",
    marginBottom: 2,
  },
  feedbackText: {
    opacity: 0.9,
  },
});
