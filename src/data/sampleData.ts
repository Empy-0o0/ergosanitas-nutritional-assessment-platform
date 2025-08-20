import { Athlete, ABCDEvaluation, AnthropometryData, BiochemistryData, ClinicalData, DieteticsData } from '@/lib/types'
import { generateId } from '@/lib/utils'

// Datos de ejemplo completos para cada sección ABCD
export const SAMPLE_ATHLETES_ABCD: Athlete[] = [
  {
    id: "athlete-carlos-rodriguez-001",
    fullName: 'Carlos Rodríguez',
    birthDate: '2011-03-15',
    age: 12,
    gender: 'male',
    club: 'Club Deportivo Juvenil',
    position: 'Mediocampista',
    category: '9-13',
    evaluationDate: '2024-01-15',
    nutritionalStatus: 'normal',
    lastEvaluation: '2024-01-15',
    anthropometry: {
      height: 150,
      weight: 45,
      bmi: 20.0,
      bodyFatPercentage: 12,
      muscleMass: 32,
      waistCircumference: 70,
      hipCircumference: 85,
      armCircumference: 25,
      skinfoldMeasurements: {
        triceps: 10,
        biceps: 8,
        subscapular: 12,
        suprailiac: 15
      },
      percentiles: {
        heightPercentile: 75,
        weightPercentile: 70,
        bmiPercentile: 65
      }
    },
    biochemistry: {
      hemoglobin: 13.5,
      hematocrit: 42,
      iron: 95,
      ferritin: 45,
      vitaminD: 32,
      vitaminB12: 450,
      folate: 8.5,
      glucose: 88,
      cholesterol: {
        total: 165,
        hdl: 55,
        ldl: 95,
        triglycerides: 75
      },
      proteins: {
        totalProtein: 7.2,
        albumin: 4.1,
        prealbumin: 25
      },
      electrolytes: {
        sodium: 140,
        potassium: 4.2,
        calcium: 9.8,
        magnesium: 2.1
      },
      lastTestDate: '2024-01-10'
    },
    clinical: {
      vitalSigns: {
        bloodPressure: { systolic: 110, diastolic: 70 },
        heartRate: 75,
        respiratoryRate: 16,
        temperature: 36.6
      },
      physicalExamination: {
        generalAppearance: 'buena',
        skinCondition: 'normal',
        oralHealth: 'buena',
        lymphNodes: 'normal',
        edema: false,
        dehydrationSigns: false
      },
      functionalAssessment: {
        energyLevel: 'high',
        sleepQuality: 'good',
        digestiveSymptoms: [],
        appetiteLevel: 'good',
        fatigueLevel: 'none'
      },
      medicalHistory: {
        allergies: [],
        medications: [],
        chronicConditions: [],
        injuries: ['Esguince tobillo (2023)']
      },
      performanceMetrics: {
        vo2Max: 48,
        strength: 7,
        endurance: 8,
        flexibility: 6,
        speed: 7
      }
    },
    dietetics: {
      dailyIntake: {
        calories: 2400,
        protein: 95,
        carbohydrates: 330,
        fats: 80,
        fiber: 28,
        water: 2.8
      },
      mealPattern: {
        mealsPerDay: 4,
        breakfastTime: '07:00',
        lunchTime: '12:30',
        dinnerTime: '19:00',
        snacks: 2
      },
      foodPreferences: {
        likes: ['Pasta', 'Pollo', 'Frutas', 'Yogur'],
        dislikes: ['Pescado', 'Verduras verdes'],
        restrictions: [],
        culturalPreferences: ['Comida mediterránea']
      },
      supplementation: {
        vitamins: ['Vitamina D'],
        minerals: [],
        proteins: [],
        other: []
      },
      hydrationHabits: {
        waterIntake: 2.8,
        sportsdrinks: true,
        caffeineIntake: 0
      },
      eatingBehavior: {
        eatingSpeed: 'normal',
        portionSizes: 'normal',
        emotionalEating: false,
        socialEating: true
      },
      nutritionalKnowledge: {
        level: 'basic',
        areas: ['Hidratación', 'Timing de comidas']
      }
    }
  },
  {
    id: "athlete-maria-fernandez-002",
    fullName: 'María Fernández',
    birthDate: '2008-07-22',
    age: 15,
    gender: 'female',
    club: 'Academia Fútbol Femenino',
    position: 'Delantera',
    category: '14-18',
    evaluationDate: '2024-01-10',
    nutritionalStatus: 'warning',
    lastEvaluation: '2024-01-10',
    anthropometry: {
      height: 165,
      weight: 52,
      bmi: 19.1,
      bodyFatPercentage: 18,
      muscleMass: 38,
      waistCircumference: 68,
      hipCircumference: 92,
      armCircumference: 24,
      skinfoldMeasurements: {
        triceps: 14,
        biceps: 10,
        subscapular: 16,
        suprailiac: 18
      },
      percentiles: {
        heightPercentile: 80,
        weightPercentile: 60,
        bmiPercentile: 45
      }
    },
    biochemistry: {
      hemoglobin: 11.8,
      hematocrit: 38,
      iron: 65,
      ferritin: 18,
      vitaminD: 22,
      vitaminB12: 380,
      folate: 6.2,
      glucose: 92,
      cholesterol: {
        total: 185,
        hdl: 48,
        ldl: 115,
        triglycerides: 110
      },
      proteins: {
        totalProtein: 6.8,
        albumin: 3.9,
        prealbumin: 22
      },
      electrolytes: {
        sodium: 138,
        potassium: 3.8,
        calcium: 9.2,
        magnesium: 1.9
      },
      lastTestDate: '2024-01-05'
    },
    clinical: {
      vitalSigns: {
        bloodPressure: { systolic: 105, diastolic: 65 },
        heartRate: 68,
        respiratoryRate: 14,
        temperature: 36.4
      },
      physicalExamination: {
        generalAppearance: 'regular',
        skinCondition: 'palida',
        oralHealth: 'buena',
        lymphNodes: 'normal',
        edema: false,
        dehydrationSigns: false
      },
      functionalAssessment: {
        energyLevel: 'low',
        sleepQuality: 'fair',
        digestiveSymptoms: [],
        appetiteLevel: 'fair',
        fatigueLevel: 'mild'
      },
      medicalHistory: {
        allergies: [],
        medications: [],
        chronicConditions: [],
        injuries: []
      },
      performanceMetrics: {
        vo2Max: 42,
        strength: 6,
        endurance: 6,
        flexibility: 8,
        speed: 8
      }
    },
    dietetics: {
      dailyIntake: {
        calories: 1800,
        protein: 65,
        carbohydrates: 220,
        fats: 60,
        fiber: 18,
        water: 2.2
      },
      mealPattern: {
        mealsPerDay: 3,
        breakfastTime: '07:30',
        lunchTime: '13:00',
        dinnerTime: '20:00',
        snacks: 1
      },
      foodPreferences: {
        likes: ['Ensaladas', 'Frutas', 'Cereales'],
        dislikes: ['Carnes rojas', 'Lácteos'],
        restrictions: ['Lactosa'],
        culturalPreferences: []
      },
      supplementation: {
        vitamins: ['Hierro', 'Vitamina D'],
        minerals: ['Calcio'],
        proteins: [],
        other: []
      },
      hydrationHabits: {
        waterIntake: 2.2,
        sportsdrinks: false,
        caffeineIntake: 50
      },
      eatingBehavior: {
        eatingSpeed: 'fast',
        portionSizes: 'small',
        emotionalEating: true,
        socialEating: false
      },
      nutritionalKnowledge: {
        level: 'intermediate',
        areas: ['Nutrición deportiva', 'Suplementación']
      }
    }
  },
  {
    id: "athlete-javier-lopez-003",
    fullName: 'Javier López',
    birthDate: '2015-11-08',
    age: 8,
    gender: 'male',
    club: 'Escuela de Fútbol Infantil',
    position: 'Defensa',
    category: '5-8',
    evaluationDate: '2024-01-05',
    nutritionalStatus: 'normal',
    lastEvaluation: '2024-01-05',
    anthropometry: {
      height: 125,
      weight: 28,
      bmi: 17.9,
      bodyFatPercentage: 15,
      muscleMass: 20,
      waistCircumference: 58,
      hipCircumference: 70,
      armCircumference: 18,
      skinfoldMeasurements: {
        triceps: 12,
        biceps: 9,
        subscapular: 10,
        suprailiac: 12
      },
      percentiles: {
        heightPercentile: 70,
        weightPercentile: 65,
        bmiPercentile: 60
      }
    },
    biochemistry: {
      hemoglobin: 12.2,
      hematocrit: 38,
      iron: 85,
      ferritin: 35,
      vitaminD: 28,
      vitaminB12: 420,
      folate: 9.1,
      glucose: 85,
      cholesterol: {
        total: 155,
        hdl: 58,
        ldl: 85,
        triglycerides: 60
      },
      proteins: {
        totalProtein: 6.9,
        albumin: 4.0,
        prealbumin: 24
      },
      electrolytes: {
        sodium: 139,
        potassium: 4.0,
        calcium: 9.5,
        magnesium: 2.0
      },
      lastTestDate: '2024-01-02'
    },
    clinical: {
      vitalSigns: {
        bloodPressure: { systolic: 95, diastolic: 60 },
        heartRate: 85,
        respiratoryRate: 18,
        temperature: 36.7
      },
      physicalExamination: {
        generalAppearance: 'excelente',
        skinCondition: 'normal',
        oralHealth: 'excelente',
        lymphNodes: 'normal',
        edema: false,
        dehydrationSigns: false
      },
      functionalAssessment: {
        energyLevel: 'high',
        sleepQuality: 'excellent',
        digestiveSymptoms: [],
        appetiteLevel: 'excellent',
        fatigueLevel: 'none'
      },
      medicalHistory: {
        allergies: [],
        medications: [],
        chronicConditions: [],
        injuries: []
      },
      performanceMetrics: {
        vo2Max: 45,
        strength: 5,
        endurance: 6,
        flexibility: 7,
        speed: 6
      }
    },
    dietetics: {
      dailyIntake: {
        calories: 1800,
        protein: 70,
        carbohydrates: 250,
        fats: 65,
        fiber: 20,
        water: 2.0
      },
      mealPattern: {
        mealsPerDay: 4,
        breakfastTime: '07:00',
        lunchTime: '12:00',
        dinnerTime: '18:30',
        snacks: 3
      },
      foodPreferences: {
        likes: ['Pizza', 'Hamburguesas', 'Helado', 'Frutas'],
        dislikes: ['Verduras', 'Pescado'],
        restrictions: [],
        culturalPreferences: []
      },
      supplementation: {
        vitamins: ['Multivitamínico'],
        minerals: [],
        proteins: [],
        other: []
      },
      hydrationHabits: {
        waterIntake: 2.0,
        sportsdrinks: false,
        caffeineIntake: 0
      },
      eatingBehavior: {
        eatingSpeed: 'fast',
        portionSizes: 'normal',
        emotionalEating: false,
        socialEating: true
      },
      nutritionalKnowledge: {
        level: 'low',
        areas: []
      }
    }
  },
  {
    id: "athlete-ana-martinez-004",
    fullName: 'Ana Martínez',
    birthDate: '2006-12-03',
    age: 17,
    gender: 'female',
    club: 'Club Atlético Femenino',
    position: 'Portera',
    category: '14-18',
    evaluationDate: '2024-01-01',
    nutritionalStatus: 'danger',
    lastEvaluation: '2024-01-01',
    anthropometry: {
      height: 170,
      weight: 48,
      bmi: 16.6,
      bodyFatPercentage: 14,
      muscleMass: 35,
      waistCircumference: 62,
      hipCircumference: 85,
      armCircumference: 22,
      skinfoldMeasurements: {
        triceps: 8,
        biceps: 6,
        subscapular: 9,
        suprailiac: 10
      },
      percentiles: {
        heightPercentile: 85,
        weightPercentile: 25,
        bmiPercentile: 15
      }
    },
    biochemistry: {
      hemoglobin: 10.5,
      hematocrit: 32,
      iron: 45,
      ferritin: 8,
      vitaminD: 15,
      vitaminB12: 280,
      folate: 4.8,
      glucose: 78,
      cholesterol: {
        total: 145,
        hdl: 42,
        ldl: 88,
        triglycerides: 75
      },
      proteins: {
        totalProtein: 6.2,
        albumin: 3.5,
        prealbumin: 18
      },
      electrolytes: {
        sodium: 136,
        potassium: 3.6,
        calcium: 8.8,
        magnesium: 1.7
      },
      lastTestDate: '2023-12-28'
    },
    clinical: {
      vitalSigns: {
        bloodPressure: { systolic: 100, diastolic: 60 },
        heartRate: 58,
        respiratoryRate: 12,
        temperature: 36.2
      },
      physicalExamination: {
        generalAppearance: 'deficiente',
        skinCondition: 'palida',
        oralHealth: 'regular',
        lymphNodes: 'normal',
        edema: false,
        dehydrationSigns: true
      },
      functionalAssessment: {
        energyLevel: 'low',
        sleepQuality: 'poor',
        digestiveSymptoms: ['Náuseas ocasionales'],
        appetiteLevel: 'poor',
        fatigueLevel: 'severe'
      },
      medicalHistory: {
        allergies: [],
        medications: [],
        chronicConditions: [],
        injuries: ['Lesión rodilla (2023)']
      },
      performanceMetrics: {
        vo2Max: 35,
        strength: 4,
        endurance: 4,
        flexibility: 6,
        speed: 5
      }
    },
    dietetics: {
      dailyIntake: {
        calories: 1400,
        protein: 45,
        carbohydrates: 180,
        fats: 45,
        fiber: 15,
        water: 1.8
      },
      mealPattern: {
        mealsPerDay: 2,
        breakfastTime: '08:00',
        lunchTime: '14:00',
        dinnerTime: '21:00',
        snacks: 0
      },
      foodPreferences: {
        likes: ['Ensaladas', 'Té'],
        dislikes: ['Carnes', 'Dulces', 'Grasas'],
        restrictions: ['Evita carbohidratos'],
        culturalPreferences: []
      },
      supplementation: {
        vitamins: ['Hierro', 'B12', 'Vitamina D'],
        minerals: ['Calcio', 'Magnesio'],
        proteins: [],
        other: []
      },
      hydrationHabits: {
        waterIntake: 1.8,
        sportsdrinks: false,
        caffeineIntake: 200
      },
      eatingBehavior: {
        eatingSpeed: 'slow',
        portionSizes: 'small',
        emotionalEating: true,
        socialEating: false
      },
      nutritionalKnowledge: {
        level: 'advanced',
        areas: ['Control de peso', 'Nutrición deportiva', 'Suplementación']
      }
    }
  },
  {
    id: "athlete-pedro-sanchez-005",
    fullName: 'Pedro Sánchez',
    birthDate: '2013-05-18',
    age: 10,
    gender: 'male',
    club: 'Deportivo Juvenil',
    position: 'Mediocampista',
    category: '9-13',
    evaluationDate: '2023-12-28',
    nutritionalStatus: 'normal',
    lastEvaluation: '2023-12-28',
    anthropometry: {
      height: 140,
      weight: 35,
      bmi: 17.9,
      bodyFatPercentage: 13,
      muscleMass: 26,
      waistCircumference: 65,
      hipCircumference: 78,
      armCircumference: 21,
      skinfoldMeasurements: {
        triceps: 11,
        biceps: 8,
        subscapular: 11,
        suprailiac: 13
      },
      percentiles: {
        heightPercentile: 65,
        weightPercentile: 60,
        bmiPercentile: 55
      }
    },
    biochemistry: {
      hemoglobin: 13.0,
      hematocrit: 40,
      iron: 90,
      ferritin: 40,
      vitaminD: 30,
      vitaminB12: 400,
      folate: 8.0,
      glucose: 90,
      cholesterol: {
        total: 160,
        hdl: 52,
        ldl: 92,
        triglycerides: 80
      },
      proteins: {
        totalProtein: 7.0,
        albumin: 4.0,
        prealbumin: 23
      },
      electrolytes: {
        sodium: 140,
        potassium: 4.1,
        calcium: 9.6,
        magnesium: 2.0
      },
      lastTestDate: '2023-12-25'
    },
    clinical: {
      vitalSigns: {
        bloodPressure: { systolic: 105, diastolic: 65 },
        heartRate: 80,
        respiratoryRate: 16,
        temperature: 36.5
      },
      physicalExamination: {
        generalAppearance: 'buena',
        skinCondition: 'normal',
        oralHealth: 'buena',
        lymphNodes: 'normal',
        edema: false,
        dehydrationSigns: false
      },
      functionalAssessment: {
        energyLevel: 'normal',
        sleepQuality: 'good',
        digestiveSymptoms: [],
        appetiteLevel: 'good',
        fatigueLevel: 'none'
      },
      medicalHistory: {
        allergies: ['Polen'],
        medications: ['Antihistamínico (estacional)'],
        chronicConditions: ['Rinitis alérgica'],
        injuries: []
      },
      performanceMetrics: {
        vo2Max: 46,
        strength: 6,
        endurance: 7,
        flexibility: 6,
        speed: 7
      }
    },
    dietetics: {
      dailyIntake: {
        calories: 2100,
        protein: 80,
        carbohydrates: 290,
        fats: 70,
        fiber: 25,
        water: 2.5
      },
      mealPattern: {
        mealsPerDay: 4,
        breakfastTime: '07:15',
        lunchTime: '12:30',
        dinnerTime: '19:30',
        snacks: 2
      },
      foodPreferences: {
        likes: ['Arroz', 'Pollo', 'Plátanos', 'Leche'],
        dislikes: ['Brócoli', 'Espinacas'],
        restrictions: [],
        culturalPreferences: ['Comida casera']
      },
      supplementation: {
        vitamins: [],
        minerals: [],
        proteins: [],
        other: []
      },
      hydrationHabits: {
        waterIntake: 2.5,
        sportsdrinks: true,
        caffeineIntake: 0
      },
      eatingBehavior: {
        eatingSpeed: 'normal',
        portionSizes: 'normal',
        emotionalEating: false,
        socialEating: true
      },
      nutritionalKnowledge: {
        level: 'basic',
        areas: ['Hidratación']
      }
    }
  }
]

