// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Asegúrate de procesar archivos .cjs (Firebase JS SDK los usa)
config.resolver.sourceExts.push('cjs');

// ¡Importante! Deshabilita los package exports estrictos
config.resolver.unstable_enablePackageExports = false;

module.exports = config;