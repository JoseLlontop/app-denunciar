import React from "react";
import { View } from "react-native";
import { Image } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RegisterForm } from "../../../components/Auth/RegisterForm/RegisterForm";
import { styles } from "./RegisterScreen.styles";

export function RegisterScreen() {
  return (
    // Sirve para que el teclado no tape los inputs
    <KeyboardAwareScrollView>
      <Image
        source={require("../../../../assets/login/imagen-login.png")}
        style={styles.image}
      />
      <View style={styles.content}>
        <RegisterForm />
      </View>
    </KeyboardAwareScrollView>
  );
}