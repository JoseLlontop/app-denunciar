import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, Text, StyleSheet } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { useFormik } from "formik";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { screen } from "../../../utils";
import { initialValues, validationSchema } from "./RegisterForm.data";
import { styles } from "./RegisterForm.styles";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, formValue.email, formValue.password);
        navigation.navigate(screen.cuenta.cuenta);
      } catch (error) {
        // handle error
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
          <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 8 }}>Crear cuenta</Text>

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