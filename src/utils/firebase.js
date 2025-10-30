import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/app';

// Exportamos la instancia de la app (si la necesitas en otro lado)
const app = firebase.app();

// Exportamos la instancia de auth
const authInstance = auth();

// Exportamos 'authInstance' como 'auth' para que tus otros archivos
// (como AuthContext) sigan funcionando sin cambios.
export { app, authInstance as auth };