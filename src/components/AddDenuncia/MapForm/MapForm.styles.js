import { StyleSheet, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: height * 0.5,
    borderRadius: 12,
    overflow: "hidden",
    alignSelf: "center",
    marginTop: 10,
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
  markerFixed: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20,
    marginTop: -40,
    zIndex: 2,
  },
  mapActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  btnMapContainerSave: {
    flex: 1,
    marginRight: 5,
    borderRadius: 8,
    overflow: "hidden",
  },
  btnMapSave: {
    backgroundColor: "#00a680",
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnMapContainerCancel: {
    flex: 1,
    marginLeft: 5,
    borderRadius: 8,
    overflow: "hidden",
  },
  btnMapCancel: {
    backgroundColor: "#a60d0d",
    paddingVertical: 10,
    borderRadius: 8,
  },
});
