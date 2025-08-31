import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, Icon } from "react-native-elements";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import Toast from "react-native-toast-message";
import { Modal } from "../../../../src/components/Shared/Modal";
import { styles } from "./MapForm.styles";

export function MapForm({ show, close, formik }) {
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    (async () => {
      // Solicitar permisos de ubicación al usuario
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "info",
          position: "bottom",
          text1: "Activa la ubicación en los ajustes de la app",
        });
        close();
        return;
      }
      // Obtener la ubicación actual del usuario
      const { coords } = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const saveLocation = () => {
    // Validar que se haya seleccionado una ubicación, el formik viene por props
    formik.setFieldValue("location", { latitude: region.latitude, longitude: region.longitude });
    close();
  };

  return (
    <Modal show={show} close={close}>
      {/* Contenedor de mapa con marcador fijo */}
      <View style={styles.mapContainer}>
        <MapView
          initialRegion={region}
          showsUserLocation
          style={styles.mapStyle}
          onRegionChangeComplete={setRegion}
        />
        {/* Indicador de selección en centro */}
        <Icon
          name="map-marker"
          type="material-community"
          size={40}
          color="#00a680"
          containerStyle={styles.markerFixed}
        />
      </View>

      {/* Acciones de mapa */}
      <View style={styles.mapActions}>
        <Button
          title="Guardar"
          containerStyle={styles.btnMapContainerSave}
          buttonStyle={styles.btnMapSave}
          onPress={saveLocation}
        />
        <Button
          title="Cerrar"
          containerStyle={styles.btnMapContainerCancel}
          buttonStyle={styles.btnMapCancel}
          onPress={close}
        />
      </View>
    </Modal>
  );
}
