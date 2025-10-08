import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext'; 
import { screen } from '../../utils/screenName';
import { styles } from './MapaDenunciaScreen.styles';

export function MapaDenunciaScreen() {
  const navigation = useNavigation();
  const { user, isLoading } = useAuth();
  const showFab = !isLoading && !!user;

  return (
    <View style={styles.container}>
      <Text>MapaDenuncia</Text>

      {showFab && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate(screen.denuncia.tab, {
              screen: screen.denuncia.denuncia,
            })
          }
          accessibilityRole="button"
          accessibilityLabel="Agregar denuncia"
        >
          <Icon type="material-community" name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}