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

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";

export function DenunciaScreen() {
  const navigation = useNavigation();

  // --- NUEVA FUNCIÓN HELPER ---
  // Esta función se encarga de subir todas las imágenes (URIs locales)
  // y devolver un array de URLs públicas de Firebase.
  const uploadImagesToFirebase = async (localUris) => {
    const uploadedUrls = [];
    const storage = getStorage();

    // Usamos Promise.all para subir todas las imágenes en paralelo.
    // Esto es mucho más rápido que subirlas una por una.
    await Promise.all(
      localUris.map(async (uri) => {
        try {
          // 1. Convertir la URI local a un 'blob' (archivo)
          const response = await fetch(uri);
          const blob = await response.blob();
          
          // 2. Crear una referencia única en Firebase Storage
          const storageRef = ref(storage, `denuncias/${uuid()}`);
          
          // 3. Subir el archivo
          await uploadBytes(storageRef, blob);
          
          // 4. Obtener la URL de descarga pública
          const downloadUrl = await getDownloadURL(storageRef);
          
          // 5. Agregarla a nuestro array de resultados
          uploadedUrls.push(downloadUrl);

        } catch (error) {
          console.error(`Error al subir imagen: ${uri}`, error);
          // Si una imagen falla, hacemos que toda la promesa falle.
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
        // 1. Primero, subimos las imágenes a Firebase.
        // 'values.images' ahora es un array de URIs locales (ej: "file://...")
        const finalImageUrls = await uploadImagesToFirebase(values.images);

        console.log('URLs finales de imágenes:', finalImageUrls);
        
        // 2. Creamos el 'payload' para tu backend CON las URLs finales.
        const payload = {
          titulo: values.title?.trim(),
          descripcion: values.description?.trim(),
          categoria: values.category,
          latitud: Number(values?.location?.latitude),
          longitud: Number(values?.location?.longitude),
          //las URLs de Firebase para guardar en tu DB! - Con el nuevo backend descomento esto
          // imagenes: finalImageUrls, 
        };

        // 3. Enviamos el 'payload' completo a tu API
        await apiFetch(`${API_BASE_URL}/reclamos/`, {
          method: 'POST',
          body: payload,
        });

        // 4. Limpiamos el formulario
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
          // El error ahora puede venir de la subida de imágenes o de tu API
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

        <ImageBackground formik={formik} />

        <InfoForm formik={formik} />

        {/* El componente hijo no necesita cambios en su JSX */}
        <UploadImagesForm formik={formik} /> 

        <Button
          title="Crear Denuncia"
          buttonStyle={styles.submitButton}
          containerStyle={styles.submitWrapper}
          onPress={formik.handleSubmit}
          // 'isSubmitting' ahora se activa durante la subida de imágenes y durante el envío a tu API. ¡Perfecto!
          loading={formik.isSubmitting}
          disabled={formik.isSubmitting}
        />

      </ScrollView>
    </SafeAreaView>
  );
}