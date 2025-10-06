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


---

## Conectar el backend local con la aplicacion **Expo Go** en un celular (misma red Wi‑Fi)

### Pasos
1. **Desactivar Firewall de Windows (temporalmente)**
   - Panel de control → Sistema y seguridad → *Firewall de Windows Defender* → *Activar o desactivar* → desactiva en redes privadas y públicas.

2. **Levantar el backend escuchando en toda la red (0.0.0.0)**
   - **FastAPI (uvicorn)**:  
     ```bash
     uvicorn main:app --host 0.0.0.0 --port 8000 --reload
     ```

3. **Obtener la IP de tu PC en la red Wi‑Fi**
   - En Windows: `ipconfig` → busca **Dirección IPv4** (por ejemplo `192.168.100.205`).

4. **Configurar `.env` para el celular en la misma red**
   - Edita tu `.env` y reemplaza `API_BASE_URL` por la IP LAN de tu PC:
     ```env
     
     # URL base del backend (PC y celular en la MISMA Wi‑Fi)
     API_BASE_URL=http://192.168.100.205:8000
     ```

5. **Reiniciar Expo para que tome el `.env`**
   - Cierra Metro/Expo y ejecuta nuevamente:
     ```bash
     npx expo start -c
     ```

6. **Al ejecutar expo verifique que este corriendo en la misma red `LAN`**
   - Al ejecutar `npx expo start`. Escanea el QR con **Expo Go** en el celular.  
   - Verás en la terminal de VS CODE algo similar a `exp://192.168.100.205:8081`.

7. **Probar conectividad**
   - Desde el navegador del celular: abre `http://192.168.100.205:8000/` (o `/health` si existe). Debe responder.
   - En la app, las llamadas a `API_BASE_URL` deberían funcionar.

8. **(Opcional) Volver a activar el Firewall**
   - Repite el paso 1 y vuelve a **activar** el firewall al finalizar tus pruebas.

---

## Usar un **emulador** en tu PC

### Android Emulator (Windows/macOS/Linux)
- El emulador **no** llega a `127.0.0.1` del host; debe usar `http://10.0.2.2:8000` para acceder al backend del **host**.
- Tu `.env` quedaría:
  ```env

  # URL base del backend para EMULADOR ANDROID
  API_BASE_URL=http://10.0.2.2:8000
  ```

---

> Recuerda **reiniciar Metro/Expo** cada vez que cambies `.env` (por ejemplo `npx expo start -c`).



