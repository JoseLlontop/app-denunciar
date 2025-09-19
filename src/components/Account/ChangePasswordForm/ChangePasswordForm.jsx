import React, { useState } from "react";
import { View, TouchableOpacity, ActivityIndicator, Text as RNText } from "react-native";
import { Input, Text, Icon } from "react-native-elements";
import { useFormik } from "formik";
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import Toast from "react-native-toast-message";
import { initialValues, validationSchema } from "./ChangePasswordForm.data";
import { styles } from "./ChangePasswordForm.styles";

export function ChangePasswordForm({ onClose }) {
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
        await updatePassword(currentUser, formValue.newPassword);
        onClose?.();
      } catch {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error al cambiar la contraseña",
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
        Cambiar contraseña
      </Text>

      <Input
        key="current-password"
        placeholder="Contraseña actual"
        containerStyle={styles.inputWrapper}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        secureTextEntry={!showPassword}
        rightIcon={EyeIcon("eye-current")}
        onChangeText={(t) => formik.setFieldValue("password", t)}
        errorMessage={formik.errors.password}
        errorStyle={styles.error}
      />

      <Input
        key="new-password"
        placeholder="Nueva contraseña"
        containerStyle={styles.inputWrapper}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        secureTextEntry={!showPassword}
        rightIcon={EyeIcon("eye-new")}
        onChangeText={(t) => formik.setFieldValue("newPassword", t)}
        errorMessage={formik.errors.newPassword}
        errorStyle={styles.error}
      />

      <Input
        key="confirm-password"
        placeholder="Repite nueva contraseña"
        containerStyle={styles.inputWrapper}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        secureTextEntry={!showPassword}
        rightIcon={EyeIcon("eye-confirm")}
        onChangeText={(t) => formik.setFieldValue("confirmNewPassword", t)}
        errorMessage={formik.errors.confirmNewPassword}
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
            <RNText style={styles.btnTitle}>Cambiar contraseña</RNText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
