import React, { useEffect } from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-toast-message";
import { AppNavigation } from "./src/navigation/AppNavigation";
import { AuthProvider } from "./src/context/AuthContext";
import 'react-native-get-random-values';
import { getApp } from '@react-native-firebase/app';
import { ReactNativeFirebaseAppCheckProvider, initializeAppCheck } from '@react-native-firebase/app-check';

import { LogBox } from 'react-native';

LogBox.ignoreLogs(['This method is deprecated']); 
LogBox.ignoreLogs(['The app is running using the Legacy Architecture.']); 

export default function App() {
    useEffect(() => {
        (async function initAppCheckModular() {
  const rnfbProvider = new ReactNativeFirebaseAppCheckProvider();
  rnfbProvider.configure({
    android: { provider: __DEV__ ? 'debug' : 'playIntegrity' },
  });

  await initializeAppCheck(getApp(), {
    provider: rnfbProvider,
    isTokenAutoRefreshEnabled: true,
  });
})();
  }, []);

  return (
    <RootSiblingParent>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
        <Toast topOffset={Platform.OS === "ios" ? 60 : 40} />
      </AuthProvider>
    </RootSiblingParent>
  );
}