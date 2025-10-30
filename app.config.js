module.exports = {
  expo: {
    name: "app-denunciar",
    slug: "app-denunciar",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: false,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.josellontop.appdenunciar",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      },
      usesCleartextTraffic: true,
      "googleServicesFile": "./google-services.json" // <-- Correcto
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      '@react-native-firebase/app',       // <-- Correcto
      '@react-native-firebase/app-check', // <-- Correcto
      '@react-native-firebase/auth',      // <-- Correcto
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends."
        }
      ]
      // <-- AQUÍ ES DONDE BORRAMOS EL PLUGIN DE 'react-native-dotenv'
    ]
  }
};