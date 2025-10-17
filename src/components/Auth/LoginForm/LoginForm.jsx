import React, { useState } from 'react';
import { View } from 'react-native';
import { Input, Icon, Button, Card, Text } from 'react-native-elements';
import { useFormik } from 'formik';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { screen } from '../../../utils';
import { initialValues, validationSchema } from './LoginForm.data';
import { styles } from './LoginForm.styles';
// Importaciones añadidas para la llamada al backend
import { apiFetch } from '../../../lib/apiClient';
import { API_BASE_URL } from "@env";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const onShowHidePassword = () => setShowPassword(prev => !prev);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        // 1. Autenticar al usuario con Firebase
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, values.email, values.password);

        // 2. Llamar a tu backend para actualizar 'ultimo_login'
        // La función apiFetch ya se encarga de obtener y enviar el token de autorización.
        await apiFetch(`${API_BASE_URL}/usuarios/login`, {
          method: "POST",
          // No se necesita 'body' según tu requerimiento.
        });
        
        // 3. Navegar a la pantalla de perfil si todo fue exitoso
        navigation.navigate(screen.cuenta.perfil);

      } catch (error) {
        // El bloque catch captura errores tanto de Firebase como de tu API.
        console.error("Error en el inicio de sesión:", error);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Correo o contraseña incorrectos',
          text2: 'Por favor, verifica tus datos e inténtalo de nuevo.'
        });
      }
    }
  });

  return (
    <Card containerStyle={styles.card}>
      <View style={styles.content}>
        <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 10, textAlign: "center", padding:4 }}>
        Iniciar Sesión
      </Text>
        <Input
          placeholder="Correo electrónico"
          containerStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
          rightIcon={<Icon type="material-community" name="at" iconStyle={styles.icon} />}
          onChangeText={text => formik.setFieldValue('email', text)}
          errorMessage={formik.errors.email}
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
          onChangeText={text => formik.setFieldValue('password', text)}
          errorMessage={formik.errors.password}
        />

        <Button
          title="Iniciar sesión"
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          titleStyle={styles.btnTitle}
          onPress={formik.handleSubmit}
          loading={formik.isSubmitting}
        />
      </View>
    </Card>
  );
}