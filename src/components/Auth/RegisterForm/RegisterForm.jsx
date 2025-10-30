import React, { useRef, useState, useEffect } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, Text, TouchableOpacity } from "react-native";
import { Input, Icon, Button, Overlay, CheckBox } from "react-native-elements";
import { useFormik } from "formik";

import { auth } from "../../../utils/firebase";
import {
  PhoneAuthProvider,
  EmailAuthProvider,
} from "@react-native-firebase/auth"; // <--- Importado de @react-native-firebase/auth

import { useNavigation } from "@react-navigation/native";
import { screen } from "../../../utils";
import { initialValues, validationSchema } from "./RegisterForm.data";
import { styles } from "./RegisterForm.styles";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../context/AuthContext";
import { apiFetch } from "../../../lib/apiClient";

// Solo dejamos la que sí usas (API_BASE_URL)
import { API_BASE_URL } from "@env";
import { SmsCodeInput } from "../ModalSMS/SmsCodeInput";
import { TermsModal } from "../TermsModal/TermsModal";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const navigation = useNavigation();
  const { setAuthToken } = useAuth();

  // Estado para el flujo SMS
  const [smsModalVisible, setSmsModalVisible] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [smsCode, setSmsCode] = useState("");
  const [sendingSMS, setSendingSMS] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);

  // Snapshot de datos antes de verificar
  const [pendingData, setPendingData] = useState(null);

  const handleCloseSmsModal = () => {
    setSmsModalVisible(false);
    setVerificationId(null);
    setSmsCode("");
    setPendingData(null);
    Toast.show({
      type: "info",
      position: "bottom",
      text1: "Verificación cancelada",
    });
  };

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue, { setSubmitting }) => {
      // 5. CAMBIO EN ONSUBMIT:
      // Eliminada la comprobación de 'recaptchaVerifierRef.current'

      try {
        const { telefono } = formValue;
        const local10 = onlyDigits(telefono);
        if (local10.length !== 10) {
          throw new Error("El teléfono debe tener 10 dígitos (sin 0 / 15 / +54).");
        }
        const phoneE164 = `+549${local10}`;

        setSendingSMS(true);
        
        // Usamos el mismo método nativo que LoginForm.
        // Esto maneja SafetyNet/Play Integrity (Android) o APNs (iOS) automáticamente.
        const confirmation = await auth.signInWithPhoneNumber(phoneE164);
        
        // Guardamos el verificationId del resultado de confirmación.
        // Lo necesitamos para el 'confirmSmsCode'
        const vId = confirmation.verificationId;

        // Guardamos datos del form para usarlos al confirmar el código
        setPendingData({
          ...formValue,
          telefonoLocal10: local10, 
          telefonoE164: phoneE164,
        });

        setVerificationId(vId);
        setSmsModalVisible(true);
      } catch (error) {
        console.error("Error en onSubmit (SMS):", error);
        // Los errores de 'captcha-check-failed' ya no aplican.
        // Los nuevos errores serán como los de LoginForm (auth/too-many-requests, etc.)
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "No se pudo enviar el SMS",
          text2: (error?.message ?? "Inténtalo más tarde"),
        });
      } finally {
        setSendingSMS(false);
        setSubmitting(false);
      }
    },
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  // Confirmación del código SMS
  const confirmSmsCode = async () => {

    if (!verificationId || !smsCode || !pendingData) {
      Toast.show({ type: "error", text1: "Faltan datos para verificar" });
      return;
    }

    const { email, password, nombre, telefonoLocal10 } = pendingData;

    try {
      setVerifyingCode(true);

      // a) Verificar código: (Esto estaba bien, solo la importación estaba mal)
      const phoneCred = PhoneAuthProvider.credential(verificationId, smsCode);
      await auth.signInWithCredential(phoneCred);

      // b) Vincular email/contraseña: (Esto estaba bien, solo importación mal)
      const emailCred = EmailAuthProvider.credential(email, password);
      // CAMBIO: 'linkWithCredential' es un método de 'auth.currentUser'
      await auth.currentUser.linkWithCredential(emailCred);

      // c) Perfil de Firebase (displayName)
      await auth.currentUser.updateProfile({
        displayName: nombre?.trim(),
      });

      // d) Token y Context
      const token = await auth.currentUser.getIdToken(true);
      await setAuthToken(token);

      // e) Backend: sync y PUT perfil (Esto estaba bien)
      await apiFetch(`${API_BASE_URL}/usuarios/sync`, {
        method: "POST",
        body: { uid: auth.currentUser.uid, email },
      });

      await apiFetch(`${API_BASE_URL}/usuarios/me`, {
        method: "PUT",
        body: {
          nombre: nombre?.trim(),
          telefono: telefonoLocal10,
        },
      });

      setSmsModalVisible(false);
      setSmsCode("");
      setPendingData(null);

      Toast.show({ type: "success", text1: "Cuenta creada y teléfono verificado" });
      navigation.navigate(screen.cuenta.cuenta);
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "No se pudo verificar / crear la cuenta",
        text2: err?.message ?? "",
      });
    } finally {
      setVerifyingCode(false);
    }
  };

  function onlyDigits(s = "") {
    return String(s).replace(/\D+/g, "");
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={{ fontSize: 24, fontWeight: "500", marginBottom: 10, textAlign: "center", padding: 4 }}>
            Crear Cuenta
          </Text>

          {/* Nombre */}
          <Input
            placeholder="Nombre"
            containerStyle={styles.input}
            inputContainerStyle={styles.inputContainer}
            inputStyle={{ paddingLeft: 0 }}
            rightIcon={<Icon type="material-community" name="account" iconStyle={styles.icon} />}
            onChangeText={(text) => formik.setFieldValue("nombre", text)}
            errorMessage={formik.errors.nombre}
          />

          {/* Teléfono */}
          <Input
            placeholder="Teléfono (221453...)"
            containerStyle={styles.input}
            inputContainerStyle={styles.inputContainer}
            inputStyle={{ paddingLeft: 0 }}
            keyboardType="number-pad"
            maxLength={10}
            rightIcon={<Icon type="material-community" name="phone" iconStyle={styles.icon} />}
            onChangeText={(text) => {
              const digits = text.replace(/\D+/g, "").slice(0, 10);
              formik.setFieldValue("telefono", digits);
            }}
            value={formik.values.telefono}
            errorMessage={formik.errors.telefono}
          />

          {/* Email */}
          <Input
            placeholder="Correo electrónico"
            containerStyle={styles.input}
            inputContainerStyle={styles.inputContainer}
            inputStyle={{ paddingLeft: 0 }}
            rightIcon={<Icon type="material-community" name="at" iconStyle={styles.icon} />}
            onChangeText={(text) => formik.setFieldValue("email", text)}
            errorMessage={formik.errors.email}
            autoCapitalize="none"
          />

          {/* Password */}
          <Input
            placeholder="Contraseña"
            containerStyle={styles.input}
            inputContainerStyle={styles.inputContainer}
            secureTextEntry={!showPassword}
            rightIcon={
              <Icon
                type="material-community"
                name={showPassword ? "eye-off" : "eye"}
                iconStyle={styles.icon}
                onPress={() => setShowPassword((p) => !p)}
              />
            }
            onChangeText={(text) => formik.setFieldValue("password", text)}
            errorMessage={formik.errors.password}
            autoCapitalize="none"
          />

          {/* Repeat Password */}
          <Input
            placeholder="Repetir contraseña"
            containerStyle={styles.input}
            inputContainerStyle={styles.inputContainer}
            secureTextEntry={!showPassword}
            rightIcon={
              <Icon
                type="material-community"
                name={showPassword ? "eye-off" : "eye"}
                iconStyle={styles.icon}
                onPress={() => setShowPassword((p) => !p)}
              />
            }
            onChangeText={(text) => formik.setFieldValue("repeatPassword", text)}
            errorMessage={formik.errors.repeatPassword}
            autoCapitalize="none"
          />

          {/* Checkbox Términos y Condiciones */}
          <View style={styles.termsContainer}>
            <CheckBox
              checked={acceptTerms}
              onPress={() => setAcceptTerms((prev) => !prev)}
              containerStyle={styles.checkboxContainer}
              size={22}
            />
            <TouchableOpacity onPress={() => setShowTermsModal(true)}>
              <Text style={styles.termsText}>
                Acepto{" "}
                <Text style={styles.termsLink}>Términos y Condiciones</Text>
              </Text>
            </TouchableOpacity>
          </View>


        <View style={styles.buttonContainer}>
            <Button
              titleStyle={styles.buttonTitle}
              buttonStyle={styles.buttonUnirse} 
              onPress={formik.handleSubmit}
              loading={formik.isSubmitting || sendingSMS}
              title="Unirse"
              disabled={!acceptTerms || formik.isSubmitting || sendingSMS}
              disabledStyle={styles.buttonUnirseDisabled}
              disabledTitleStyle={styles.buttonTitleDisabled}
            />
          </View>
        </View>
      </ScrollView>

    {/* Modal para ingresar el código SMS */}
      <Overlay
        isVisible={smsModalVisible}
        onBackdropPress={handleCloseSmsModal}
        overlayStyle={styles.smsOverlay}
      >
        <View style={styles.closeButtonContainer}>
          <Icon
            type="material-community"
            name="close"
            onPress={handleCloseSmsModal}
            size={28}
            color="#8e8e93" 
          />
        </View>

        <Text style={styles.modalTitle}>Verificar teléfono</Text>
        <Text style={styles.modalText}>
          Ingresa el código de 6 dígitos que recibiste por SMS.
        </Text>

        <SmsCodeInput onCodeChange={setSmsCode} />

        <Button
          title={verifyingCode ? "Verificando..." : "Confirmar código"}
          onPress={confirmSmsCode}
          loading={verifyingCode}
          buttonStyle={[styles.buttonSMS, { marginTop: 8 }]}
          disabled={smsCode.length !== 6}
        />
      </Overlay>

      {/* Modal Términos y Condiciones */}
      <TermsModal
        isVisible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </KeyboardAvoidingView>
  );
}