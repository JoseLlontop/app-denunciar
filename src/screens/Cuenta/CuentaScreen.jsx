
import { useState, useEffect } from "react";
import { UsuarioNoLogeadoScreen } from "./UsuarioNoLogeadoScreen";
import { UsuarioLogeadoScreen } from "./UsuarioLogeadoScreen";
import { LoadingModal } from "../../components";

import { auth } from "../../utils/firebase"; 
import { onAuthStateChanged } from "firebase/auth";

export function CuentaScreen() {

  const [hasLogged, setHasLogged] = useState(null);

  // Se ejecuta una vez cuando el componente se monta
  useEffect(() => {
    // Escucha los cambios en el estado de autenticación (por ejemplo, si el usuario inicia o cierra sesión)
    onAuthStateChanged(auth, (user) => {
      // Si existe un usuario, está logueado (true); si no, no está logueado (false)
      setHasLogged(user ? true : false);
   });
  }, []);

  // Mientras no se haya determinado si el usuario está logueado, es decir no se asigno todavia ni true ni false, muestra un modal de carga
  if (hasLogged === null) {
    return <LoadingModal show text="Cargando" />;
  }

  // Si el usuario está logueado, muestra la pantalla para usuarios registrados
  return hasLogged ? <UsuarioLogeadoScreen /> : <UsuarioNoLogeadoScreen />;
}