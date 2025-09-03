# DenunciAR (App móvil)

**Descripción**  
DenunciAR es una aplicación móvil para que ciudadanos reporten problemáticas urbanas (descripción, foto y ubicación) y hagan seguimiento de los reportes. Esta versión está pensada para ejecutarse **con Expo** y probarse desde **Expo Go** en un dispositivo móvil.

---

## Requisitos

- Node.js (recomendado: versión LTS, por ejemplo 16/18/20).  
- npm (v8+).  
- Teléfono móvil con **Expo Go** instalado (Android o iOS).  
- PC y móvil en la **misma red Wi‑Fi** para la opción `LAN`, o usar `Tunnel` si no están en la misma red.

> No es necesario instalar el CLI de Expo globalmente: usaremos `npx expo start`.

---

## Instalación

1. Clonar o copiar el repositorio:
```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

2. Instalar dependencias:
```bash
npm install
```

3. Copiar el archivo de ejemplo de variables de entorno si aplica:
```bash
cp .env.example .env
# Completar los valores dentro de .env
```

---

## Ejecutar la app y abrir en Expo Go

1. Iniciar Expo desde la carpeta del proyecto:
```bash
npx expo start
```

2. Se abrirá la interfaz de Expo (Metro) en el navegador o en la terminal.  
3. En la interfaz seleccioná la conexión (`LAN` recomendado, o `Tunnel` si no están en la misma red).  
4. Abrir **Expo Go** en el móvil y escanear el **QR** que aparece en la interfaz de Expo o en la terminal.  
5. La aplicación cargará y se ejecutará en Expo Go.



