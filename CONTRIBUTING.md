# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al Sistema de Evaluación de Infraestructura de Red! 

## 📋 Cómo Contribuir

### 1. Fork y Clone
```bash
# Fork el repositorio en GitHub
# Luego clona tu fork localmente
git clone https://github.com/tu-usuario/sistema-evaluacion-red.git
cd sistema-evaluacion-red
```

### 2. Configurar el Entorno
```bash
# Instalar dependencias
npm install

# Configurar el remote upstream
git remote add upstream https://github.com/original-repo/sistema-evaluacion-red.git
```

### 3. Crear una Rama
```bash
# Crear una nueva rama para tu feature
git checkout -b feature/nombre-de-tu-feature

# O para un bugfix
git checkout -b fix/descripcion-del-bug
```

### 4. Hacer Cambios
- Sigue las convenciones de código existentes
- Añade comentarios cuando sea necesario
- Actualiza la documentación si es necesario
- Añade tests si es posible

### 5. Commit y Push
```bash
# Añadir cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: añadir nueva funcionalidad de búsqueda"

# Push a tu fork
git push origin feature/nombre-de-tu-feature
```

### 6. Crear Pull Request
- Ve a GitHub y crea un Pull Request
- Describe claramente los cambios realizados
- Menciona cualquier issue relacionado

## 📝 Convenciones de Código

### Commits
Usa el formato de Conventional Commits:
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `style:` cambios de formato (espacios, comas, etc.)
- `refactor:` refactorización de código
- `test:` añadir o modificar tests
- `chore:` cambios en herramientas, configuración, etc.

### Código TypeScript
```typescript
// Usar interfaces para modelos
export interface User {
  id: string;
  name: string;
  email: string;
}

// Usar servicios para lógica de negocio
@Injectable()
export class UserService {
  // Métodos públicos primero
  public async getUser(id: string): Promise<User> {
    // Implementación
  }
  
  // Métodos privados al final
  private validateUser(user: User): boolean {
    // Implementación
  }
}
```

### Componentes Angular
```typescript
@Component({
  selector: 'app-example',
  template: `
    <!-- Template aquí -->
  `,
  styles: [`
    /* Estilos aquí */
  `]
})
export class ExampleComponent implements OnInit {
  // Propiedades públicas primero
  public data: any[] = [];
  
  // Constructor
  constructor(private service: ExampleService) {}
  
  // Lifecycle hooks
  ngOnInit(): void {
    // Implementación
  }
  
  // Métodos públicos
  public onAction(): void {
    // Implementación
  }
  
  // Métodos privados
  private helperMethod(): void {
    // Implementación
  }
}
```

## 🧪 Testing

### Antes de hacer commit
```bash
# Ejecutar tests
npm test

# Verificar linting
npm run lint

# Verificar tipos
npm run type-check
```

## 📚 Documentación

### Nuevas Funcionalidades
- Actualiza el README.md si es necesario
- Añade comentarios JSDoc a funciones públicas
- Documenta cambios en CHANGELOG.md

### Estructura de Archivos
```
src/app/
├── feature-name/
│   ├── components/     # Componentes específicos
│   ├── services/       # Servicios específicos
│   ├── models/         # Modelos específicos
│   └── feature-name.component.ts
```

## 🐛 Reportar Bugs

### Antes de reportar
1. Verifica que no sea un problema conocido
2. Busca en los issues existentes
3. Prueba con la última versión

### Información necesaria
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica
- Información del sistema (OS, versión de Node, etc.)

## ✨ Sugerir Mejoras

### Antes de sugerir
1. Verifica que no esté ya sugerido
2. Piensa en la implementación
3. Considera el impacto en otros usuarios

### Información necesaria
- Descripción clara de la mejora
- Casos de uso
- Alternativas consideradas
- Impacto esperado

## 📋 Checklist para Pull Requests

- [ ] Código sigue las convenciones del proyecto
- [ ] Tests pasan correctamente
- [ ] Documentación actualizada
- [ ] Commits descriptivos
- [ ] No hay conflictos con la rama principal
- [ ] Screenshots añadidos si es necesario

## 🎯 Tipos de Contribuciones

### 🐛 Bug Fixes
- Corregir errores existentes
- Mejorar manejo de errores
- Optimizar rendimiento

### ✨ Nuevas Funcionalidades
- Añadir nuevas características
- Mejorar funcionalidades existentes
- Integrar nuevas APIs

### 📚 Documentación
- Mejorar README
- Añadir comentarios de código
- Crear guías de usuario

### 🎨 UI/UX
- Mejorar diseño
- Añadir animaciones
- Optimizar experiencia móvil

### 🧪 Testing
- Añadir tests unitarios
- Mejorar cobertura
- Añadir tests de integración

## 🏷️ Etiquetas de Issues

- `bug` - Algo no funciona
- `enhancement` - Nueva funcionalidad o mejora
- `documentation` - Mejoras en documentación
- `good first issue` - Bueno para principiantes
- `help wanted` - Se necesita ayuda extra
- `priority: high` - Alta prioridad
- `priority: medium` - Prioridad media
- `priority: low` - Baja prioridad

## 📞 Contacto

Si tienes preguntas sobre contribuir:
- Abre un issue en GitHub
- Contacta a los maintainers
- Únete a las discusiones

---

¡Gracias por contribuir y hacer este proyecto mejor! 🚀
