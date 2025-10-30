import { useState, useEffect } from "react";
import { UsuarioNoLogeadoScreen } from "./../Cuenta/UsuarioNoLogeadoScreen";
import { UsuarioLogeadoScreen } from "../Cuenta/UsuarioLogeadoScreen/UsuarioLogeadoScreen";
import { LoadingModal } from "../../components/Shared/LoadingModal";

import { auth } from "../../utils/firebase"; 

export function CuentaScreen() {

  const [hasLogged, setHasLogged] = useState(null);

  useEffect(() => {
    // 2. CAMBIO: 'onAuthStateChanged' es un método de la instancia 'auth'
    // Guardamos la función 'unsubscriber' que devuelve
    const unsub = auth.onAuthStateChanged((user) => {
      // Si existe un usuario, está logueado (true); si no, no está logueado (false)
      setHasLogged(user ? true : false);
    });

    // 3. BUENA PRÁCTICA: Retornamos el 'unsubscriber'
    // Esto limpia el listener cuando el componente se desmonta
    return () => unsub();

  }, []);

  // Mientras no se haya determinado si el usuario está logueado...
  if (hasLogged === null) {
    return <LoadingModal show text="Cargando" />;
  }

  // Si el usuario está logueado, muestra la pantalla para usuarios registrados
  return hasLogged ? <UsuarioLogeadoScreen /> : <UsuarioNoLogeadoScreen />;
}