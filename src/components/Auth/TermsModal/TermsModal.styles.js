import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  overlay: {
    width: "90%",
    height: height * 0.75, // Ocupa el 75% de la altura
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
  },
  closeButtonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
  title: {
    fontSize: 21,
    fontWeight: "600",
    marginBottom: 16,
    color: "#121212",
    textAlign: "center",
    paddingHorizontal: 20, // Para que no se pegue al botón 'x'
  },
  scrollContainer: {
    flex: 1,
    marginTop: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 15,
    color: "#4f4f4f",
    lineHeight: 22,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "600",
  },
});