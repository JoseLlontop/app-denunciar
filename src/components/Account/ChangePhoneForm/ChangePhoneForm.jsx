// ChangePhoneForm.jsx
import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  TouchableOpacity, 
  ActivityIndicator, 
  Text as RNText, 
  StyleSheet 
} from "react-native";
import { Input, Text, Icon, Overlay, Button } from "react-native-elements";
import { useFormik } from "formik";
import { auth } from "../../../utils/firebase";
import { 
  EmailAuthProvider, 
  PhoneAuthProvider 
} from "@react-native-firebase/auth";

// Asumo que tienes este componente de tu LoginForm
import { SmsCodeInput } from '../../Auth/ModalSMS/SmsCodeInput'; 

// <<< NUEVO: Importaciones para la API del backend
import { apiFetch } from "../../../lib/apiClient"; 
import { API_BASE_URL } from "@env";
// >>> FIN NUEVO

import { initialValues, validationSchema } from "./ChangePhoneForm.data";
// Reutilizamos los mismos estilos
import { styles } from "./ChangePhoneForm.styles"; 

// Mapa de errores actualizado para incluir errores de teléfono
function mapFirebaseError(err) {
  const code = err?.code || "";
  const raw = err?.message;

  // Errores de tu backend (si 'err' no tiene 'code' pero sí 'message')
  if (!code && raw) {
    return { field: null, message: `Error del servidor: ${raw}` };
  }

  switch (code) {
    // Errores de Re-autenticación (Contraseña)
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/invalid-login-credentials":
      return { field: "password", message: "La contraseña no es correcta." };
    case "auth/too-many-requests":
      return { field: null, message: "Demasiados intentos. Esperá unos minutos." };
    case "auth/network-request-failed":
      return { field: null, message: "Problema de conexión. Verificá tu Internet." };
    
    // Errores de Verificación de Teléfono (SMS)
    case "auth/invalid-phone-number":
      return { field: "newPhone", message: "El número de teléfono no es válido." };
    case "auth/invalid-verification-code":
      return { field: "smsCode", message: "El código SMS es incorrecto." };
    case "auth/session-expired":
      return { field: "smsCode", message: "El código expiró. Solicitá uno nuevo." };

    default:
      return { field: null, message: raw || "Ocurrió un error inesperado." };
  }
}


