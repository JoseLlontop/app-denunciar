import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, AppState } from "react-native";
import { Text, Icon } from "react-native-elements"; // <-- Importar Icon
import {
  getAuth,
  onAuthStateChanged,
  onIdTokenChanged,
  reload,
} from "firebase/auth";
import { getApp } from "firebase/app";
import { styles } from "./InfoUser.styles";

/**
 * Props:
 * - autoRefreshMs   -> intervalo de refresco (ms). Default: 5000
 * - autoRefreshMax  -> cantidad máx. de intentos. Default: 24 (~2 min)
 */
export function InfoUser({ autoRefreshMs = 5000, autoRefreshMax = 24 }) {
  const [user, setUser] = useState(null);
  const prevEmailRef = useRef(null);

  // ... (hooks useEffect sin cambios) ...

  // Guardamos el último email para detectar el cambio y cortar el polling
  useEffect(() => {
    prevEmailRef.current = user?.email ?? null;
  }, [user?.email]);

  // Suscripciones Auth + estado inicial
  useEffect(() => {
    const auth = getAuth(getApp());
    setUser(auth.currentUser);

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    const unsubToken = onIdTokenChanged(auth, (u) => {
      setUser(u);
    });

    return () => {
      unsubAuth();
      unsubToken();
    };
  }, []);

  // Reload cuando la app vuelve al primer plano
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if (state === "active") {
        const auth = getAuth(getApp());
        if (auth.currentUser) {
          try {
            await reload(auth.currentUser);
            setUser(auth.currentUser);
          } catch (e) {
            console.log("[InfoUser] reload on active ->", e?.code, e?.message);
          }
        }
      }
    });
    return () => sub.remove();
  }, []);

  // Polling breve...
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

        if (prevEmailRef.current !== refreshed?.email) {
          clearInterval(timer);
        }
      } catch (e) {}

      if (tries >= autoRefreshMax) {
        clearInterval(timer);
      }
    }, autoRefreshMs);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [autoRefreshMs, autoRefreshMax]);


  // --- VISTA "SESIÓN REQUERIDA" (MODIFICADA) ---
  if (!user) {
    return (
      <View style={styles.card}>
        {/* Icono para estado "no logueado" */}
        <View style={styles.iconContainer}>
          <Icon
            type="material-community"
            name="account-off-outline"
            size={26}
            color="#6b6b6b"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.displayName}>Sesión requerida</Text>
          <Text style={styles.email}>
            Tu perfil se actualizará cuando vuelvas a iniciar sesión.
          </Text>
        </View>
      </View>
    );
  }

  // --- VISTA "LOGUEADO" (MODIFICADA) ---
  return (
    <View style={styles.card}>
      {/* Icono de usuario */}
      <View style={styles.iconContainer}>
        <Icon
          type="material-community"
          name="account-outline"
          size={34}
          color="#333"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.displayName}>{user.displayName || "Anónimo"}</Text>
        <Text style={styles.email}>{user.email}</Text>
        
        {/* Nuevo: Estado de verificación */}
        {user.emailVerified ? (
          <Text style={[styles.verificationText, styles.verified]}>
            Email Verificado
          </Text>
        ) : (
          <Text style={[styles.verificationText, styles.unverified]}>
            Email no verificado
          </Text>
        )}
      </View>
    </View>
  );
}