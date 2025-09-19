# 🚀 Guía para Subir el Proyecto a GitHub

## 📋 Pasos para Subir el Proyecto

### 1. Preparar el Repositorio Local

```bash
# Inicializar git si no está inicializado
git init

# Añadir todos los archivos
git add .

# Hacer el primer commit
git commit -m "feat: implementar sistema completo de evaluación de infraestructura de red

- Dashboard principal con estadísticas en tiempo real
- Sistema de autenticación mejorado con validaciones
- Formulario de evaluación profesional con criterios estructurados
- Sistema de inventario avanzado con categorías y búsqueda
- Generación de reportes PDF con diseño profesional
- Componentes reutilizables y arquitectura robusta
- UI/UX moderna con gradientes y animaciones
- Integración completa con Firebase (Auth, Firestore, Storage)
- Validaciones de formularios en tiempo real
- Manejo de errores robusto con mensajes en español"
```

### 2. Crear Repositorio en GitHub

1. Ve a [GitHub.com](https://github.com)
2. Haz clic en "New repository"
3. Configura el repositorio:
   - **Nombre**: `sistema-evaluacion-red` (o el que prefieras)
   - **Descripción**: `Sistema móvil profesional para evaluación y gestión de cuartos de comunicaciones de red`
   - **Visibilidad**: Público o Privado (tu elección)
   - **NO** marques "Add a README file" (ya tenemos uno)
   - **NO** marques "Add .gitignore" (ya tenemos uno)
   - **NO** marques "Choose a license" (ya tenemos uno)

### 3. Conectar Repositorio Local con GitHub

```bash
# Añadir el remote origin (reemplaza TU-USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/sistema-evaluacion-red.git

# Verificar que se añadió correctamente
git remote -v
```

### 4. Subir el Código

```bash
# Subir la rama main
git branch -M main
git push -u origin main
```

### 5. Configurar Firebase (Opcional pero Recomendado)

#### 5.1 Crear Proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto
3. Habilita los siguientes servicios:
   - **Authentication** → Email/Password
   - **Firestore Database** → Crear base de datos
   - **Storage** → Crear bucket de almacenamiento

#### 5.2 Configurar la Aplicación
1. En Firebase Console, ve a "Project Settings"
2. Añade una aplicación web
3. Copia la configuración y crea un archivo `.env`:

```bash
# Crear archivo .env en la raíz del proyecto
cat > .env << 'EOF'
FIREBASE_API_KEY=tu_api_key_aqui
FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu_proyecto_id_aqui
FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=tu_sender_id_aqui
FIREBASE_APP_ID=tu_app_id_aqui
EOF
```

#### 5.3 Configurar Reglas de Firestore
```javascript
// En Firebase Console → Firestore → Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /evaluations/{document} {
      allow read, write: if request.auth != null;
    }
    match /equipment/{document} {
      allow read, write: if request.auth != null;
    }
    match /users/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.id;
    }
    match /reports/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### 5.4 Configurar Reglas de Storage
```javascript
// En Firebase Console → Storage → Rules
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

### 6. Configurar GitHub Actions (Opcional)

Crear archivo `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Build project
      run: npm run build
```

### 7. Crear Releases (Opcional)

```bash
# Crear un tag para la versión
git tag -a v2.0.0 -m "Release version 2.0.0 - Sistema completo de evaluación"

# Subir el tag
git push origin v2.0.0
```

### 8. Configurar GitHub Pages (Para Documentación)

1. Ve a Settings → Pages
2. Selecciona "Deploy from a branch"
3. Elige "main" branch y "/docs" folder
4. Guarda los cambios

## 📁 Estructura Final del Proyecto

```
sistema-evaluacion-red/
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── app/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── evaluation/
│   │   ├── inventory/
│   │   ├── report/
│   │   ├── models/
│   │   ├── services/
│   │   └── shared/
│   ├── main.ts
│   └── app.css
├── .gitignore
├── .env.example
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CHANGELOG.md
├── package.json
├── tsconfig.json
├── webpack.config.js
└── nativescript.config.ts
```

## 🔧 Comandos Útiles

### Desarrollo
```bash
# Instalar dependencias
npm install

# Ejecutar en Android
ns run android

# Ejecutar en iOS
ns run ios

# Ejecutar en web
ns run web

# Build para producción
ns build android --bundle --env.production
```

### Git
```bash
# Ver estado
git status

# Añadir cambios
git add .

# Commit
git commit -m "mensaje descriptivo"

# Push
git push origin main

# Pull
git pull origin main

# Crear rama
git checkout -b feature/nueva-funcionalidad

# Cambiar a rama
git checkout main
```

## 📝 Notas Importantes

1. **Nunca subas** archivos `.env` con credenciales reales
2. **Usa** `.env.example` para documentar las variables necesarias
3. **Configura** las reglas de Firebase antes de usar la aplicación
4. **Prueba** la aplicación en diferentes dispositivos
5. **Documenta** cualquier cambio importante en el CHANGELOG.md

## 🎉 ¡Listo!

Tu proyecto ahora está en GitHub y listo para ser usado. Los usuarios pueden:

1. Clonar el repositorio
2. Instalar dependencias
3. Configurar Firebase
4. Ejecutar la aplicación

¡Felicidades por completar tu sistema de evaluación de infraestructura de red! 🚀
