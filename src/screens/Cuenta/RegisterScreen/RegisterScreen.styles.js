import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  image: {
    // El resizeMode "contain" asegura que la imagen se ajuste al contenedor sin distorsionarse
    resizeMode: "contain",
    width: "100%",
    height: 150,
    marginTop: 20,
  },
  content: {
    marginHorizontal: 40,
  },
});