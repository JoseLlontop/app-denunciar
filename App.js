import React from "react";
import { AppNavigation } from "./src/navigation/AppNavigation";
import Toast from "react-native-toast-message";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  
  return (
    <>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>

      <Toast/>
    </>
  );
}
