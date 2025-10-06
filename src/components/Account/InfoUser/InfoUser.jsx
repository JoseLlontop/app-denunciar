import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, TouchableOpacity, AppState } from "react-native";
import { Avatar, Text } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import {
  getAuth,
  onAuthStateChanged,
  onIdTokenChanged,
  updateProfile,
  reload,
} from "firebase/auth";
import { getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { styles } from "./InfoUser.styles";

/**
 * Props:
 * - autoRefreshMs   -> intervalo de refresco (ms). Default: 5000
 * - autoRefreshMax  -> cantidad máx. de intentos. Default: 24 (~2 min)
 */
export function InfoUser({ setLoading, setLoadingText, autoRefreshMs = 5000, autoRefreshMax = 24 }) {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const prevEmailRef = useRef(null);

  // Guardamos el último email para detectar el cambio y cortar el polling
  useEffect(() => {
    prevEmailRef.current = user?.email ?? null;
  }, [user?.email]);

  // Suscripciones Auth + estado inicial
  useEffect(() => {
    const auth = getAuth(getApp());
    setUser(auth.currentUser);
    setAvatar(auth.currentUser?.photoURL ?? null);

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAvatar(u?.photoURL ?? null);
    });

    const unsubToken = onIdTokenChanged(auth, (u) => {
      setUser(u);
      setAvatar(u?.photoURL ?? null);
    });

    return () => {
      unsubAuth();
      unsubToken();
    };
  }, []);

  // Reload cuando la app vuelve al primer plano (clave tras verificar el email en el navegador)
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if (state === "active") {
        const auth = getAuth(getApp());
        if (auth.currentUser) {
          try {
            await reload(auth.currentUser);
            setUser(auth.currentUser);
            setAvatar(auth.currentUser?.photoURL ?? null);
          } catch (e) {
            console.log("[InfoUser] reload on active ->", e?.code, e?.message);
          }
        }
      }
    });
    return () => sub.remove();
  }, []);

  // Polling breve: intenta refrescar hasta que detecta el nuevo email o se agota el tiempo
  useEffect(() => {
    if (!autoRefreshMs || autoRefreshMs <= 0 || autoRefreshMax <= 0) return;

    let tries = 0;
    let mounted = true;

    const timer = setInterval(async () => {
      tries += 1;
      const auth = getAuth(getApp());
      if (!auth.currentUser) return;

      try {
        await reload(auth.currentUser);
        if (!mounted) return;

        const refreshed = auth.currentUser;
        setUser(refreshed);
        setAvatar(refreshed?.photoURL ?? null);

        // Si cambió el email, cortamos
        if (prevEmailRef.current !== refreshed?.email) {
          clearInterval(timer);
        }
      } catch (e) {
      }

      if (tries >= autoRefreshMax) {
        clearInterval(timer);
      }
    }, autoRefreshMs);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [autoRefreshMs, autoRefreshMax]);

  const changeAvatar = useCallback(async () => {
    if (!user) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });

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

      const auth = getAuth(getApp());
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: imageUrl });
        setAvatar(imageUrl);
      }
    } catch (error) {
      console.log("GetDownloadURL error:", error);
    }
  };

  if (!user) {
    return (
      <View style={styles.card}>
        <Avatar
          size="large"
          rounded
          containerStyle={styles.avatarContainer}
          avatarStyle={styles.avatarImage}
          icon={{ type: "material-community", name: "account", color: "#666" }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.displayName}>Sesión requerida</Text>
          <Text style={styles.email}>
            Tu perfil se actualizará cuando vuelvas a iniciar sesión.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.8} onPress={changeAvatar}>
        <Avatar
          size="large"
          rounded
          containerStyle={styles.avatarContainer}
          avatarStyle={styles.avatarImage}
          source={avatar ? { uri: avatar } : undefined}
          icon={{ type: "material-community", name: "account", color: "#666" }}
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