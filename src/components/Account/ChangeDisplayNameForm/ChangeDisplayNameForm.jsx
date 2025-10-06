import React from "react";
import { View, TouchableOpacity, ActivityIndicator, Text as RNText } from "react-native";
import { Input, Text, Icon } from "react-native-elements";
import { useFormik } from "formik";
import { getAuth, updateProfile } from "firebase/auth";
import Toast from "react-native-toast-message";
import { initialValues, validationSchema } from "./ChangeDisplayNameForm.data";
import { styles } from "./ChangeDisplayNameForm.styles";

export function ChangeDisplayNameForm({ onClose, onReload }) {
  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async ({ displayName }) => {
      try {
        const currentUser = getAuth().currentUser;
        await updateProfile(currentUser, { displayName });
        onReload?.();
        onClose?.();
      } catch {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error al cambiar el nombre y apellidos",
        });
      }
    },
  });

  return (
    <View style={styles.content}>
      <Text key="title" h4 style={styles.title}>
        Cambiar nombre y apellidos
      </Text>

      <Input
        key="displayname-input"
        placeholder="Nombre y apellidos"
        rightIcon={
          <Icon
            key="acc-right"
            type="material-community"
            name="account-circle-outline"
            color="#9e9e9e"
          />
        }
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        containerStyle={styles.inputWrapper}
        errorStyle={styles.error}
        onChangeText={(t) => formik.setFieldValue("displayName", t)}
        errorMessage={formik.errors.displayName}
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
            <RNText style={styles.btnTitle}>Guardar cambios</RNText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
