import React from 'react';
import { SafeAreaView, View, Text, Dimensions } from 'react-native';
import { ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LoginForm } from '../../../components/Auth/LoginForm/LoginForm';
import { useNavigation } from '@react-navigation/native';
import { screen } from '../../../utils';
import { styles } from './LoginScreen.styles';

const { width, height } = Dimensions.get('window');

export function LoginScreen() {
  const navigation = useNavigation();
  const goToRegister = () => navigation.navigate(screen.cuenta.register);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../../../assets/login/imagen-login.png')}
        style={styles.headerImage}
        PlaceholderContent={null}
      >
        <View style={styles.overlay} />
      </ImageBackground>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableOnAndroid
        extraScrollHeight={20}
      >
        <LoginForm />

        <Text style={styles.textRegister}>
          ¿Aún no tienes cuenta?{' '}
          <Text style={styles.btnRegister} onPress={goToRegister}>
            Regístrate
          </Text>
        </Text>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}