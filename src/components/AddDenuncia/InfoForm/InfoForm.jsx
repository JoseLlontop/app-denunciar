import React, { useState, useMemo } from "react";
import { View, Text } from "react-native";
import { Input, Icon, Button, Card } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { MapForm } from "../MapForm";
import { styles } from "./InfoForm.styles";

export function InfoForm({ formik }) {
  const [showMap, setShowMap] = useState(false);
  const toggleMap = () => setShowMap(prev => !prev);

  const hasLocation = useMemo(() => {
    const loc = formik?.values?.location;
    return !!(loc && typeof loc.latitude === "number" && typeof loc.longitude === "number");
  }, [formik?.values?.location]);

  const locationLabel = hasLocation
    ? "Ubicación seleccionada"
    : "Seleccioná la ubicación en el mapa";

  return (
    <View style={styles.formContainer}>
      <Card containerStyle={styles.card}>

        {/* Sección: Detalles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle1}>Detalles de la Denuncia</Text>

          <Input
            placeholder="Título breve"
            inputContainerStyle={styles.inputContainer}
            containerStyle={styles.inputWrapper}
            onChangeText={text => formik.setFieldValue("title", text)}
            errorMessage={formik.errors.title}
            value={formik.values.title}
          />

          <Input
            placeholder="Descripción detallada"
            multiline
            inputContainerStyle={[styles.inputContainer, styles.textArea]}
            containerStyle={styles.inputWrapper}
            onChangeText={text => formik.setFieldValue("description", text)}
            errorMessage={formik.errors.description}
            value={formik.values.description}
          />

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formik.values.category}
              onValueChange={value => formik.setFieldValue("category", value)}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione Categoría" value="" />
              <Picker.Item label="Bache" value="baches" />
              <Picker.Item label="Alumbrado" value="alumbrado" />
              <Picker.Item label="Residuos" value="residuos" />
              <Picker.Item label="Seguridad" value="seguridad" />
              <Picker.Item label="Otro" value="otro" />
            </Picker>
            {formik.errors.category && <Text style={styles.error}>{formik.errors.category}</Text>}
          </View>
        </View>

        {/* Sección: Ubicación (solo mapa) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación</Text>

          <View style={styles.locationRow}>
            <Icon
              type="material-community"
              name={hasLocation ? "map-marker-check" : "map-marker-outline"}
              color={hasLocation ? "#00a680" : "#c2c2c2"}
              size={28}
              containerStyle={styles.locationIcon}
              onPress={toggleMap}
            />
            <Text style={[styles.locationText, hasLocation && styles.locationTextSaved]}>
              {locationLabel}
            </Text>
          </View>

          {formik.errors.location && <Text style={styles.error}>{formik.errors.location}</Text>}

          <Button
            title={hasLocation ? "Editar ubicación" : "Seleccionar en mapa"}
            type={hasLocation ? "solid" : "outline"}
            onPress={toggleMap}
            buttonStyle={hasLocation ? styles.mapButtonSaved : styles.mapButton}
            containerStyle={styles.mapButtonWrapper}
            icon={{
              type: "material-community",
              name: hasLocation ? "check-circle-outline" : "map-search-outline",
              color: hasLocation ? "#fff" : "#00a680",
            }}
          />
        </View>

        {/* Bloque visual de estado (estático) */}
        <View style={styles.statusBox}>
          <Icon
            type="material-community"
            name="progress-clock"
            color="#B45309"
            size={24}
            containerStyle={styles.statusIcon}
          />
          <View style={styles.statusTextWrap}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>PENDIENTE</Text>
            </View>
            <Text style={styles.statusDescription}>
              Tu incidente será gestionado por un empleado de la municipalidad para su resolución.
            </Text>
          </View>
        </View>

      </Card>

      {/* Modal del mapa */}
      <MapForm show={showMap} close={toggleMap} formik={formik} />
    </View>
  );
}