export function ChangePhoneForm({ onClose, onReload }) {
  const [showPassword, setShowPassword] = useState(false);
  const [banner, setBanner] = useState(null); // { type: 'success'|'error', title, text }
  const timerRef = useRef(null);

  // --- Estados para el Modal de SMS ---
  const [isSmsModalVisible, setIsSmsModalVisible] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [smsCode, setSmsCode] = useState('');
  const [loadingModal, setLoadingModal] = useState(false);
  // Guardamos el número (10 dígitos) mientras se confirma
  const [phoneToConfirm, setPhoneToConfirm] = useState(''); 
  
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
    
    // 1. Este 'onSubmit' re-autentica Y envía el SMS
    onSubmit: async (values, { setSubmitting, setFieldError, resetForm }) => {
      setBanner(null); // Limpiar banner de error previo
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setBanner({ type: "error", title: "Sin sesión", text: "Iniciá sesión e intentá nuevamente." });
        setSubmitting(false);
        return;
      }

      // Validar que el usuario tenga un email/password para re-autenticar
      const isPasswordProvider = (currentUser.providerData || [])
        .map((p) => p.providerId)
        .includes("password");

      if (!isPasswordProvider || !currentUser.email) {
        setBanner({
          type: "error",
          title: "Método no permitido",
          text: "Solo podés cambiar tu teléfono si tu cuenta usa email y contraseña.",
        });
        setSubmitting(false);
        return;
      }

      // Validar si el teléfono es el mismo
      if (currentUser.phoneNumber === `+549${values.newPhone}`) {
         setFieldError("newPhone", "El número es igual al actual.");
         setSubmitting(false);
         return;
      }

      // --- PASO 1: Re-autenticar con contraseña ---
      try {
        const credential = EmailAuthProvider.credential(currentUser.email, values.password);
        await currentUser.reauthenticateWithCredential(credential);
      
      } catch (err) {
        console.log("[ChangePhoneForm] reauth error ->", err);
        const { field, message } = mapFirebaseError(err);
        if (field) setFieldError(field, message);
        setBanner({ type: "error", title: "No pudimos verificar tu identidad", text: message });
        setSubmitting(false);
        return;
      }

      // --- PASO 2: Enviar SMS de verificación al NUEVO número ---
      // (Si la re-autenticación fue exitosa)
      try {
        const fullPhoneNumber = `+549${values.newPhone}`;
        
        // Usamos signInWithPhoneNumber porque nos da el flow de 'confirmationResult'
        // que es más fácil de manejar que verifyPhoneNumber
        const confirmation = await auth.signInWithPhoneNumber(fullPhoneNumber);
        
        // <<< CAMBIO: Guardamos solo los 10 dígitos para el backend
        setPhoneToConfirm(values.newPhone); 
        // >>> FIN CAMBIO

        setConfirmationResult(confirmation);
        setIsSmsModalVisible(true); // Abrir el modal de SMS
        resetForm(); // Limpiar el formulario de fondo

      } catch (err) {
        console.log("[ChangePhoneForm] send SMS error ->", err);
        const { field, message } = mapFirebaseError(err);
        if (field) setFieldError(field, message);
        setBanner({ type: "error", title: "No pudimos enviar el SMS", text: message });
      } finally {
        setSubmitting(false);
      }
    },
  });


  // 2. Esta función confirma el código SMS y actualiza el teléfono
  const handleConfirmSmsCode = async () => {
    if (!confirmationResult || smsCode.length !== 6 || !auth.currentUser) return;
    
    setLoadingModal(true);
    setBanner(null);
    const currentUser = auth.currentUser;

    try {
      // 1. Crear la credencial del NUEVO teléfono
      const phoneCredential = PhoneAuthProvider.credential(
        confirmationResult.verificationId,
        smsCode
      );

      // 2. Desvincular el teléfono ANTERIOR (si existe)
      const oldPhoneProvider = currentUser.providerData.find(
        (p) => p.providerId === "phone"
      );
      if (oldPhoneProvider) {
        await currentUser.unlink(oldPhoneProvider.providerId);
      }

      // 3. Vincular la credencial del NUEVO teléfono
      await currentUser.linkWithCredential(phoneCredential);

      // 4. <<< NUEVO: Actualizar el teléfono en el backend
      await apiFetch(`${API_BASE_URL}/usuarios/me`, {
        method: "PUT",
        body: {
          // 'phoneToConfirm' ahora tiene los 10 dígitos
          telefono: phoneToConfirm, 
        },
      });
      // >>> FIN NUEVO

      // Éxito
      setLoadingModal(false);
      setIsSmsModalVisible(false);
      onReload?.(); // Refrescar la pantalla de perfil
      showBannerAndClose(
        {
          type: "success",
          title: "¡Teléfono actualizado!",
          // <<< CAMBIO: Ajustamos el texto de éxito
          text: `Tu nuevo número +549 ${phoneToConfirm} fue verificado y actualizado.`,
          // >>> FIN CAMBIO
        },
        5000
      );

    } catch (err) {
      // Este catch ahora atrapa errores de Firebase Y de tu backend
      console.log("[ChangePhoneForm] confirm/backend error ->", err);
      const { message } = mapFirebaseError(err);
      setLoadingModal(false);
      // Mostrar el error dentro del modal
      setBanner({ type: "error", title: "Error en la actualización", text: message });
    }
  };


  const handleCloseSmsModal = () => {
    setIsSmsModalVisible(false);
    setConfirmationResult(null);
    setSmsCode("");
    setLoadingModal(false);
    setBanner(null);
  };

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
      
      {/* === MODAL DE SMS === */}
      <Overlay
        isVisible={isSmsModalVisible}
        onBackdropPress={handleCloseSmsModal}
        overlayStyle={localStyles.smsOverlay}
      >
        <View>
          <View style={localStyles.closeButtonContainer}>
            <Icon
              type="material-community"
              name="close"
              onPress={handleCloseSmsModal}
              size={28}
              color="#8e8e93"
            />
          </View>

          <Text style={localStyles.modalTitle}>Verificar Nuevo Teléfono</Text>
          <Text style={localStyles.modalText}>
            {/* <<< CAMBIO: Ajustamos el texto del modal */}
            Ingresa el código de 6 dígitos que enviamos a +549 {phoneToConfirm}
            {/* >>> FIN CAMBIO */}
          </Text>
          
          <SmsCodeInput onCodeChange={setSmsCode} />
          
          {/* Banner de error DENTRO del modal */}
          {banner && banner.type === 'error' && (
            <View style={[localStyles.feedback, localStyles.error]}>
              <Icon type="material-community" name="alert-circle" color="#c62828" size={18} containerStyle={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <RNText style={localStyles.feedbackText}>{banner.text}</RNText>
              </View>
            </View>
          )}

          <Button
            title="Confirmar y Cambiar"
            containerStyle={{ marginTop: 20 }}
            buttonStyle={styles.btn} // Reutiliza el estilo del botón
            titleStyle={styles.btnTitle}
            onPress={handleConfirmSmsCode}
            loading={loadingModal}
            disabled={smsCode.length !== 6 || loadingModal}
          />
        </View>
      </Overlay>

      {/* === FORMULARIO PRINCIPAL === */}
      <Text key="title" h4 style={styles.title}>
        Cambiar número de teléfono
      </Text>

      <Input
        key="phone-input"
        placeholder="Nuevo teléfono (10 dígitos)"
        keyboardType="number-pad"
        maxLength={10}
        placeholderTextColor="#9e9e9e"
        containerStyle={styles.inputWrapper}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        onChangeText={(t) => formik.setFieldValue("newPhone", t)}
        errorMessage={formik.errors.newPhone}
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
        rightIcon={EyeIcon("eye-phone")}
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
            <RNText style={styles.btnTitle}>Verificar y enviar SMS</RNText>
          )}
        </TouchableOpacity>
      </View>

      {/* Banner de feedback (para éxito o error) */}
      {banner && banner.type === "success" && (
        <View style={[localStyles.feedback, localStyles.success]}>
          <Icon type="material-community" name="check-circle" color="#1e7e34" size={18} containerStyle={{ marginRight: 8 }}/>
          <View style={{ flex: 1 }}>
            <RNText style={localStyles.feedbackTitle}>{banner.title}</RNText>
            {!!banner.text && <RNText style={localStyles.feedbackText}>{banner.text}</RNText>}
          </View>
        </View>
      )}

      {/* Banner de error para el formulario principal (no del modal) */}
      {banner && banner.type === "error" && !isSmsModalVisible && (
        <View style={[localStyles.feedback, localStyles.error]}>
          <Icon type="material-community" name="alert-circle" color="#c62828" size={18} containerStyle={{ marginRight: 8 }}/>
          <View style={{ flex: 1 }}>
            <RNText style={localStyles.feedbackTitle}>{banner.title}</RNText>
            {!!banner.text && <RNText style={localStyles.feedbackText}>{banner.text}</RNText>}
          </View>
        </View>
      )}

    </View>
  );
}

// Estilos locales para el modal y los banners
const localStyles = StyleSheet.create({
  smsOverlay: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 14,
    padding: 20,
  },
  closeButtonContainer: {
    position: "absolute",
    top: -5,
    right: -5,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    color: "#424242",
    lineHeight: 21,
  },
  feedback: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    width: "95%",
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