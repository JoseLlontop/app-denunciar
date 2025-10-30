import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, ActivityIndicator, Text as RNText, StyleSheet } from "react-native";
import { Input, Text, Icon } from "react-native-elements";
import { useFormik } from "formik";

import { auth } from "../../../utils/firebase"; 
import { EmailAuthProvider } from "@react-native-firebase/auth"; 

import { initialValues, validationSchema } from "./ChangeEmailForm.data";
import { styles } from "./ChangeEmailForm.styles";

// Mapa de errores → mensajes de UI
function mapFirebaseError(err) {
  const code = err?.code || "";
  const raw = err?.message;

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/invalid-login-credentials":
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

    // ⬇️ Este es tu caso actual
    case "auth/operation-not-allowed":
      return {
        field: null,
        message:
          "Por política del proyecto, primero debés verificar el nuevo email desde el enlace que te enviamos.",
      };

    // Si llegás a configurar deep links/continue URL y hay problemas de dominios:
    case "auth/invalid-continue-uri":
      return { field: null, message: "La URL de redirección no es válida." };
    case "auth/unauthorized-continue-uri":
      return { field: null, message: "La URL de redirección no está autorizada en Firebase." };

    default:
      return { field: null, message: raw || "Ocurrió un error inesperado. Volvé a intentar." };
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

  const onShowPassword = () => setShowPassword((p) => !p);

  const showBannerAndClose = (payload, delayMs) => {
    setBanner(payload);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setBanner(null);
      onClose?.();
    }, delayMs);
  };

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting, setFieldError, resetForm }) => {
      
      // 2. CAMBIO: Usamos 'auth' importada
      // ELIMINADO: const auth = getAuth(getApp());
      const currentUser = auth.currentUser; // <-- Directo de la instancia 'auth'

      if (!currentUser) {
        setBanner({ type: "error", title: "Sin sesión", text: "Iniciá sesión e intentá nuevamente." });
        setSubmitting(false);
        return;
      }

      // Refrescar datos
      try {
        // 3. CAMBIO: 'reload' es un método de 'currentUser'
        await currentUser.reload();
      } catch (e) {
        console.log("[ChangeEmailForm] reload error ->", e?.code, e?.message, e);
      }

      const newEmail = (values.email || "").trim();
      const currentEmail = (currentUser.email || "").trim();

      if (currentEmail.toLowerCase() === newEmail.toLowerCase()) {
        setFieldError("email", "El nuevo email es igual al actual.");
        setBanner({ type: "error", title: "Sin cambios", text: "Ingresá un email distinto al actual." });
        setSubmitting(false);
        return;
      }

      // Verificar proveedor 'password'
      const isPasswordProvider = (currentUser.providerData || [])
        .map((p) => p.providerId)
        .includes("password");
      if (!isPasswordProvider) {
        setFieldError("password", "Tu sesión no usa contraseña.");
        setBanner({
          type: "error",
          title: "No se puede verificar con contraseña",
          text: "Ingresaste con un proveedor externo. Reautenticá con ese proveedor o vinculá una contraseña primero.",
        });
        setSubmitting(false);
        return;
      }

      // 1) Reautenticar con contraseña
      try {
        // 4. CAMBIO: 'EmailAuthProvider' se importa de la librería nativa
        const credential = EmailAuthProvider.credential(currentEmail, values.password);
        
        // 5. CAMBIO: 'reauthenticateWithCredential' es un método de 'currentUser'
        await currentUser.reauthenticateWithCredential(credential);

      } catch (err) {
        console.log("[ChangeEmailForm] reauth error ->", err?.code, err?.message, err);
        const { field, message } = mapFirebaseError(err);
        if (field) setFieldError(field, message);
        setBanner({ type: "error", title: "No pudimos verificar tu identidad", text: message });
        setSubmitting(false);
        return;
      }

      // 2) Enviar verificación al NUEVO email
      try {
        // 6. CAMBIO: 'verifyBeforeUpdateEmail' es un método de 'currentUser'
        await currentUser.verifyBeforeUpdateEmail(newEmail);

        // Si más adelante configurás deep links / continue URL, podrías usar:
        // const ACTION_CODE_SETTINGS = {
        //   url: "https://TU_DOMINIO_AUTORIZADO/finishEmailUpdate",
        //   handleCodeInApp: true, // si querés abrir en tu app con deep link
        //   iOS: { bundleId: "tu.bundle.id" },
        //   android: { packageName: "tu.paquete.android", installApp: true, minimumVersion: "21" },
        //   dynamicLinkDomain: "tudominio.page.link",
        // };
        // await verifyBeforeUpdateEmail(currentUser, newEmail, ACTION_CODE_SETTINGS);

        resetForm();
        onReload?.(); // refrescar pantalla si corresponde (el email efectivo se verá tras la confirmación)
        showBannerAndClose(
          {
            type: "success",
            title: "Verificación enviada",
            text:
              "Te enviamos un enlace al nuevo email. Abrilo para confirmar el cambio. " +
              "Después de confirmar, tu cuenta usará ese correo.",
          },
          6000
        );
      } catch (err) {
        console.log("[ChangeEmailForm] verifyBeforeUpdateEmail error ->", err?.code, err?.message, err);
        const { field, message } = mapFirebaseError(err);
        if (field) setFieldError(field, message);
        setBanner({ type: "error", title: "No pudimos iniciar el cambio", text: message });
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