// Evaluaciones ABCD completas de ejemplo
export const SAMPLE_ABCD_EVALUATIONS: ABCDEvaluation[] = [
  {
    id: generateId(),
    athleteId: SAMPLE_ATHLETES_ABCD[0].id,
    date: '2024-01-15',
    evaluator: 'Dr. María González - Nutricionista Deportiva',
    anthropometry: SAMPLE_ATHLETES_ABCD[0].anthropometry!,
    biochemistry: SAMPLE_ATHLETES_ABCD[0].biochemistry!,
    clinical: SAMPLE_ATHLETES_ABCD[0].clinical!,
    dietetics: SAMPLE_ATHLETES_ABCD[0].dietetics!,
    overallAssessment: {
      nutritionalStatus: 'adequate',
      riskFactors: [],
      strengths: [
        'IMC en rango normal para la edad',
        'Buen estado de hidratación',
        'Niveles adecuados de hemoglobina',
        'Patrón de comidas estructurado'
      ],
      recommendations: [
        'Mantener el patrón actual de alimentación',
        'Incrementar ligeramente el consumo de verduras',
        'Continuar con la suplementación de vitamina D',
        'Monitoreo cada 6 meses'
      ]
    },
    followUpDate: '2024-07-15'
  },
  {
    id: generateId(),
    athleteId: SAMPLE_ATHLETES_ABCD[1].id,
    date: '2024-01-10',
    evaluator: 'Dr. María González - Nutricionista Deportiva',
    anthropometry: SAMPLE_ATHLETES_ABCD[1].anthropometry!,
    biochemistry: SAMPLE_ATHLETES_ABCD[1].biochemistry!,
    clinical: SAMPLE_ATHLETES_ABCD[1].clinical!,
    dietetics: SAMPLE_ATHLETES_ABCD[1].dietetics!,
    overallAssessment: {
      nutritionalStatus: 'at-risk',
      riskFactors: [
        'Deficiencia de hierro (ferritina baja)',
        'Ingesta calórica insuficiente',
        'Signos de fatiga',
        'Vitamina D por debajo del óptimo'
      ],
      strengths: [
        'Buen conocimiento nutricional',
        'Motivación para mejorar',
        'Composición corporal adecuada'
      ],
      recommendations: [
        'Suplementación con hierro bajo supervisión médica',
        'Incrementar ingesta calórica gradualmente',
        'Incluir más alimentos ricos en hierro hemo',
        'Mejorar calidad del sueño',
        'Seguimiento mensual'
      ]
    },
    followUpDate: '2024-02-10'
  },
  {
    id: generateId(),
    athleteId: SAMPLE_ATHLETES_ABCD[3].id,
    date: '2024-01-01',
    evaluator: 'Dr. María González - Nutricionista Deportiva',
    anthropometry: SAMPLE_ATHLETES_ABCD[3].anthropometry!,
    biochemistry: SAMPLE_ATHLETES_ABCD[3].biochemistry!,
    clinical: SAMPLE_ATHLETES_ABCD[3].clinical!,
    dietetics: SAMPLE_ATHLETES_ABCD[3].dietetics!,
    overallAssessment: {
      nutritionalStatus: 'deficient',
      riskFactors: [
        'IMC significativamente bajo (percentil 15)',
        'Deficiencia severa de hierro',
        'Ingesta calórica muy insuficiente',
        'Signos de deshidratación',
        'Fatiga severa',
        'Posible trastorno alimentario'
      ],
      strengths: [
        'Alto conocimiento nutricional',
        'Flexibilidad adecuada'
      ],
      recommendations: [
        'URGENTE: Evaluación médica integral',
        'Interconsulta con psicología/psiquiatría',
        'Plan de realimentación supervisado',
        'Suplementación intensiva',
        'Suspensión temporal de entrenamientos intensos',
        'Seguimiento semanal'
      ]
    },
    followUpDate: '2024-01-08'
  }
]

// Función para inicializar la base de datos mejorada
export function initializeEnhancedDatabase() {
  // Verificar si ya existen datos
  const existingAthletes = JSON.parse(localStorage.getItem('ergo-sanitas-athletes') || '[]')
  
  if (existingAthletes.length === 0) {
    // Guardar atletas con datos ABCD completos
    localStorage.setItem('ergo-sanitas-athletes', JSON.stringify(SAMPLE_ATHLETES_ABCD))
    
    // Guardar evaluaciones ABCD
    localStorage.setItem('ergo-sanitas-evaluations', JSON.stringify(SAMPLE_ABCD_EVALUATIONS))
    
    console.log('Base de datos ABCD inicializada con datos completos')
  }
}
