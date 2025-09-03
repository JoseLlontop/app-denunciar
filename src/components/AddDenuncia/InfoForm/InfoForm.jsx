import React, { useState } from "react";
import { View, Text } from "react-native";
import { Input, Icon, Button, Card } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { MapForm } from "../MapForm";
import { styles } from "./InfoForm.styles";

export function InfoForm({ formik }) {
  // Estado local para mostrar/ocultar el mapa
  const [showMap, setShowMap] = useState(false);
  const toggleMap = () => setShowMap(prev => !prev);

  return (
    <Card containerStyle={styles.card}>

      {/* Sección: Detalles de la incidencia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalles de la Denuncia</Text>
        {/* Input: Título breve */}
        <Input
          placeholder="Título breve"
          inputContainerStyle={styles.inputContainer}
          containerStyle={styles.inputWrapper}
          onChangeText={text => formik.setFieldValue('title', text)}
          errorMessage={formik.errors.title}
          value={formik.values.title}
        />
        {/* Input: Descripción detallada */}
        <Input
          placeholder="Descripción detallada"
          multiline
          inputContainerStyle={[styles.inputContainer, styles.textArea]}
          containerStyle={styles.inputWrapper}
          onChangeText={text => formik.setFieldValue('description', text)}
          errorMessage={formik.errors.description}
          value={formik.values.description}
        />
        {/* Selector de categoría */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={formik.values.category}
            onValueChange={value => formik.setFieldValue('category', value)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione Categoría" value="" />
            <Picker.Item label="Bache" value="bache" />
            <Picker.Item label="Luminaria" value="luminaria" />
            <Picker.Item label="Riesgo Eléctrico" value="riesgo electrico" />
          </Picker>
          {/* Mensaje de error para categoría */}
          {formik.errors.category && <Text style={styles.error}>{formik.errors.category}</Text>}
        </View>
      </View>

      {/* Sección: Ubicación y mapa */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ubicación</Text>
        {/* Input: Dirección con icono de mapa */}
        <Input
          placeholder="Dirección"
          rightIcon={
            <Icon
              type="material-community"
              name="map-marker-radius"
              // color dinámico según error o valor
              color={formik.errors.address ? '#ff0000' : formik.values.address ? '#00a680' : '#c2c2c2'}
              onPress={toggleMap}
            />
          }
          inputContainerStyle={styles.inputContainer}
          containerStyle={styles.inputWrapper}
          onChangeText={text => formik.setFieldValue('address', text)}
          errorMessage={formik.errors.address}
          value={formik.values.address}
        />
        {/* Botón para mostrar/ocultar mapa */}
        <Button
          title={showMap ? 'Cerrar Mapa' : 'Abrir Mapa'}
          type="outline"
          onPress={toggleMap}
          buttonStyle={styles.mapButton}
          containerStyle={styles.mapButtonWrapper}
        />
      </View>

      {/* Componente de mapa flotante */}
      <MapForm show={showMap} close={toggleMap} formik={formik} />
    </Card>
  );
}
