import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Overlay, Icon } from "react-native-elements";
import { styles } from "./TermsModal.styles"; // Crearemos este archivo a continuación

export function TermsModal({ isVisible, onClose }) {
  const title = "Términos y Condiciones de Uso";

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={onClose}
      overlayStyle={styles.overlay}
    >
      <View style={styles.container}>
        {/* Botón de Cerrar */}
        <View style={styles.closeButtonContainer}>
          <Icon
            type="material-community"
            name="close"
            onPress={onClose}
            size={28}
            color="#8e8e93"
          />
        </View>

        {/* Título */}
        <Text style={styles.title}>{title}</Text>

        {/* Contenido con Scroll */}
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.bodyText}>
            En la ciudad de La Plata, estos
            Términos y Condiciones regulan el acceso y uso de la plataforma web y
            móvil DenunciAR, ofrecida por el Equipo DenunciAR.
          </Text>
          <Text style={styles.bodyText}>
            Estos Términos y Condiciones constituyen un contrato vinculante entre
            el Usuario y el Equipo DenunciAR. El acceso o uso de la plataforma
            implica la aceptación total y sin reservas de este documento.
          </Text>

          <Text style={styles.heading}>1. DEFINICIONES</Text>
          <Text style={styles.bodyText}>
            • <Text style={styles.bold}>Usuario:</Text> Toda persona natural
            mayor de edad que accede, se registra o utiliza la plataforma
            DenunciAR.
          </Text>
          <Text style={styles.bodyText}>
            • <Text style={styles.bold}>Denunciante:</Text> Usuario que reporta
            una incidencia urbana a través de la plataforma.
          </Text>
          <Text style={styles.bodyText}>
            • <Text style={styles.bold}>Receptor Municipal:</Text> Usuario
            autorizado por la Municipalidad de La Plata para recibir, gestionar y
            dar seguimiento a las denuncias.
          </Text>
          <Text style={styles.bodyText}>
            • <Text style={styles.bold}>Servicios:</Text> Funcionalidades de
            DenunciAR, incluyendo creación de reportes, seguimiento de denuncias,
            notificaciones y acceso a datos estadísticos.
          </Text>

          <Text style={styles.heading}>2. REGISTRO Y CUENTAS</Text>
          <Text style={styles.bodyText}>
            • Para utilizar los Servicios, el Usuario debe registrarse
            proporcionando datos veraces y actualizados (nombre, correo
            electrónico, ubicación).
          </Text>
          <Text style={styles.bodyText}>
            • El Usuario es responsable de la confidencialidad de sus
            credenciales y de cualquier actividad realizada bajo su cuenta.
          </Text>
          <Text style={styles.bodyText}>
            • DenunciAR podrá suspender o cancelar cuentas en caso de
            incumplimiento de estos Térmicios o uso fraudulento.
          </Text>

          <Text style={styles.heading}>3. USO DE LOS SERVICIOS</Text>
          <Text style={styles.bodyText}>
            • <Text style={styles.bold}>Reportes de Incidencias:</Text> El
            Denunciante podrá crear y enviar reportes con descripción, fotos y
            ubicación geográfica de la incidencia urbana.
          </Text>
          <Text style={styles.bodyText}>
            • <Text style={styles.bold}>Seguimiento:</Text> El Receptor Municipal
            gestionará la denuncia e informará al Denunciante sobre el estado y
            resolución.
          </Text>
          <Text style={styles.bodyText}>
            • <Text style={styles.bold}>Notificaciones:</Text> La plataforma
            enviará alertas al Usuario acerca del avance de sus reportes y
            actividades relevantes.
          </Text>

          <Text style={styles.heading}>4. OBLIGACIONES DEL USUARIO</Text>
          <Text style={styles.bodyText}>
            • Proporcionar información precisa y no falsa; se prohíbe el envío de
            denuncias maliciosas o infundadas.
          </Text>
          <Text style={styles.bodyText}>
            • Respetar los derechos de terceros y las normas legales vigentes; no
            cargar contenido ofensivo, difamatorio o ilegal.
          </Text>
          <Text style={styles.bodyText}>
            • No intentar vulnerar la seguridad de la plataforma ni ejecutar
            acciones que comprometan su disponibilidad.
          </Text>

          <Text style={styles.heading}>5. OBLIGACIONES DE DENUNCIAR</Text>
          <Text style={styles.bodyText}>
            • Mantener la plataforma operativa y actualizarla regularmente para
            garantizar la correcta prestación de los Servicios.
          </Text>
          <Text style={styles.bodyText}>
            • Proteger la información personal de los Usuarios conforme a su
            Política de Privacidad.
          </Text>
          <Text style={styles.bodyText}>
            • Brindar soporte técnico y canal de contacto para consultas o
            incidencia en el uso de la plataforma.
          </Text>

          <Text style={styles.heading}>6. PROPIEDAD INTELECTUAL</Text>
          <Text style={styles.bodyText}>
            • Todos los derechos de propiedad intelectual e industrial sobre la
            plataforma, su código fuente, diseños, marcas y contenidos son de
            titularidad exclusiva de DenunciAR.
          </Text>

          <Text style={styles.heading}>7. PROTECCIÓN DE DATOS Y PRIVACIDAD</Text>
          <Text style={styles.bodyText}>
            • El tratamiento de datos personales se regirá por la Política de
            Privacidad de DenunciAR, disponible en nuestra web.
          </Text>

          <Text style={styles.heading}>8. EXENCIÓN DE RESPONSABILIDAD</Text>
          <Text style={styles.bodyText}>
            • DenunciAR no será responsable por daños directos, indirectos, lucro
            cesante o cualquier perjuicio derivado del uso inadecuado de la
            plataforma.
          </Text>

          <Text style={styles.heading}>9. MODIFICACIONES</Text>
          <Text style={styles.bodyText}>
            • DenunciAR se reserva el derecho de modificar estos Términos en
            cualquier momento.
          </Text>
          <Text style={styles.bodyText}>
            • Si el Usuario no está de acuerdo con las modificaciones, deberá
            dejar de utilizar la plataforma.
          </Text>

          <Text style={styles.heading}>10. LEY APLICABLE Y JURISDICCIÓN</Text>
          <Text style={styles.bodyText}>
            • Estos Términos se regirán por las leyes de la República Argentina.
          </Text>

          <Text style={styles.heading}>CONTACTO</Text>
          <Text style={styles.bodyText}>
            • Para consultas sobre estos Términos y Condiciones, escribir a:
            soporte@denunciar.lp.gob.ar
          </Text>
        </ScrollView>
      </View>
    </Overlay>
  );
}