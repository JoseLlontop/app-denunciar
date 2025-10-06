import React, { useState } from "react";
import { ScrollView, View, Text, Modal, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../../utils/firebase";
import { signOut } from "firebase/auth";
import { LoadingModal } from "../../../components/Shared";
import { InfoUser, AccountOptions } from "../../../components/Account";
import { styles } from "./UsuarioLogeadoScreen.styles";
import { useNavigation } from "@react-navigation/native";
import { screen } from "../../../utils";

export function UsuarioLogeadoScreen() {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [_, setReload] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const navigation = useNavigation();

  const onReload = () => setReload((prev) => !prev);

  const handleConfirmLogout = async () => {
    try {
      setConfirmVisible(false);
      setLoadingText("Cerrando sesión...");
      setLoading(true);
      await signOut(auth);
      navigation.navigate(screen.cuenta.login);
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Información del usuario */}
        <InfoUser setLoading={setLoading} setLoadingText={setLoadingText} />

        {/* Opciones de cuenta (reemplaza Card por View para evitar PadView) */}
        <View style={styles.cardOptions}>
          <AccountOptions onReload={onReload} />
        </View>

        {/* Botón de Cerrar sesión */}
        <View style={styles.logoutWrapper}>
          <TouchableOpacity
            style={styles.btnTouchable}
            activeOpacity={0.7}
            onPress={() => setConfirmVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
          >
            <Text style={styles.btnTextStyle}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de confirmación estilado */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Cerrar sesión</Text>
            <Text style={styles.modalMessage}>
              ¿Estás seguro de que querés cerrar sesión?
            </Text>

            <View style={styles.modalActions}>
              {/* Botón cancelar */}
              <TouchableOpacity
                onPress={() => setConfirmVisible(false)}
                style={[styles.modalBtnContainer, styles.modalBtnContainerLeft]}
                activeOpacity={0.85}
              >
                <View style={[styles.modalBtn, styles.modalBtnSecondary]}>
                  <Text style={styles.modalBtnSecondaryText}>Cancelar</Text>
                </View>
              </TouchableOpacity>

              {/* Botón confirmar */}
              <TouchableOpacity
                onPress={handleConfirmLogout}
                style={[styles.modalBtnContainer, styles.modalBtnContainerRight]}
                activeOpacity={0.85}
              >
                <View style={[styles.modalBtn, styles.modalBtnDanger]}>
                  <Text style={styles.modalBtnDangerText}>Cerrar sesión</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <LoadingModal show={loading} text={loadingText} />
    </SafeAreaView>
  );
}
