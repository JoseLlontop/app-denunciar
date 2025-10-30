import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, AppState } from "react-native";
import { Text, Icon } from "react-native-elements";

import { auth } from "../../../utils/firebase"; 

import { styles } from "./InfoUser.styles";

/**
 * Props:
 * - autoRefreshMs   -> intervalo de refresco (ms). Default: 5000
 * - autoRefreshMax  -> cantidad máx. de intentos. Default: 24 (~2 min)
 */
export function InfoUser({ autoRefreshMs = 5000, autoRefreshMax = 24 }) {
  const [user, setUser] = useState(null);
  const prevEmailRef = useRef(null);

  // ... (Este hook estaba bien) ...
  useEffect(() => {
    prevEmailRef.current = user?.email ?? null;
  }, [user?.email]);

  // Suscripciones Auth + estado inicial
  useEffect(() => {
    // 2. CAMBIO: Usamos 'auth' importada. No más getAuth(getApp())
    setUser(auth.currentUser);

    // 3. CAMBIO: Son métodos de la instancia 'auth'
    const unsubAuth = auth.onAuthStateChanged((u) => {
      setUser(u);
    });

    const unsubToken = auth.onIdTokenChanged((u) => {
      setUser(u);
    });

    return () => {
      unsubAuth();
      unsubToken();
    };
  }, []); // Dependencia vacía está bien, solo se ejecuta al montar

  // Reload cuando la app vuelve al primer plano
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if (state === "active") {
        // 4. CAMBIO: Usamos 'auth' importada
        if (auth.currentUser) {
          try {
            // 5. CAMBIO: 'reload' es un método de 'currentUser'
            await auth.currentUser.reload();
            setUser(auth.currentUser); // Re-seteamos el usuario con los datos frescos
          } catch (e) {
            console.log("[InfoUser] reload on active ->", e?.code, e?.message);
          }
        }
      }
    });
    return () => sub.remove();
  }, []); // Dependencia vacía está bien

  // Polling breve...
  useEffect(() => {
    if (!autoRefreshMs || autoRefreshMs <= 0 || autoRefreshMax <= 0) return;

    let tries = 0;
    let mounted = true;

    const timer = setInterval(async () => {
      tries += 1;
      if (!auth.currentUser) return;

      try {
        await auth.currentUser.reload();
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
    // Las dependencias están bien
  }, [autoRefreshMs, autoRefreshMax]); 


  if (!user) {
    return (
      <View style={styles.card}>
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

  // --- VISTA "LOGUEADO" (Estaba bien, no necesita cambios) ---
  return (
    <View style={styles.card}>
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