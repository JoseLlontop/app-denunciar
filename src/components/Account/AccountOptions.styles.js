import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    width: width * 0.95,
    alignSelf: "center",
    borderRadius: 12,
    overflow: "hidden",
  },

  listItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },

  iconLeft: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },

  title: {
    fontSize: 15,
    color: "#222",
    fontWeight: "600",
  },

  // pequeños ajustes de sombra si decides envolver la lista en un card
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
