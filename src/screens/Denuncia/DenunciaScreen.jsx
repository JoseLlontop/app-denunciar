import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { useFormik } from 'formik';
import { useNavigation } from '@react-navigation/native';

import { InfoForm } from '../../components/AddDenuncia/InfoForm';
import { ImageBackground } from '../../components/AddDenuncia/ImageBackground';
import { UploadImagesForm } from '../../components/AddDenuncia/UploadImagesForm';

import { initialValues, validationSchema } from './DenunciaScreen.data';
import { styles } from './DenunciaScreen.styles';

import { apiFetch } from '../../lib/apiClient';
import { API_BASE_URL } from '@env';
import Toast from 'react-native-toast-message';

import storage from '@react-native-firebase/storage';

import { v4 as uuid } from "uuid";

export function DenunciaScreen() {
  const navigation = useNavigation();

  const uploadImagesToFirebase = async (localUris) => {
    const uploadedUrls = [];
    
    // 2. CAMBIO: Obtenemos la instancia nativa
    const storageInstance = storage();

    await Promise.all(
      localUris.map(async (uri) => {
        try {
          // 3. CAMBIO: 'ref()' es un método de la instancia 'storageInstance'
          const storageRef = storageInstance.ref(`denuncias/${uuid()}`);
          
          // 'putFile()' toma la URI local (ej: "file://...") directamente.
          // No necesitamos 'fetch' ni 'blob'.
          await storageRef.putFile(uri);
          
          // 5. CAMBIO: 'getDownloadURL()' es un método de 'storageRef'
          const downloadUrl = await storageRef.getDownloadURL();
          
          uploadedUrls.push(downloadUrl);

        } catch (error) {
          console.error(`Error al subir imagen: ${uri}`, error);
          throw new Error("Error al subir una de las imágenes.");
        }
      })
    );

    return uploadedUrls;
  };


  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    onSubmit: async (values, helpers) => {
      try {
        
        // 1. Subimos las imágenes
        const finalImageUrls = await uploadImagesToFirebase(values.images);

        console.log('URLs finales de imágenes:', finalImageUrls);
        
        // 2. Creamos el 'payload'
        const payload = {
          titulo: values.title?.trim(),
          descripcion: values.description?.trim(),
          categoria: values.category,
          latitud: Number(values?.location?.latitude),
          longitud: Number(values?.location?.longitude),
          // imagenes: finalImageUrls, 
        };

        // 3. Enviamos a la API
        await apiFetch(`${API_BASE_URL}/reclamos/`, {
          method: 'POST',
          body: payload,
        });

        // 4. Limpiamos y notificamos
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
          text2: 'Ocurrió un error al subir las imágenes o enviar el reclamo.',
        });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* (Todo tu JSX estaba perfecto y no necesita cambios) */}

        <ImageBackground formik={formik} />
        <InfoForm formik={formik} />
        <UploadImagesForm formik={formik} /> 

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