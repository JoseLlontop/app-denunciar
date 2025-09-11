import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Avatar, Text } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { styles } from "./InfoUser.styles";
 
export function InfoUser(props) {
  const { setLoading, setLoadingText } = props;
  // Datos del usuario autenticado con imagen
  //const { uid, photoURL, displayName, email } = getAuth().currentUser;

  // Datos del usuario autenticado sin imagen
  const { photoURL, displayName, email } = getAuth().currentUser;
  const [avatar, setAvatar] = useState(photoURL);

  // Abre la galería para elegir imagen
  const changeAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    // Si seleccionó una imagen de galeria, la sube y actualiza el perfil
    if (!result.cancelled) uploadImage(result.uri);
    // result.uri es la ruta local temporal de la imagen seleccionada
  };

  // Sube la imagen a Firebase Storage
  const uploadImage = async (uri) => {
    setLoadingText("Actualizando Avatar");
    setLoading(true);

    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storage = getStorage();
      const storageRef = ref(storage, `avatar/${uid}`);

      const snapshot = await uploadBytes(storageRef, blob);
      // Una vez subida, obtenemos la URL pública y actualizamos el perfil
      updatePhotoUrl(snapshot.metadata.fullPath);
    } catch (error) {
      console.log("Upload avatar error:", error);
      setLoading(false);
    }
  };

  // Obtiene URL pública y actualiza el perfil
  const updatePhotoUrl = async (imagePath) => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, imagePath);

      const imageUrl = await getDownloadURL(imageRef);

      const auth = getAuth();
      await updateProfile(auth.currentUser, { photoURL: imageUrl });

      setAvatar(imageUrl);
    } catch (error) {
      console.log("GetDownloadURL error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      {/* Avatar: todo el avatar es presionable para cambiar foto */}
      <TouchableOpacity activeOpacity={0.8} onPress={changeAvatar}>
        <Avatar
          size="large"
          rounded
          containerStyle={styles.avatarContainer}
          avatarStyle={styles.avatarImage}
          icon={{ type: "material", name: "person" }}
          source={avatar ? { uri: avatar } : null}
        >
          {/* Accessory mantiene la UX previa */}
          <Avatar.Accessory size={26} onPress={changeAvatar} />
        </Avatar>
      </TouchableOpacity>

      {/* Datos del usuario */}
      <View style={styles.textContainer}>
        <Text style={styles.displayName}>{displayName || "Anónimo"}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
    </View>
  );
}