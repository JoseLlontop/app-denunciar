import React from "react";
import { View, TouchableOpacity, ActivityIndicator, Text as RNText } from "react-native";
import { Input, Text, Icon } from "react-native-elements";
import { useFormik } from "formik";

import { auth } from "../../../utils/firebase";

import Toast from "react-native-toast-message";
import { initialValues, validationSchema } from "./ChangeDisplayNameForm.data";
import { styles } from "./ChangeDisplayNameForm.styles";
// Importaciones añadidas para la llamada al backend
import { apiFetch } from "../../../lib/apiClient"; 
import { API_BASE_URL } from "@env";

export function ChangeDisplayNameForm({ onClose, onReload }) {
  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async ({ displayName }) => {
      try {
        // 2. CAMBIO: Usamos 'auth' importada
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
            Toast.show({ type: "error", text1: "Error", text2: "No se encontró la sesión de usuario." });
            return;
        }

        // 3. CAMBIO: 'updateProfile' es un método de 'currentUser'
        await currentUser.updateProfile({ displayName });

        // 2. Actualizar el nombre en tu backend (Esto estaba bien)
        await apiFetch(`${API_BASE_URL}/usuarios/me`, {
          method: "PUT",
          body: {
            nombre: displayName,
          },
        });

        // 3. Recargar y cerrar (Esto estaba bien)
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Tu perfil se actualizará cuando vuelvas a iniciar sesión.",
        });
        
        onReload?.();
        onClose?.();
      } catch (error) {
        console.error("Error al actualizar el nombre:", error);
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error al cambiar el nombre",
          text2: "Inténtalo de nuevo más tarde.",
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