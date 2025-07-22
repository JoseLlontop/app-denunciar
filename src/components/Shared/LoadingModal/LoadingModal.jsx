import React from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { styles } from './LoadingModal.styles';

export function LoadingModal({ show, text }) {
  
  // Si show es false, no muestra nada
  if (!show) return null;

  return (
    <View style={styles.backdrop}>
      <View style={styles.container}>
        <LottieView
          source={require('../../../../assets/animations/loading.json')}
          autoPlay
          loop
          style={styles.animation}
        />
         {/* Si llega un texto, lo muestra debajo de la animación */}
          {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </View>
  );
}