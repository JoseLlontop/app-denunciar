import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Input, Icon, Button, Card, Text, Overlay } from 'react-native-elements'; 
import { useFormik } from 'formik';

import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPhoneNumber 
} from '@react-native-firebase/auth';

import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { screen } from '../../../utils';
import { initialValues, validationSchema } from './LoginForm.data';
import { styles } from './LoginForm.styles';
import { apiFetch } from '../../../lib/apiClient';
import { API_BASE_URL } from "@env"; 
import { SmsCodeInput } from '../ModalSMS/SmsCodeInput'; 

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const onShowHidePassword = () => setShowPassword(prev => !prev);
  
  const [loginMethod, setLoginMethod] = useState('email');
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSmsModalVisible, setIsSmsModalVisible] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [smsCode, setSmsCode] = useState('');
  
  const formikEmail = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, values.email, values.password);
        
        await apiFetch(`${API_BASE_URL}/usuarios/login`, { method: "POST" });
        
        navigation.navigate(screen.cuenta.perfil);

      } catch (error) {
        let errorMsg = 'Error al iniciar sesión';
        // ... (manejo de errores de email)
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          errorMsg = 'Email o contraseña incorrectos';
        } else if (error.message.includes("Not authenticated")) {
          errorMsg = 'Error de autenticación con el servidor.';
        } else {
          console.error("Error en login con email:", error);
        }
        
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: errorMsg,
        });
      }
      setLoading(false);
    }
  });

  const handleCloseSmsModal = () => {
    setIsSmsModalVisible(false);
    setConfirmationResult(null);
    setSmsCode("");
    Toast.show({
      type: "info",
      position: "bottom",
      text1: "Verificación cancelada",
    });
  };

  const handleSendSmsCode = async () => {
    if (phoneNumber.length !== 10) {
      Toast.show({ type: 'error', text1: 'Ingresa un teléfono de 10 dígitos' });
      return;
    }
    
    setLoading(true);
    console.log("[Login Teléfono] Intentando enviar SMS...");
    try {
      const fullPhoneNumber = `+549${phoneNumber}`;
      console.log(`[Login Teléfono] Número formateado: ${fullPhoneNumber}`);

      const auth = getAuth();
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber);
      
      console.log("[Login Teléfono] SMS enviado, esperando confirmación.");
      setConfirmationResult(confirmation);
      setIsSmsModalVisible(true);
      Toast.show({ type: 'success', text1: 'SMS enviado correctamente' });

    } catch (error) {
      console.error("===== ERROR DETALLADO DE FIREBASE (Login Teléfono) =====");
      console.error(error); // <--- ESTO ES LO MÁS IMPORTANTE
      console.error("Código de Error:", error.code);
      console.error("Mensaje de Error:", error.message);
      console.error("======================================================");

      let errorMsg = 'Error al enviar el SMS. Inténtalo de nuevo.';
      
      // Manejo de errores específico basado en el código
      if (error.code === 'auth/too-many-requests') {
        errorMsg = 'Bloqueo temporal. Demasiados intentos.';
      } else if (error.code === 'auth/invalid-phone-number') {
        errorMsg = 'El número de teléfono no es válido.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMsg = 'Error de red. Revisa tu conexión a internet.';
      } else if (error.message && error.message.toLowerCase().includes('app-not-authorized')) {
        // Este es el error de SHA-1 o App Check que te mencioné
        errorMsg = 'App no autorizada. Revisa la config. SHA-1 y App Check.';
      } else if (error.code === 'auth/unknown') {
         errorMsg = 'Error desconocido. Revisa la consola de Metro.';
      }
      
      Toast.show({ type: 'error', text1: errorMsg });
    }
    setLoading(false);
  };

  const handleConfirmSmsCode = async () => {
    if (!confirmationResult || smsCode.length !== 6) return;
    
    setLoading(true);
    try {
      await confirmationResult.confirm(smsCode);
      
      setIsSmsModalVisible(false);
      setSmsCode("");

      await apiFetch(`${API_BASE_URL}/usuarios/login`, { method: "POST" });
      
      navigation.navigate(screen.cuenta.perfil);

    } catch (error) {
      console.error("Error al confirmar código:", error);
      let errorMsg = 'Código incorrecto';
      if(error.code === 'auth/invalid-verification-code') {
        errorMsg = 'El código que ingresaste es incorrecto.';
      } else if (error.code === 'auth/session-expired') {
        errorMsg = 'El código expiró. Por favor, solicita uno nuevo.';
      }
      Toast.show({ type: 'error', text1: errorMsg });
    }
    setLoading(false);
  };

  // --- Vistas de Formulario (Sin cambios) ---
  const renderEmailForm = () => (
    <>
      <Input
        placeholder="Correo electrónico"
        containerStyle={styles.input}
        inputContainerStyle={styles.inputContainer}
        rightIcon={<Icon type="material-community" name="at" iconStyle={styles.icon} />}
        onChangeText={text => formikEmail.setFieldValue('email', text)}
        errorMessage={formikEmail.errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.input}
        inputContainerStyle={styles.inputContainer}
        secureTextEntry={!showPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onPress={onShowHidePassword}
            iconStyle={styles.icon}
          />
        }
        onChangeText={text => formikEmail.setFieldValue('password', text)}
        errorMessage={formikEmail.errors.password}
      />
      <Button
        title="Iniciar sesión"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        titleStyle={styles.btnTitle}
        onPress={formikEmail.handleSubmit}
        loading={loading}
      />
    </>
  );

  const renderPhoneForm = () => (
    <>
      <Input
        placeholder="Teléfono (10 dígitos)"
        containerStyle={styles.input}
        inputContainerStyle={styles.inputContainer}
        rightIcon={<Icon type="material-community" name="phone" iconStyle={styles.icon} />}
        keyboardType="number-pad"
        maxLength={10}
        onChangeText={text => setPhoneNumber(text)}
        value={phoneNumber}
      />
      <Button
        title="Enviar código SMS"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        titleStyle={styles.btnTitle}
        onPress={handleSendSmsCode}
        loading={loading}
      />
    </>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <Overlay
        isVisible={isSmsModalVisible}
        onBackdropPress={handleCloseSmsModal}
        overlayStyle={styles.smsOverlay}
      >
        <View>
          <View style={styles.closeButtonContainer}>
            <Icon
              type="material-community"
              name="close"
              onPress={handleCloseSmsModal}
              size={28}
              color="#8e8e93"
            />
          </View>

          <Text style={styles.modalTitle}>Verificar Teléfono</Text>
          <Text style={styles.modalText}>
            Ingresa el código de 6 dígitos que enviamos a +54 9 {phoneNumber}
          </Text>
          
          <SmsCodeInput onCodeChange={setSmsCode} />
          
          <Button
            title="Confirmar código"
            containerStyle={{ marginTop: 20 }}
            buttonStyle={styles.buttonSMS}
            onPress={handleConfirmSmsCode}
            loading={loading}
            disabled={smsCode.length !== 6}
          />
        </View>
      </Overlay>

      <Card containerStyle={styles.card}>
        <View style={styles.content}>
          <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 10, textAlign: "center", padding:4 }}>
            Iniciar Sesión
          </Text>
          
          {loginMethod === 'email' ? renderEmailForm() : renderPhoneForm()}

          <TouchableOpacity 
            style={{ marginTop: 20 }} 
            onPress={() => {
              setLoginMethod(loginMethod === 'email' ? 'phone' : 'email');
              formikEmail.resetForm();
              setPhoneNumber('');
            }}
          >
            <Text style={{ color: '#00a680', fontWeight: '600', marginBottom: 4 }}>
              {loginMethod === 'email' ? 'Iniciar sesión con Teléfono' : 'Iniciar sesión con Email'}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    
    </KeyboardAvoidingView>
  );
}

