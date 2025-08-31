import React, { useState } from "react";
import { ScrollView, Alert, View, TouchableOpacity } from "react-native";
import { Icon, Avatar, Text } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { map, filter } from "lodash";
import { LoadingModal } from "../../../../src/components/Shared";
import { styles } from "./UploadImagesForm.styles";

export function UploadImagesForm(props) {
  const { formik } = props;
  const [isLoading, setIsLoading] = useState(false);

  // Abrir galería y permitir seleccionar imagen
  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.cancelled) {
      setIsLoading(true);
      uploadImage(result.uri);
    }
  };

  // Subir imagen a Firebase Storage y obtener URL pública
  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storage = getStorage();
      const storageRef = ref(storage, `denuncias/${uuid()}`);

      const snapshot = await uploadBytes(storageRef, blob);
      await updatePhotosDenuncia(snapshot.metadata.fullPath);
    } catch (error) {
      console.log("Error subiendo imagen:", error);
      setIsLoading(false);
    }
  };

  // Actualiza formik con la URL descargada
  const updatePhotosDenuncia = async (imagePath) => {
    const storage = getStorage();
    const imageRef = ref(storage, imagePath);

    const imageUrl = await getDownloadURL(imageRef);

    formik.setFieldValue("images", [...formik.values.images, imageUrl]);

    setIsLoading(false);
  };

  // Eliminar imagen con confirmación
  const removeImage = (img) => {
    Alert.alert(
      "Eliminar imagen",
      "¿Estás segur@ de eliminar esta imagen?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            const result = filter(formik.values.images, (image) => image !== img);
            formik.setFieldValue("images", result);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <ScrollView
        style={styles.viewImage}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Botón agregar (ícono grande con label) */}
        <TouchableOpacity activeOpacity={0.7} style={styles.addWrapper} onPress={openGallery}>
          <View style={styles.addCircle}>
            <Icon type="material-community" name="camera-plus" size={28} color="#fff" />
          </View>
          <Text style={styles.addLabel}>Agregar</Text>
        </TouchableOpacity>

        {/* Miniaturas: cada avatar en su contenedor relativo para overlay del icono eliminar */}
        {map(formik.values.images, (image) => (
          <View key={image} style={styles.imageWrapper}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => removeImage(image)}>
              <Avatar
                source={{ uri: image }}
                rounded
                size="medium"
                containerStyle={styles.imageStyle}
              />
              {/* Icono pequeño de eliminar en la esquina */}
              <Icon
                name="close-circle"
                type="material-community"
                containerStyle={styles.deleteIconContainer}
                color="#ff4d4f"
                size={20}
                onPress={() => removeImage(image)}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Mensaje de error de validación (si existe) */}
      {formik.errors.images ? <Text style={styles.error}>{formik.errors.images}</Text> : null}

      <LoadingModal show={isLoading} text="Subiendo imagen" />
    </>
  );
}