import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { auth } from "../utils/firebase";

const AUTH_TOKEN_KEY = "auth_token_v1";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authToken, setAuthTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAuthToken = useCallback(async (token) => {
    try {
      if (token) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      } else {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      }
      setAuthTokenState(token || null);
    } catch (e) {
      console.warn("No se pudo persistir el token:", e?.message);
      setAuthTokenState(token || null);
    }
  }, []);

  const refreshToken = useCallback(async (force = true) => {
    // 2. CAMBIO: Usamos la instancia 'auth' importada
    const current = auth.currentUser;
    if (!current) return null;
    const fresh = await current.getIdToken(force);
    await setAuthToken(fresh);
    return fresh;
  }, [setAuthToken]);

  const signOut = useCallback(async () => {
    // 3. CAMBIO: Usamos la instancia 'auth' importada
    await auth.signOut();
    await setAuthToken(null);
    setUser(null);
  }, [setAuthToken]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        if (mounted && stored) setAuthTokenState(stored);
      } finally {
        // ...
      }
    })();

    // 4. CAMBIO: 'onIdTokenChanged' ahora es un método de 'auth'
    const unsub = auth.onIdTokenChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const t = await firebaseUser.getIdToken();
        await setAuthToken(t);
      } else {
        await setAuthToken(null);
      }
      if (mounted) setIsLoading(false);
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, [setAuthToken]);

  const value = useMemo(
    () => ({
      user,
      authToken,
      isLoading,
      setAuthToken,
      refreshToken,
      signOut,
    }),
    [user, authToken, isLoading, setAuthToken, refreshToken, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider />");
  return ctx;
}