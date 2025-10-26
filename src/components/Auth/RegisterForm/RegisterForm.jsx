import React, { useRef, useState, useEffect } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, Text, TouchableOpacity } from "react-native";
import { Input, Icon, Button, Overlay, CheckBox } from "react-native-elements";
import { useFormik } from "formik";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
  EmailAuthProvider,
  linkWithCredential,
  updateProfile,
  RecaptchaVerifier,
  createUserWithEmailAndPassword, // usado para asegurar proveedor email/clave si quisieras alternativa, pero aquí linkeamos
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { screen } from "../../../utils";
import { initialValues, validationSchema } from "./RegisterForm.data";
import { styles } from "./RegisterForm.styles";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../context/AuthContext";
import { apiFetch } from "../../../lib/apiClient";
import {
  API_BASE_URL,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} from "@env";
import { SmsCodeInput } from "../ModalSMS/SmsCodeInput";
import { TermsModal } from "../TermsModal/TermsModal";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false); // Estado para el checkbox
  const [showTermsModal, setShowTermsModal] = useState(false); // Estado para el modal T&C
  const navigation = useNavigation();
  const { setAuthToken } = useAuth();
  // Ref para el contenedor invisible del reCAPTCHA
  const recaptchaContainerRef = useRef(null);
  // Ref para guardar la instancia del verificador
  const recaptchaVerifierRef = useRef(null);

  // useEffect para inicializar el RecaptchaVerifier una vez
  useEffect(() => {
    const auth = getAuth();
    // Asegúrate de que el contenedor exista antes de crear el verificador
    if (recaptchaContainerRef.current) {
      const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, { // Usa el ref del contenedor
        size: 'invisible', // reCAPTCHA invisible
        // Puedes agregar callbacks si necesitas manejar errores específicos del reCAPTCHA
        // 'callback': (response) => { /* reCAPTCHA solved */ },
        // 'expired-callback': () => { /* Response expired */ }
      });

      // Renderiza el verificador (importante!) y guarda la instancia en el ref
      verifier.render().then((widgetId) => {
         console.log("reCAPTCHA widget rendered, ID:", widgetId);
         recaptchaVerifierRef.current = verifier; // Guarda la instancia
      }).catch(error => {
         console.error("Error rendering reCAPTCHA:", error);
         Toast.show({ type: 'error', text1: 'Error inicializando reCAPTCHA' });
         // Podrías deshabilitar el botón de submit aquí si falla
      });

      // Limpia el verificador cuando el componente se desmonte
      return () => {
        if (recaptchaVerifierRef.current) {
          recaptchaVerifierRef.current.clear(); // Limpia la instancia de reCAPTCHA
          recaptchaVerifierRef.current = null;
        }
      };
    }
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // reCAPTCHA + SMS
  const recaptchaVerifier = useRef(null);
  const [smsModalVisible, setSmsModalVisible] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [smsCode, setSmsCode] = useState("");
  const [sendingSMS, setSendingSMS] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);

  // Snapshot de datos antes de verificar
  const [pendingData, setPendingData] = useState(null);

  const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
  };

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
      // Asegúrate que el verificador esté listo antes de intentar enviar SMS
      if (!recaptchaVerifierRef.current) {
        Toast.show({ type: "error", text1: "El verificador reCAPTCHA no está listo." });
        setSubmitting(false);
        return;
      }

      try {
        const { telefono } = formValue;
        const local10 = onlyDigits(telefono);
        if (local10.length !== 10) {
          throw new Error("El teléfono debe tener 10 dígitos (sin 0 / 15 / +54).");
        }
        const phoneE164 = `+549${local10}`;

        setSendingSMS(true);
        const auth = getAuth();
        const provider = new PhoneAuthProvider(auth);

        // *** Pasa la instancia del ref al verifyPhoneNumber ***
        const vId = await provider.verifyPhoneNumber(phoneE164, recaptchaVerifierRef.current);

        // Guardamos datos del form para usarlos al confirmar el código
        setPendingData({
          ...formValue,
          telefonoLocal10: local10, // lo que guardaremos en tu backend
          telefonoE164: phoneE164,  // lo que usamos para Firebase
        });

        setVerificationId(vId);
        setSmsModalVisible(true);
      } catch (error) {
        console.error("Error en onSubmit (SMS):", error); // Log más detallado
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "No se pudo enviar el SMS",
          text2: error?.code === 'auth/captcha-check-failed'
                 ? "Falló la verificación reCAPTCHA. Intenta de nuevo."
                 : (error?.message ?? "Inténtalo más tarde"),
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
    const auth = getAuth();

    if (!verificationId || !smsCode || !pendingData) {
      Toast.show({ type: "error", text1: "Faltan datos para verificar" });
      return;
    }

    const { email, password, nombre, telefonoLocal10 /* , telefonoE164 */ } = pendingData;

    try {
      setVerifyingCode(true);

      // a) Verificar código: autentica usuario con proveedor "phone"
      const phoneCred = PhoneAuthProvider.credential(verificationId, smsCode);
      await signInWithCredential(auth, phoneCred);

      // b) Vincular email/contraseña a la misma cuenta
      const emailCred = EmailAuthProvider.credential(email, password);
      await linkWithCredential(auth.currentUser, emailCred);

      // c) Perfil de Firebase (displayName)
      await updateProfile(auth.currentUser, {
        displayName: nombre?.trim(),
      });

      // d) Token y Context
      const token = await auth.currentUser.getIdToken(true);
      await setAuthToken(token);

      // e) Backend: sync y PUT perfil
      await apiFetch(`${API_BASE_URL}/usuarios/sync`, {
        method: "POST",
        body: { uid: auth.currentUser.uid, email },
      });

      await apiFetch(`${API_BASE_URL}/usuarios/me`, {
        method: "PUT",
        body: {
          nombre: nombre?.trim(),
          // Guardamos en tu backend el local de 10 dígitos (como pediste)
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
      {/* Contenedor invisible para reCAPTCHA */}
      <View ref={recaptchaContainerRef} style={{ height: 0, width: 0 }} />

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

          {/* Teléfono: EXACTAMENTE 10 dígitos (sin 0 / 15 / +54) */}
          <Input
            placeholder="Teléfono (221453...)"
            containerStyle={styles.input}
            inputContainerStyle={styles.inputContainer}
            inputStyle={{ paddingLeft: 0 }}
            keyboardType="number-pad"
            maxLength={10}
            rightIcon={<Icon type="material-community" name="phone" iconStyle={styles.icon} />}
            onChangeText={(text) => {
              // fuerza solo dígitos y hasta 10
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

          {/* ========= NUEVO: Checkbox Términos y Condiciones ========= */}
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
          {/* ========================================================= */}


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
        // Asigna la nueva función al presionar fuera del modal
        onBackdropPress={handleCloseSmsModal}
        overlayStyle={styles.smsOverlay}
      >
        {/* Agrega el botón de cerrar aquí */}
        <View style={styles.closeButtonContainer}>
          <Icon
            type="material-community"
            name="close"
            onPress={handleCloseSmsModal}
            size={28}
            color="#8e8e93" // Un color sutil para el ícono
          />
        </View>

        <Text style={styles.modalTitle}>Verificar teléfono</Text>
        <Text style={styles.modalText}>
          Ingresa el código de 6 dígitos que recibiste por SMS.
        </Text>

        {/* Componente SMS */}
        <SmsCodeInput onCodeChange={setSmsCode} />

        <Button
          title={verifyingCode ? "Verificando..." : "Confirmar código"}
          onPress={confirmSmsCode}
          loading={verifyingCode}
          buttonStyle={[styles.buttonSMS, { marginTop: 8 }]}
          disabled={smsCode.length !== 6}
        />
      </Overlay>

      {/* ========= Modal Términos y Condiciones ========= */}
      <TermsModal
        isVisible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
      {/* ===================================================== */}
    </KeyboardAvoidingView>
  );
}
