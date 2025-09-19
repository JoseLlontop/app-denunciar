import React, { useState } from 'react';
import { View } from 'react-native';
import { Input, Icon, Button, Card, Text } from 'react-native-elements';
import { useFormik } from 'formik';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { screen } from '../../../utils';
import { initialValues, validationSchema } from './LoginForm.data';
import { styles } from './LoginForm.styles';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const onShowHidePassword = () => setShowPassword(prev => !prev);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, values.email, values.password);
        navigation.navigate(screen.cuenta.perfil);
      } catch {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Correo o contraseña incorrectos',
        });
      }
    }
  });

  return (
    <Card containerStyle={styles.card}>
      <View style={styles.content}>
        <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 10, textAlign: "center", padding:4 }}>
        Iniciar Sesión
      </Text>
        <Input
          placeholder="Correo electrónico"
          containerStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
          rightIcon={<Icon type="material-community" name="at" iconStyle={styles.icon} />}
          onChangeText={text => formik.setFieldValue('email', text)}
          errorMessage={formik.errors.email}
        />

        <Input
          placeholder="Contraseña"
          containerStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
          secureTextEntry={!showPassword}
          rightIcon={
            <Icon
              type="material-community"
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onPress={onShowHidePassword}
              iconStyle={styles.icon}
            />
          }
          onChangeText={text => formik.setFieldValue('password', text)}
          errorMessage={formik.errors.password}
        />

        <Button
          title="Iniciar sesión"
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          titleStyle={styles.btnTitle}
          onPress={formik.handleSubmit}
          loading={formik.isSubmitting}
        />
      </View>
    </Card>
  );
}
