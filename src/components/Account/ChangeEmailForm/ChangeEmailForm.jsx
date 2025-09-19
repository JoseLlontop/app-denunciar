import React, { useState } from "react";
import { View, TouchableOpacity, ActivityIndicator, Text as RNText } from "react-native";
import { Input, Text, Icon } from "react-native-elements";
import { useFormik } from "formik";
import {
  getAuth,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import Toast from "react-native-toast-message";
import { initialValues, validationSchema } from "./ChangeEmailForm.data";
import { styles } from "./ChangeEmailForm.styles";

export function ChangeEmailForm({ onClose, onReload }) {
  const [showPassword, setShowPassword] = useState(false);
  const onShowPassword = () => setShowPassword((prev) => !prev);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const currentUser = getAuth().currentUser;
        const credentials = EmailAuthProvider.credential(
          currentUser.email,
          formValue.password
        );
        await reauthenticateWithCredential(currentUser, credentials);
        await updateEmail(currentUser, formValue.email);
        onReload?.();
        onClose?.();
      } catch {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error al cambiar el email",
        });
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
        placeholder="Contraseña"
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
          style={styles.btn}
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
    </View>
  );
}
