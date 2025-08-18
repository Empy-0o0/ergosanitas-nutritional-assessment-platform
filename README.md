# 🏥 ErgoSanitas - Plataforma de Evaluación Nutricional ABCD

Una plataforma profesional especializada en nutrición deportiva para atletas juveniles, basada en el modelo científico ABCD de evaluación del estado nutricional.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

## 📋 Descripción

ErgoSanitas es una aplicación web moderna diseñada para profesionales de la nutrición deportiva que trabajan con atletas juveniles (5-18 años). Implementa el modelo ABCD de evaluación nutricional de manera integral y automatizada.

### 🎯 Modelo ABCD Implementado

- **A: Antropometría** - Mediciones corporales y composición física
- **B: Bioquímica** - Análisis de laboratorio y marcadores nutricionales  
- **C: Clínica** - Evaluación funcional y signos vitales
- **D: Dietética** - Análisis de hábitos alimentarios y patrones nutricionales

## ✨ Características Principales

### 🏗️ Arquitectura Moderna
- **Frontend**: Next.js 14 con App Router
- **Lenguaje**: TypeScript para mayor seguridad de tipos
- **Estilos**: Tailwind CSS para diseño responsive
- **Componentes**: Arquitectura modular y reutilizable

### 📊 Funcionalidades Clave

#### Dashboard Profesional
- Estadísticas en tiempo real de deportistas
- Sistema de alertas nutricionales
- Búsqueda y filtrado avanzado
- Visualización de estados nutricionales

#### Sistema de Evaluación ABCD
- **Evaluación paso a paso** con navegación intuitiva
- **Cálculos automáticos** de IMC, percentiles, riesgo cardiovascular
- **Interpretación profesional** de resultados
- **Base de datos robusta** con datos de ejemplo

#### Análisis Especializado
- Cálculo de necesidades calóricas por deporte
- Evaluación de estado de hierro y deficiencias
- Timing de nutrientes para optimización deportiva
- Análisis de hidratación y recuperación

### 🎨 Diseño y UX
- **Interfaz médica profesional** con colores diferenciados por sección
- **Responsive design** para escritorio, tablet y móvil
- **Tipografías modernas** (Inter, Montserrat)
- **Sin dependencias de iconos externos**

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Empy-0o0/ergosanitas-nutritional-assessment-platform.git

# Navegar al directorio
cd ergosanitas-nutritional-assessment-platform

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
ergo-sanitas/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Dashboard principal
│   ├── components/
│   │   └── evaluations/       # Componentes de evaluación ABCD
│   │       ├── ABCDEvaluationForm.tsx
│   │       ├── AnthropometryForm.tsx
│   │       ├── BiochemistryForm.tsx
│   │       ├── ClinicalForm.tsx
│   │       └── DieteticsForm.tsx
│   ├── lib/
│   │   ├── types.ts           # Tipos TypeScript
│   │   ├── calculations.ts    # Cálculos nutricionales
│   │   ├── storage.ts         # Gestión de datos
│   │   └── utils.ts           # Utilidades
│   └── data/
│       ├── references.ts      # Valores de referencia
│       └── sampleData.ts      # Datos de ejemplo
├── public/                    # Archivos estáticos
└── package.json
```

## 👥 Datos de Ejemplo

La aplicación incluye 5 deportistas de ejemplo con datos ABCD completos:

- **Carlos Rodríguez** (12 años) - Estado nutricional normal
- **María Fernández** (15 años) - En riesgo por deficiencia de hierro
- **Javier López** (8 años) - Estado normal, categoría iniciación
- **Ana Martínez** (17 años) - Alerta por bajo peso y deficiencias
- **Pedro Sánchez** (10 años) - Normal con alergias controladas

## 🔬 Cálculos Implementados

### Antropometría
- IMC y percentiles por edad/género
- Área muscular del brazo
- Índice cintura/cadera
- Estimación de grasa corporal por pliegues

### Bioquímica
- Evaluación de estado de hierro
- Riesgo cardiovascular
- Análisis de perfil lipídico
- Interpretación de vitaminas y minerales

### Clínica
- Evaluación de signos vitales
- Frecuencia cardíaca objetivo
- Estado de hidratación
- Capacidad de recuperación

### Dietética
- Necesidades calóricas por deporte
- Distribución de macronutrientes
- Timing de nutrientes
- Análisis de calidad dietética

## 🎯 Casos de Uso

### Para Nutricionistas Deportivos
- Evaluación integral de atletas juveniles
- Seguimiento longitudinal del estado nutricional
- Generación de recomendaciones personalizadas
- Detección temprana de deficiencias

### Para Centros Deportivos
- Gestión de múltiples deportistas
- Reportes de estado nutricional del equipo
- Alertas automáticas de riesgo
- Base de datos centralizada

### Para Investigación
- Recopilación de datos antropométricos
- Análisis de patrones nutricionales
- Estudios longitudinales
- Validación de intervenciones

## 🛠️ Tecnologías Utilizadas

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos utilitarios
- **React Hooks** - Gestión de estado moderno
- **Local Storage** - Persistencia de datos del lado cliente

## 📈 Roadmap Futuro

- [ ] Integración con bases de datos externas
- [ ] Sistema de autenticación y roles
- [ ] Generación de reportes PDF
- [ ] API REST para integración con otros sistemas
- [ ] Módulo de seguimiento temporal
- [ ] Gráficos y visualizaciones avanzadas
- [ ] Exportación de datos a Excel/CSV
- [ ] Sistema de notificaciones push

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

**ErgoSanitas Team**
- Email: info@ergosanitas.com
- Website: [ergosanitas.com](https://ergosanitas.com)

## 🙏 Agradecimientos

- Basado en el modelo científico "El ABCD de la Evaluación del Estado Nutricional"
- Diseñado para profesionales de la nutrición deportiva
- Desarrollado con las mejores prácticas de desarrollo web moderno

---

**⚡ ErgoSanitas - Optimizando el rendimiento deportivo a través de la nutrición científica**
