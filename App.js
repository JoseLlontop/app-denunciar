import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-toast-message";
import { AppNavigation } from "./src/navigation/AppNavigation";

export default function App() {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>

      {/* Montar Toast una sola vez y al final del árbol */}
      <Toast topOffset={Platform.OS === "ios" ? 60 : 40} />
    </RootSiblingParent>
  );
}
