import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, ActivityIndicator, Text as RNText, StyleSheet } from "react-native";
import { Input, Text, Icon } from "react-native-elements";
import { useFormik } from "formik";
import {
  getAuth,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { initialValues, validationSchema } from "./ChangeEmailForm.data";
import { styles } from "./ChangeEmailForm.styles";

function mapFirebaseError(code) {
  switch (code) {
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
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setBanner({ type: "error", title: "Sin sesión", text: "Iniciá sesión e intentá nuevamente." });
        setSubmitting(false);
        return; // ⬅️ NO cerramos el modal en error
      }

      const newEmail = values.email.trim();
      if ((currentUser.email || "").toLowerCase() === newEmail.toLowerCase()) {
        setFieldError("email", "El nuevo email es igual al actual.");
        setBanner({ type: "error", title: "Sin cambios", text: "Ingresá un email distinto al actual." });
        return;
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
        await updateEmail(currentUser, newEmail);
        resetForm();
        onReload?.();

        // ✅ ÉXITO: banner y cierre automático breve
        showBannerAndClose(
          { type: "success", title: "Email actualizado", text: "Si hace falta, te pediremos verificarlo." },
          1200
        );
      } catch (err) {
        const { field, message } = mapFirebaseError(err?.code);
        if (field) setFieldError(field, message);
        setBanner({ type: "error", title: "No pudimos cambiar el email", text: message });
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

      {/* Banner interno abajo */}
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
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 12,
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
