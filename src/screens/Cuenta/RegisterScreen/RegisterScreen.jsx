import { SafeAreaView, View, Dimensions } from 'react-native';
import { ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RegisterForm } from '../../../components/Auth/RegisterForm/RegisterForm';
import { styles } from './RegisterScreen.styles';

const { width } = Dimensions.get('window');

export function RegisterScreen() {
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
        contentContainerStyle={styles.formContainer}
        enableOnAndroid
        extraScrollHeight={20}
      >
        <RegisterForm />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}