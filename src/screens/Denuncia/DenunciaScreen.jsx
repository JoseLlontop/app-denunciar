import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { useFormik } from 'formik';
import { useNavigation } from '@react-navigation/native';

import { InfoForm } from '../../components/AddDenuncia/InfoForm';
import { ImageBackground } from '../../components/AddDenuncia/ImageBackground';

// import { UploadImagesForm } from '../../components/AddDenuncia/UploadImagesForm';

import { initialValues, validationSchema } from './DenunciaScreen.data';
import { styles } from './DenunciaScreen.styles';

import { apiFetch } from '../../lib/apiClient';
import { API_BASE_URL } from '@env';

import Toast from 'react-native-toast-message';

export function DenunciaScreen() {
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    onSubmit: async (values, helpers) => {
      try {
        const payload = {
          titulo: values.title?.trim(),
          descripcion: values.description?.trim(),
          categoria: values.category,
          latitud: Number(values?.location?.latitude),
          longitud: Number(values?.location?.longitude),
        };

        await apiFetch(`${API_BASE_URL}/reclamos/`, {
          method: 'POST',
          body: payload,
        });

        // limpiar formulario
        helpers.resetForm({ values: initialValues() });

        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Denuncia Enviada',
          text2: 'Gracias! Tu reclamo fue enviado a la municipalidad.',
        });

        navigation.goBack();

      } catch (error) {
        console.error(error);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error al crear la denuncia',
          text2: 'Intentá nuevamente en unos minutos.',
        });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <ImageBackground formik={formik} />

        <InfoForm formik={formik} />

        {/* <UploadImagesForm formik={formik} /> */}

        <Button
          title="Crear Denuncia"
          buttonStyle={styles.submitButton}
          containerStyle={styles.submitWrapper}
          onPress={formik.handleSubmit}
          loading={formik.isSubmitting}
          disabled={formik.isSubmitting}
        />

      </ScrollView>
    </SafeAreaView>
  );
}
