# 📊 Sistema de Evaluación de Infraestructura de Red

Una aplicación móvil profesional desarrollada con NativeScript y Angular para la evaluación y gestión de cuartos de comunicaciones de red.

## 🚀 Características Principales

### 🔐 Autenticación y Usuarios
- Sistema de login y registro con validaciones
- Perfiles de usuario con información personal y profesional
- Recuperación de contraseña integrada
- Roles de usuario (admin, técnico, visualizador)

### 📋 Evaluaciones de Cuartos de Comunicaciones
- Formularios estructurados con criterios de evaluación
- Mediciones ambientales (temperatura, humedad)
- Sistema de prioridades (baja, media, alta, crítica)
- Captura de múltiples fotografías
- Guardado de borradores y finalización de evaluaciones

### 🔧 Gestión de Inventario de Equipos
- Categorías de equipos (router, switch, servidor, firewall, UPS, etc.)
- Estados de equipos (activo, inactivo, mantenimiento, retirado, defectuoso)
- Búsqueda y filtros avanzados
- Gestión de mantenimiento programado
- Estadísticas detalladas por categoría

### 📈 Sistema de Reportes Profesional
- Múltiples tipos de reportes (evaluaciones, inventario, mantenimiento, integral)
- Filtros avanzados por fecha, ubicación, categoría y estado
- Generación de PDF con diseño profesional
- Estadísticas automáticas y métricas de rendimiento
- Historial de reportes generados

### 📊 Dashboard Ejecutivo
- Estadísticas en tiempo real
- Alertas inteligentes para problemas críticos
- Acciones rápidas para navegación
- Actividad reciente y notificaciones

## 🛠️ Tecnologías Utilizadas

- **Frontend**: NativeScript 8.8.0 con Angular 18
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Estilos**: Tailwind CSS
- **Funcionalidades**: Cámara nativa, generación de PDF
- **Plataforma**: Aplicación móvil multiplataforma (iOS/Android)

## 📦 Instalación

### Prerrequisitos
- Node.js (versión 16 o superior)
- NativeScript CLI
- Firebase CLI
- Android Studio (para Android)
- Xcode (para iOS)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/sistema-evaluacion-red.git
cd sistema-evaluacion-red
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Firebase**
   - Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
   - Habilitar Authentication, Firestore y Storage
   - Descargar el archivo de configuración `google-services.json` (Android) y `GoogleService-Info.plist` (iOS)
   - Colocar los archivos en las carpetas correspondientes

4. **Configurar variables de entorno**
```bash
# Crear archivo .env en la raíz del proyecto
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu_proyecto_id
FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
FIREBASE_APP_ID=tu_app_id
```

5. **Ejecutar la aplicación**
```bash
# Para Android
ns run android

# Para iOS
ns run ios

# Para desarrollo web
ns run web
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── auth/                    # Componentes de autenticación
│   │   ├── login.component.ts
│   │   └── register.component.ts
│   ├── dashboard/               # Dashboard principal
│   │   └── dashboard.component.ts
│   ├── evaluation/              # Evaluaciones
│   │   └── evaluation-form.component.ts
│   ├── inventory/               # Inventario de equipos
│   │   └── inventory.component.ts
│   ├── report/                  # Sistema de reportes
│   │   └── report.component.ts
│   ├── models/                  # Modelos de datos
│   │   ├── user.model.ts
│   │   ├── evaluation.model.ts
│   │   ├── equipment.model.ts
│   │   └── report.model.ts
│   ├── services/                # Servicios de negocio
│   │   ├── auth.service.ts
│   │   ├── evaluation.service.ts
│   │   ├── equipment.service.ts
│   │   └── report.service.ts
│   ├── shared/                  # Componentes compartidos
│   │   └── components/
│   │       ├── loading.component.ts
│   │       ├── error-message.component.ts
│   │       └── confirm-dialog.component.ts
│   ├── app.component.ts
│   ├── app.module.ts
│   └── app-routing.module.ts
├── main.ts
└── app.css
```

## 🔧 Configuración de Firebase

### Authentication
- Habilitar Email/Password
- Configurar reglas de seguridad

### Firestore
```javascript
// Reglas de Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Evaluaciones
    match /evaluations/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Equipos
    match /equipment/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Usuarios
    match /users/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.id;
    }
    
    // Reportes
    match /reports/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage
```javascript
// Reglas de Storage
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /evaluations/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    match /equipment/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📱 Funcionalidades por Pantalla

### 🔐 Login/Registro
- Validación de formularios en tiempo real
- Recuperación de contraseña
- Perfiles de usuario completos
- Manejo de errores en español

### 📊 Dashboard
- Estadísticas generales del sistema
- Alertas de problemas críticos
- Acciones rápidas
- Actividad reciente

### 📋 Evaluaciones
- Formulario estructurado con criterios
- Mediciones ambientales
- Sistema de prioridades
- Captura de fotografías
- Guardado de borradores

### 🔧 Inventario
- Gestión completa de equipos
- Categorías y estados
- Búsqueda y filtros
- Programación de mantenimientos

### 📈 Reportes
- Generación de PDF profesionales
- Filtros avanzados
- Estadísticas automáticas
- Historial de reportes

## 🚀 Despliegue

### Android
```bash
# Generar APK de producción
ns build android --bundle --env.production

# Firmar APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk alias_name
```

### iOS
```bash
# Generar build de producción
ns build ios --bundle --env.production

# Abrir en Xcode para firmar y subir
open platforms/ios/AppName.xcworkspace
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [tu-github](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- NativeScript Team
- Angular Team
- Firebase Team
- Comunidad de desarrolladores

## 📞 Soporte

Para soporte técnico o preguntas, contacta:
- Email: tu-email@ejemplo.com
- GitHub Issues: [Crear un issue](https://github.com/tu-usuario/sistema-evaluacion-red/issues)

---

⭐ **¡Si te gusta este proyecto, no olvides darle una estrella!** ⭐