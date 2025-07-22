import { SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Text, Button, Image, Card } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { screen } from '../../../utils';
import { styles } from './UsuarioNoLogeadoScreen.styles';

const { width } = Dimensions.get('window');

export function UsuarioNoLogeadoScreen() {
  // Utilizamos useNavigation para navegar a otras pantallas
  const navigation = useNavigation();

  // Función para navegar a la pantalla de inicio de sesión
  const goToLogin = () => {
    navigation.navigate(screen.cuenta.login);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card containerStyle={styles.card}> 
          <Image
            source={require('../../../../assets/user-guest/user-guest.png')}
            style={styles.image}
            PlaceholderContent={<Text>Cargando...</Text>}
          />

          <Text h4 style={styles.title}>
            ¿Listo para Mejorar tu Ciudad?
          </Text>

          <Text style={styles.description}>
            Con <Text style={styles.highlight}>DenunciAR</Text> puedes señalar
            incidencias en el mapa en menos de 4 pasos, subir fotos y describir
            el problema. ¡Empieza ahora y haz la diferencia!
          </Text>
        </Card>

        <Button
          title="Ver tu perfil"
          onPress={goToLogin}
          buttonStyle={styles.btn}
          icon={{ name: 'login', type: 'material-community', color: '#fff' }}
          containerStyle={styles.btnContainer}
        />
      </ScrollView>
    </SafeAreaView>
  );
}