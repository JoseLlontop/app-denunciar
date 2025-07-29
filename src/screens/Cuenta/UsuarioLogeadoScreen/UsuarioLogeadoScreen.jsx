import React from 'react';
import { SafeAreaView, ScrollView, View, Dimensions } from 'react-native';
import { Text, Button, Image, Card } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { screen } from '../../../utils';
import { styles } from './UsuarioLogeadoScreen.styles';

const { width } = Dimensions.get('window');

export function UsuarioLogeadoScreen() {
  const navigation = useNavigation();

  const goToProfile = () => {
    navigation.navigate(screen.cuenta.profile);
  };

  const logout = () => {
    // Aquí pondrías tu lógica de cierre de sesión
    navigation.navigate(screen.cuenta.login);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card containerStyle={styles.card}>
          <Image
            source={require('../../../../assets/user-guest/user.webp')}
            containerStyle={styles.imageContainer}
            style={styles.image}
            PlaceholderContent={<Text>Cargando...</Text>}
          />
          <Text h4 style={styles.title}>
            ¡Bienvenido de nuevo!
          </Text>
          <Text style={styles.description}>
            Aquí puedes revisar tu información de usuario o cerrar sesión.
          </Text>
          <View style={styles.buttonRow}>
            <Button
              title="Ver perfil"
              onPress={goToProfile}
              buttonStyle={styles.btnPrimary}
              containerStyle={styles.btnContainer}
            />
            <Button
              title="Cerrar sesión"
              onPress={logout}
              type="outline"
              titleStyle={styles.btnOutlineTitle}
              buttonStyle={styles.btnOutline}
              containerStyle={styles.btnContainer}
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}