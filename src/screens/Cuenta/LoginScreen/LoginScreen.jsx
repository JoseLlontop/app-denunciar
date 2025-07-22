import { View, ScrollView } from "react-native";
import { Text, Image } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
// import { LoginForm } from "../../../components/Auth/LoginForm/LoginForm";
import { screen } from "../../../utils";
import { styles } from "./LoginScreen.styles";

export function LoginScreen() {
  const navigation = useNavigation();

  // Función para navegar a la pantalla de registro
  const goToRegister = () => {
    navigation.navigate(screen.cuenta.register);
  };

  return (
    <ScrollView>
      <Image
        source={require("../../../../assets/login/imagen-login.png")}
        style={styles.image}
      />
      <View style={styles.content}>
        {/* <LoginForm /> */}

        <Text style={styles.textRegister}>
          ¿Aún no tienes cuenta{" "}
          <Text style={styles.btnRegister} onPress={goToRegister}>
            Regístrarse
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}