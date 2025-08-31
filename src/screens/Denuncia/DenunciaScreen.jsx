import React from 'react';
import { SafeAreaView, ScrollView, View, Dimensions } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { useFormik } from 'formik';
import { v4 as uuid } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { InfoForm } from '../../components/AddDenuncia/InfoForm';
import { UploadImagesForm } from '../../components/AddDenuncia/UploadImagesForm';
import { ImageBackground } from '../../components/AddDenuncia/ImageBackground';
import { db } from '../../utils';
import { initialValues, validationSchema } from './DenunciaScreen.data';
import { styles } from './DenunciaScreen.styles';

export function DenunciaScreen() {
  const navigation = useNavigation();

  // Configuración de Formik con valores iniciales, validación y submit
  const formik = useFormik({
    initialValues: initialValues(),               // Valores por defecto del formulario
    validationSchema: validationSchema(),        // Esquema de validación con Yup
    validateOnChange: false,                     // Validar sólo al enviar
    onSubmit: async (formValue) => {
      try {
        // Generar ID único y timestamp antes de guardar
        const newData = { ...formValue, id: uuid(), createdAt: new Date() };
        // Guardar el documento en Firestore
        await setDoc(doc(db, 'denuncias', newData.id), newData);
        // Volver a la pantalla anterior
        navigation.goBack();
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ScrollView para habilitar scroll en pantallas pequeñas */}
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Componente para manejar la imagen principal */}
        <ImageBackground formik={formik} />

        {/* Formulario con inputs de texto y picker */}
        <InfoForm formik={formik} />

        {/* Formulario para subir imágenes adicionales */}
        <UploadImagesForm formik={formik} />

        {/* Botón de envío de la denuncia */}
        <Button
          title="Crear Denuncia"
          buttonStyle={styles.submitButton}
          containerStyle={styles.submitWrapper}
          onPress={formik.handleSubmit}
          loading={formik.isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
}