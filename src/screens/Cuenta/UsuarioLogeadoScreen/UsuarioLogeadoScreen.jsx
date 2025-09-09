import React, { useState } from "react";
import { SafeAreaView, ScrollView, View, Alert } from "react-native";
import { Button, Card } from "react-native-elements";
import { getAuth, signOut } from "firebase/auth";
import { LoadingModal } from "../../../components";
import { InfoUser, AccountOptions } from "../../../components/Account";
import { styles } from "./UserLoggedScreen.styles";

export function UserLoggedScreen() {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [_, setReload] = useState(false);

  const onReload = () => setReload((prevState) => !prevState);

  const logout = async () => {
    // Confirmación antes de cerrar sesión
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que querés cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              setLoadingText("Cerrando sesión...");
              setLoading(true);
              const auth = getAuth();
              await signOut(auth);
              // no hacemos navigation aquí, el flujo de autenticación debería redirigir
            } catch (error) {
              console.log("Logout error:", error);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Información del usuario (avatar, nombre, email) */}
        <InfoUser setLoading={setLoading} setLoadingText={setLoadingText} />

        {/* Opciones de cuenta (lista de settings / acciones) */}
        <Card containerStyle={styles.cardOptions}>
          <AccountOptions onReload={onReload} />
        </Card>

        {/* Zona del botón de Cerrar sesión: ocupa el ancho y visualmente separada */}
        <View style={styles.logoutWrapper}>
          <Button
            title="Cerrar sesión"
            onPress={logout}
            containerStyle={styles.btnContainer}
            buttonStyle={styles.btnStyles}
            titleStyle={styles.btnTextStyle}
          />
        </View>
      </ScrollView>

      {/* Modal de carga global usado por InfoUser (subida avatar, etc.) */}
      <LoadingModal show={loading} text={loadingText} />
    </SafeAreaView>
  );
}
