import React, { useEffect, useState, useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import { Avatar, Text } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { styles } from "./InfoUser.styles";

export function InfoUser({ setLoading, setLoadingText }) {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);

  // Escucha cambios de sesión y evita leer currentUser cuando es null
  useEffect(() => {
    const auth = getAuth();
    // estado inicial (por si ya hay sesión)
    setUser(auth.currentUser);
    setAvatar(auth.currentUser?.photoURL ?? null);

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAvatar(u?.photoURL ?? null);
    });
    return unsub;
  }, []);

  const changeAvatar = useCallback(async () => {
    if (!user) return; // seguridad: no hay usuario

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });

    // Compat: SDKs viejos usan "cancelled", nuevos "canceled" + assets[]
    const canceled = result.canceled ?? result.cancelled;
    const uri = result.assets?.[0]?.uri ?? result.uri;

    if (!canceled && uri) {
      await uploadImage(uri, user.uid);
    }
  }, [user]);

  const uploadImage = async (uri, uid) => {
    setLoadingText?.("Actualizando Avatar");
    setLoading?.(true);

    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storage = getStorage();
      const storageRef = ref(storage, `avatar/${uid}`);

      const snapshot = await uploadBytes(storageRef, blob);
      await updatePhotoUrl(snapshot.metadata.fullPath);
    } catch (error) {
      console.log("Upload avatar error:", error);
    } finally {
      setLoading?.(false);
    }
  };

  const updatePhotoUrl = async (imagePath) => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, imagePath);
      const imageUrl = await getDownloadURL(imageRef);

      const auth = getAuth();
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: imageUrl });
        setAvatar(imageUrl);
      }
    } catch (error) {
      console.log("GetDownloadURL error:", error);
    }
  };

  // UI cuando no hay sesión (evita el crash y guía al usuario)
  if (!user) {
    return (
      <View style={styles.card}>
        <Avatar
          size="large"
          rounded
          containerStyle={styles.avatarContainer}
          avatarStyle={styles.avatarImage}
          icon={{ type: "material", name: "person" }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.displayName}>Invitado</Text>
          <Text style={styles.email}>Inicia sesión para ver tu perfil</Text>
        </View>
      </View>
    );
  }

  // UI normal con usuario autenticado
  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.8} onPress={changeAvatar}>
        <Avatar
          size="large"
          rounded
          containerStyle={styles.avatarContainer}
          avatarStyle={styles.avatarImage}
          icon={{ type: "material", name: "person" }}
          source={avatar ? { uri: avatar } : null}
        >
          <Avatar.Accessory size={26} onPress={changeAvatar} />
        </Avatar>
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.displayName}>{user.displayName || "Anónimo"}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
    </View>
  );
}