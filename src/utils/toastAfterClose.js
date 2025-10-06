import { InteractionManager, Platform } from "react-native";
import Toast from "react-native-toast-message";

/**
 * Cierra el modal y, tras finalizar animaciones + un pequeño delay, muestra el toast.
 * El delay ayuda a evitar que el backdrop gris siga visible al momento de pintar el toast.
 */
export function toastAfterClose(closeModal, toastProps, delayMs = Platform.OS === "ios" ? 120 : 180) {
  // 1) cerrar el modal controlado por el padre
  closeModal?.();

  // 2) esperar a que React Native termine las animaciones/transiciones pendientes
  InteractionManager.runAfterInteractions(() => {
    setTimeout(() => {
      Toast.show({ position: "top", ...toastProps });
    }, delayMs);
  });
}