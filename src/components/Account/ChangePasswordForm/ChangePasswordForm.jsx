import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, ActivityIndicator, Text as RNText, StyleSheet } from "react-native";
import { Input, Text, Icon } from "react-native-elements";
import { useFormik } from "formik";

import { auth } from "../../../utils/firebase"; 
import { EmailAuthProvider } from "@react-native-firebase/auth"; 

import { initialValues, validationSchema } from "./ChangePasswordForm.data";
import { styles } from "./ChangePasswordForm.styles";

// Mapeo de errores: si no hay `code`, mostramos el mensaje crudo para diagnóstico
function mapFirebaseError(err) {
  const code = err?.code || "";
  const raw = err?.message;

  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
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

    case "auth/user-token-expired":
      return { field: null, message: "La sesión expiró. Iniciá sesión otra vez y reintentá." };

    case "auth/internal-error":
      return { field: null, message: "Error interno de autenticación. Probá nuevamente." };
  }
  return { field: null, message: raw || "Ocurrió un error inesperado. Volvé a intentar." };
}

export function ChangePasswordForm({ onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [banner, setBanner] = useState(null); // { type: 'success'|'error', title, text }
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
      
      const currentUser = auth.currentUser; 

      if (!currentUser) {
        setBanner({ type: "error", title: "Sin sesión", text: "Iniciá sesión e intentá nuevamente." });
        setSubmitting(false);
        return; 
      }

      try {
        await currentUser.reload();
      } catch (e) {
        console.log("[ChangePasswordForm] reload error ->", e?.code, e?.message, e);
      }

      // Verificar que la sesión tenga proveedor 'password'
      const hasPasswordProvider = (currentUser.providerData || [])
        .map((p) => p.providerId)
        .includes("password");
      if (!hasPasswordProvider) {
        setFieldError("password", "Tu sesión actual no usa contraseña.");
        setBanner({
          type: "error",
          title: "No se puede verificar con contraseña",
          text: "Ingresaste con un proveedor externo. Reautenticá con ese proveedor o vinculá una contraseña primero.",
        });
        setSubmitting(false);
        return; // NO cerramos el modal en error
      }

      // 1) Reautenticar
      try {
        // 4. CAMBIO: 'EmailAuthProvider' se importa de '@react-native-firebase/auth'
        const credential = EmailAuthProvider.credential(currentUser.email || "", values.password);
        
        // 5. CAMBIO: 'reauthenticateWithCredential' es un método de 'currentUser'
        await currentUser.reauthenticateWithCredential(credential);

      } catch (err) {
        console.log("[ChangePasswordForm] reauth error ->", err?.code, err?.message, err);
        const { field, message } = mapFirebaseError(err);
        if (field) setFieldError(field, message);
        setBanner({ type: "error", title: "No pudimos verificar tu identidad", text: message });
        setSubmitting(false);
        return; 
      }

      // 2) Actualizar contraseña
      try {
        // 6. CAMBIO: 'updatePassword' es un método de 'currentUser'
        await currentUser.updatePassword(values.newPassword);
        resetForm();

        showBannerAndClose(
          { type: "success", title: "Contraseña actualizada", text: "Tu contraseña se cambió correctamente." },
          3000
        );
      } catch (err) {
        console.log("[ChangePasswordForm] updatePassword error ->", err?.code, err?.message, err);
        const { field, message } = mapFirebaseError(err);
        if (field) setFieldError(field, message);
        setBanner({ type: "error", title: "No pudimos cambiar la contraseña", text: message });
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
        placeholderTextColor="#9e9e9e"
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
        placeholderTextColor="#9e9e9e"
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
        placeholderTextColor="#9e9e9e"
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

      {/* Banner de feedback */}
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
    fontWeight: "700",
    marginBottom: 2,
  },
  feedbackText: {
    opacity: 0.9,
  },
});
