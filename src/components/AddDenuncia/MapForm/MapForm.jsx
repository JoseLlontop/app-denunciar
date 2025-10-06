import React, { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { Button, Icon } from "react-native-elements";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Toast from "react-native-toast-message";
import { Modal } from "../../../../src/components/Shared/Modal";
import { styles } from "./MapForm.styles";

export function MapForm({ show, close, formik }) {
  const mapRef = useRef(null);

  // region controlada (null hasta tener la ubicación)
  const [region, setRegion] = useState(null);

  useEffect(() => {
    (async () => {
      try {
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

        const { coords } = await Location.getCurrentPositionAsync({});
        const nextRegion = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(nextRegion);
      } catch (e) {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "No se pudo obtener tu ubicación",
        });
        close();
      }
    })();
  }, []);

  const saveLocation = () => {
    if (!region) return;
    formik.setFieldValue("location", {
      latitude: region.latitude,
      longitude: region.longitude,
    });
    close();
  };

  return (
    <Modal show={show} close={close}>
      {/* Contenedor del mapa con marcador fijo en el centro */}
      <View style={styles.mapContainer}>
        {region ? (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            region={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation
            showsMyLocationButton={Platform.OS === "android"} // botón nativo (Android)
            style={styles.mapStyle}
          />
        ) : (
          // Loader mientras esperamos la ubicación
          <View style={[styles.mapStyle, { justifyContent: "center", alignItems: "center" }]}>
            <ActivityIndicator size="large" />
          </View>
        )}

        {/* Indicador de selección en el centro */}
        <Icon
          name="map-marker"
          type="material-community"
          size={40}
          color="#00a680"
          containerStyle={styles.markerFixed}
        />
      </View>

      {/* Acciones */}
      <View style={styles.mapActions}>
        <Button
          title="Guardar"
          disabled={!region}
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