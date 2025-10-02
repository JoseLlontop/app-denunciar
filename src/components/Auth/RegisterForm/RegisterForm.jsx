import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, Text } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { useFormik } from "formik";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { screen } from "../../../utils";
import { initialValues, validationSchema } from "./RegisterForm.data";
import { styles } from "./RegisterForm.styles";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../context/AuthContext";
import { apiFetch } from "../../../lib/apiClient";
import { API_BASE_URL } from "@env";

export function RegisterForm() {

  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const { setAuthToken } = useAuth();

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const auth = getAuth();
        const { email, password } = formValue;

        // 1) Crear usuario (ya queda autenticado)
        const { user } = await createUserWithEmailAndPassword(auth, email, password);

        // 2) Obtener token (opcional; tu apiClient también lo pedirá)
        const token = await user.getIdToken();
        console.log("el token es", token);

        // 3) Guardar token en contexto (opcional, está bien)
        await setAuthToken(token);

        // 4) Llamar backend con apiFetch (NO usar res.ok)
        await apiFetch(`${API_BASE_URL}/usuarios/sync`, {
          method: "POST",
          body: { uid: user.uid, email: user.email },
        });

        // Si llegó aquí, fue 2xx
        Toast.show({ type: "success", position: "bottom", text1: "Registro exitoso" });
        navigation.navigate(screen.cuenta.cuenta);
      } catch (error) {
        console.error(error);
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error al registrarse",
          text2: error?.message ?? "Inténtalo más tarde",
        });
      }
    },
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 10, textAlign: "center", padding:4 }}>
            Crear Cuenta
          </Text>

          <Input
            placeholder="Correo electrónico"
            containerStyle={styles.input}
            inputContainerStyle={styles.inputContainer}
            inputStyle={{ paddingLeft: 0 }}
            rightIcon={<Icon type="material-community" name="at" iconStyle={styles.icon} />}
            onChangeText={(text) => formik.setFieldValue("email", text)}
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
                name={showPassword ? "eye-off" : "eye"}
                iconStyle={styles.icon}
                onPress={togglePassword}
              />
            }
            onChangeText={(text) => formik.setFieldValue("password", text)}
            errorMessage={formik.errors.password}
          />

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
                onPress={togglePassword}
              />
            }
            onChangeText={(text) => formik.setFieldValue("repeatPassword", text)}
            errorMessage={formik.errors.repeatPassword}
          />

          <View style={styles.buttonContainer}>
            <Button
              titleStyle={styles.buttonTitle}
              buttonStyle={styles.button}
              onPress={formik.handleSubmit}
              loading={formik.isSubmitting}
              title="Unirse"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
