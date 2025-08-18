import { ReferenceValues } from '@/lib/types'

// Valores de referencia nutricionales por edad y género
export const REFERENCE_VALUES: ReferenceValues[] = [
  // Niños 5-8 años
  {
    ageGroup: '5-8',
    gender: 'male',
    anthropometry: {
      bmiRanges: {
        underweight: 14.0,
        normal: [14.0, 18.0],
        overweight: 18.0,
        obese: 20.0
      },
      bodyFatRanges: {
        low: 8,
        normal: [10, 20],
        high: 25
      }
    },
    biochemistry: {
      hemoglobin: [11.5, 15.5],
      iron: [50, 120],
      vitaminD: [20, 50],
      glucose: [70, 100]
    },
    dietary: {
      caloriesPerKg: [70, 90],
      proteinPerKg: [1.0, 1.2],
      carbohydratesPercent: [45, 65],
      fatsPercent: [25, 35]
    }
  },
  {
    ageGroup: '5-8',
    gender: 'female',
    anthropometry: {
      bmiRanges: {
        underweight: 13.5,
        normal: [13.5, 18.5],
        overweight: 18.5,
        obese: 20.5
      },
      bodyFatRanges: {
        low: 12,
        normal: [15, 25],
        high: 30
      }
    },
    biochemistry: {
      hemoglobin: [11.5, 15.5],
      iron: [50, 120],
      vitaminD: [20, 50],
      glucose: [70, 100]
    },
    dietary: {
      caloriesPerKg: [65, 85],
      proteinPerKg: [1.0, 1.2],
      carbohydratesPercent: [45, 65],
      fatsPercent: [25, 35]
    }
  },
  // Niños 9-13 años
  {
    ageGroup: '9-13',
    gender: 'male',
    anthropometry: {
      bmiRanges: {
        underweight: 15.0,
        normal: [15.0, 21.0],
        overweight: 21.0,
        obese: 25.0
      },
      bodyFatRanges: {
        low: 10,
        normal: [12, 22],
        high: 27
      }
    },
    biochemistry: {
      hemoglobin: [12.0, 16.0],
      iron: [60, 140],
      vitaminD: [20, 50],
      glucose: [70, 100]
    },
    dietary: {
      caloriesPerKg: [60, 80],
      proteinPerKg: [1.0, 1.4],
      carbohydratesPercent: [45, 65],
      fatsPercent: [25, 35]
    }
  },
  {
    ageGroup: '9-13',
    gender: 'female',
    anthropometry: {
      bmiRanges: {
        underweight: 15.5,
        normal: [15.5, 21.5],
        overweight: 21.5,
        obese: 25.5
      },
      bodyFatRanges: {
        low: 14,
        normal: [16, 26],
        high: 32
      }
    },
    biochemistry: {
      hemoglobin: [12.0, 16.0],
      iron: [60, 140],
      vitaminD: [20, 50],
      glucose: [70, 100]
    },
    dietary: {
      caloriesPerKg: [55, 75],
      proteinPerKg: [1.0, 1.4],
      carbohydratesPercent: [45, 65],
      fatsPercent: [25, 35]
    }
  },
  // Adolescentes 14-18 años
  {
    ageGroup: '14-18',
    gender: 'male',
    anthropometry: {
      bmiRanges: {
        underweight: 17.0,
        normal: [17.0, 24.0],
        overweight: 24.0,
        obese: 29.0
      },
      bodyFatRanges: {
        low: 8,
        normal: [10, 18],
        high: 25
      }
    },
    biochemistry: {
      hemoglobin: [13.0, 17.0],
      iron: [70, 160],
      vitaminD: [20, 50],
      glucose: [70, 100]
    },
    dietary: {
      caloriesPerKg: [50, 70],
      proteinPerKg: [1.2, 1.6],
      carbohydratesPercent: [45, 65],
      fatsPercent: [20, 35]
    }
  },
  {
    ageGroup: '14-18',
    gender: 'female',
    anthropometry: {
      bmiRanges: {
        underweight: 17.5,
        normal: [17.5, 24.5],
        overweight: 24.5,
        obese: 29.5
      },
      bodyFatRanges: {
        low: 12,
        normal: [16, 24],
        high: 30
      }
    },
    biochemistry: {
      hemoglobin: [12.0, 16.0],
      iron: [60, 140],
      vitaminD: [20, 50],
      glucose: [70, 100]
    },
    dietary: {
      caloriesPerKg: [45, 65],
      proteinPerKg: [1.2, 1.6],
      carbohydratesPercent: [45, 65],
      fatsPercent: [20, 35]
    }
  }
]

// Requerimientos específicos por deporte
export const SPORT_REQUIREMENTS = {
  futbol: {
    name: 'Fútbol',
    calorieMultiplier: 1.8,
    proteinPerKg: [1.4, 1.7],
    carbohydratesPerKg: [6, 8],
    hydrationPerHour: 600, // ml
    keyNutrients: ['hierro', 'vitamina_d', 'magnesio', 'potasio'],
    supplementsRecommended: ['creatina', 'beta_alanina', 'cafeina']
  },
  basketball: {
    name: 'Baloncesto',
    calorieMultiplier: 1.9,
    proteinPerKg: [1.5, 1.8],
    carbohydratesPerKg: [7, 9],
    hydrationPerHour: 700,
    keyNutrients: ['calcio', 'vitamina_d', 'hierro', 'zinc'],
    supplementsRecommended: ['creatina', 'hmb', 'glutamina']
  },
  natacion: {
    name: 'Natación',
    calorieMultiplier: 2.0,
    proteinPerKg: [1.6, 2.0],
    carbohydratesPerKg: [8, 10],
    hydrationPerHour: 500,
    keyNutrients: ['hierro', 'vitamina_b12', 'omega_3', 'antioxidantes'],
    supplementsRecommended: ['creatina', 'beta_alanina', 'vitamina_c']
  },
  atletismo: {
    name: 'Atletismo',
    calorieMultiplier: 1.7,
    proteinPerKg: [1.3, 1.6],
    carbohydratesPerKg: [5, 7],
    hydrationPerHour: 550,
    keyNutrients: ['hierro', 'vitamina_d', 'calcio', 'magnesio'],
    supplementsRecommended: ['cafeina', 'nitrato', 'bicarbonato']
  },
  gimnasia: {
    name: 'Gimnasia',
    calorieMultiplier: 1.6,
    proteinPerKg: [1.4, 1.7],
    carbohydratesPerKg: [5, 6],
    hydrationPerHour: 400,
    keyNutrients: ['calcio', 'vitamina_d', 'hierro', 'zinc'],
    supplementsRecommended: ['creatina', 'hmb', 'vitamina_d']
  }
}

// Percentiles de crecimiento (CDC/OMS simplificados)
export const GROWTH_PERCENTILES = {
  height: {
    male: {
      '5': { p5: 105, p10: 107, p25: 110, p50: 113, p75: 116, p90: 119, p95: 121 },
      '6': { p5: 110, p10: 112, p25: 115, p50: 118, p75: 121, p90: 124, p95: 126 },
      '7': { p5: 115, p10: 117, p25: 120, p50: 123, p75: 126, p90: 129, p95: 131 },
      '8': { p5: 120, p10: 122, p25: 125, p50: 128, p75: 131, p90: 134, p95: 136 },
      '9': { p5: 125, p10: 127, p25: 130, p50: 133, p75: 136, p90: 139, p95: 141 },
      '10': { p5: 130, p10: 132, p25: 135, p50: 138, p75: 141, p90: 144, p95: 146 },
      '11': { p5: 135, p10: 137, p25: 140, p50: 143, p75: 146, p90: 149, p95: 151 },
      '12': { p5: 140, p10: 142, p25: 145, p50: 148, p75: 151, p90: 154, p95: 156 },
      '13': { p5: 145, p10: 147, p25: 150, p50: 153, p75: 156, p90: 159, p95: 161 },
      '14': { p5: 150, p10: 152, p25: 155, p50: 158, p75: 161, p90: 164, p95: 166 },
      '15': { p5: 155, p10: 157, p25: 160, p50: 163, p75: 166, p90: 169, p95: 171 },
      '16': { p5: 160, p10: 162, p25: 165, p50: 168, p75: 171, p90: 174, p95: 176 },
      '17': { p5: 165, p10: 167, p25: 170, p50: 173, p75: 176, p90: 179, p95: 181 },
      '18': { p5: 167, p10: 169, p25: 172, p50: 175, p75: 178, p90: 181, p95: 183 }
    },
    female: {
      '5': { p5: 104, p10: 106, p25: 109, p50: 112, p75: 115, p90: 118, p95: 120 },
      '6': { p5: 109, p10: 111, p25: 114, p50: 117, p75: 120, p90: 123, p95: 125 },
      '7': { p5: 114, p10: 116, p25: 119, p50: 122, p75: 125, p90: 128, p95: 130 },
      '8': { p5: 119, p10: 121, p25: 124, p50: 127, p75: 130, p90: 133, p95: 135 },
      '9': { p5: 124, p10: 126, p25: 129, p50: 132, p75: 135, p90: 138, p95: 140 },
      '10': { p5: 129, p10: 131, p25: 134, p50: 137, p75: 140, p90: 143, p95: 145 },
      '11': { p5: 134, p10: 136, p25: 139, p50: 142, p75: 145, p90: 148, p95: 150 },
      '12': { p5: 139, p10: 141, p25: 144, p50: 147, p75: 150, p90: 153, p95: 155 },
      '13': { p5: 144, p10: 146, p25: 149, p50: 152, p75: 155, p90: 158, p95: 160 },
      '14': { p5: 149, p10: 151, p25: 154, p50: 157, p75: 160, p90: 163, p95: 165 },
      '15': { p5: 152, p10: 154, p25: 157, p50: 160, p75: 163, p90: 166, p95: 168 },
      '16': { p5: 154, p10: 156, p25: 159, p50: 162, p75: 165, p90: 168, p95: 170 },
      '17': { p5: 155, p10: 157, p25: 160, p50: 163, p75: 166, p90: 169, p95: 171 },
      '18': { p5: 156, p10: 158, p25: 161, p50: 164, p75: 167, p90: 170, p95: 172 }
    }
  },
  weight: {
    male: {
      '5': { p5: 15, p10: 16, p25: 17, p50: 19, p75: 21, p90: 23, p95: 25 },
      '6': { p5: 17, p10: 18, p25: 19, p50: 21, p75: 23, p90: 26, p95: 28 },
      '7': { p5: 19, p10: 20, p25: 21, p50: 23, p75: 26, p90: 29, p95: 32 },
      '8': { p5: 21, p10: 22, p25: 24, p50: 26, p75: 29, p90: 33, p95: 36 },
      '9': { p5: 23, p10: 24, p25: 26, p50: 29, p75: 32, p90: 37, p95: 41 },
      '10': { p5: 25, p10: 27, p25: 29, p50: 32, p75: 36, p90: 42, p95: 47 },
      '11': { p5: 28, p10: 30, p25: 32, p50: 36, p75: 40, p90: 47, p95: 53 },
      '12': { p5: 31, p10: 33, p25: 36, p50: 40, p75: 45, p90: 53, p95: 60 },
      '13': { p5: 35, p10: 37, p25: 40, p50: 45, p75: 51, p90: 60, p95: 68 },
      '14': { p5: 39, p10: 42, p25: 46, p50: 51, p75: 58, p90: 68, p95: 77 },
      '15': { p5: 44, p10: 47, p25: 52, p50: 58, p75: 65, p90: 76, p95: 85 },
      '16': { p5: 49, p10: 53, p25: 58, p50: 64, p75: 72, p90: 83, p95: 92 },
      '17': { p5: 54, p10: 58, p25: 63, p50: 70, p75: 78, p90: 88, p95: 97 },
      '18': { p5: 57, p10: 61, p25: 67, p50: 74, p75: 82, p90: 92, p95: 101 }
    },
    female: {
      '5': { p5: 14, p10: 15, p25: 16, p50: 18, p75: 20, p90: 22, p95: 24 },
      '6': { p5: 16, p10: 17, p25: 18, p50: 20, p75: 22, p90: 25, p95: 27 },
      '7': { p5: 18, p10: 19, p25: 20, p50: 22, p75: 25, p90: 28, p95: 31 },
      '8': { p5: 20, p10: 21, p25: 23, p50: 25, p75: 28, p90: 32, p95: 36 },
      '9': { p5: 22, p10: 23, p25: 25, p50: 28, p75: 32, p90: 37, p95: 42 },
      '10': { p5: 24, p10: 26, p25: 28, p50: 32, p75: 36, p90: 43, p95: 49 },
      '11': { p5: 27, p10: 29, p25: 32, p50: 36, p75: 42, p90: 50, p95: 57 },
      '12': { p5: 30, p10: 33, p25: 36, p50: 41, p75: 48, p90: 57, p95: 65 },
      '13': { p5: 34, p10: 37, p25: 41, p50: 46, p75: 54, p90: 63, p95: 72 },
      '14': { p5: 38, p10: 41, p25: 46, p50: 51, p75: 59, p90: 68, p95: 77 },
      '15': { p5: 41, p10: 45, p25: 50, p50: 55, p75: 63, p90: 72, p95: 81 },
      '16': { p5: 44, p10: 48, p25: 53, p50: 58, p75: 66, p90: 75, p95: 84 },
      '17': { p5: 46, p10: 50, p25: 55, p50: 60, p75: 68, p90: 77, p95: 86 },
      '18': { p5: 47, p10: 51, p25: 56, p50: 61, p75: 69, p90: 78, p95: 87 }
    }
  }
}

// Alimentos recomendados por categoría
export const RECOMMENDED_FOODS = {
  proteinas: [
    { name: 'Pollo sin piel', protein: 25, calories: 165, portion: '100g' },
    { name: 'Pescado blanco', protein: 22, calories: 120, portion: '100g' },
    { name: 'Huevos', protein: 13, calories: 155, portion: '2 unidades' },
    { name: 'Legumbres', protein: 8, calories: 115, portion: '1/2 taza cocida' },
    { name: 'Yogur griego', protein: 15, calories: 100, portion: '150g' },
    { name: 'Quinoa', protein: 8, calories: 222, portion: '1 taza cocida' }
  ],
  carbohidratos: [
    { name: 'Avena', carbs: 27, calories: 150, portion: '1/2 taza seca' },
    { name: 'Arroz integral', carbs: 45, calories: 216, portion: '1 taza cocida' },
    { name: 'Batata', carbs: 27, calories: 112, portion: '1 mediana' },
    { name: 'Plátano', carbs: 27, calories: 105, portion: '1 mediano' },
    { name: 'Pan integral', carbs: 12, calories: 69, portion: '1 rebanada' },
    { name: 'Pasta integral', carbs: 37, calories: 174, portion: '1 taza cocida' }
  ],
  grasas_saludables: [
    { name: 'Aguacate', fat: 15, calories: 160, portion: '1/2 unidad' },
    { name: 'Nueces', fat: 18, calories: 185, portion: '30g' },
    { name: 'Aceite de oliva', fat: 14, calories: 120, portion: '1 cucharada' },
    { name: 'Salmón', fat: 12, calories: 206, portion: '100g' },
    { name: 'Semillas de chía', fat: 9, calories: 137, portion: '2 cucharadas' },
    { name: 'Almendras', fat: 14, calories: 161, portion: '30g' }
  ],
  frutas_verduras: [
    { name: 'Espinacas', vitamins: ['A', 'K', 'folato'], calories: 23, portion: '100g' },
    { name: 'Brócoli', vitamins: ['C', 'K', 'folato'], calories: 34, portion: '100g' },
    { name: 'Naranja', vitamins: ['C', 'folato'], calories: 62, portion: '1 mediana' },
    { name: 'Arándanos', vitamins: ['C', 'K'], calories: 84, portion: '1 taza' },
    { name: 'Zanahoria', vitamins: ['A', 'K'], calories: 41, portion: '100g' },
    { name: 'Kiwi', vitamins: ['C', 'K'], calories: 61, portion: '1 mediano' }
  ]
}

// Suplementos deportivos seguros para jóvenes
export const SAFE_SUPPLEMENTS = {
  creatina: {
    name: 'Creatina Monohidrato',
    ageRecommendation: '16+',
    dosage: '3-5g/día',
    benefits: ['Fuerza', 'Potencia', 'Recuperación'],
    timing: 'Post-entrenamiento',
    safety: 'Seguro con supervisión médica'
  },
  proteina: {
    name: 'Proteína en Polvo',
    ageRecommendation: '14+',
    dosage: '20-30g/porción',
    benefits: ['Recuperación muscular', 'Crecimiento'],
    timing: 'Post-entrenamiento o entre comidas',
    safety: 'Seguro como complemento dietético'
  },
  multivitaminico: {
    name: 'Multivitamínico',
    ageRecommendation: '5+',
    dosage: 'Según indicaciones',
    benefits: ['Completar deficiencias', 'Salud general'],
    timing: 'Con el desayuno',
    safety: 'Seguro según dosis recomendada'
  },
  omega3: {
    name: 'Omega-3',
    ageRecommendation: '5+',
    dosage: '500-1000mg/día',
    benefits: ['Antiinflamatorio', 'Salud cardiovascular'],
    timing: 'Con las comidas',
    safety: 'Seguro para todas las edades'
  },
  vitamina_d: {
    name: 'Vitamina D3',
    ageRecommendation: '5+',
    dosage: '600-1000 UI/día',
    benefits: ['Salud ósea', 'Sistema inmune'],
    timing: 'Con comida grasa',
    safety: 'Seguro según dosis recomendada'
  }
}

// Función para obtener valores de referencia
export function getReferenceValues(age: number, gender: 'male' | 'female'): ReferenceValues | null {
  let ageGroup: '5-8' | '9-13' | '14-18'
  
  if (age >= 5 && age <= 8) ageGroup = '5-8'
  else if (age >= 9 && age <= 13) ageGroup = '9-13'
  else if (age >= 14 && age <= 18) ageGroup = '14-18'
  else return null
  
  return REFERENCE_VALUES.find(ref => ref.ageGroup === ageGroup && ref.gender === gender) || null
}

// Función para obtener requerimientos por deporte
export function getSportRequirements(sport: string) {
  return SPORT_REQUIREMENTS[sport as keyof typeof SPORT_REQUIREMENTS] || SPORT_REQUIREMENTS.futbol
}

// Función para obtener percentil de crecimiento
export function getGrowthPercentile(value: number, age: number, gender: 'male' | 'female', type: 'height' | 'weight'): number {
  const data = GROWTH_PERCENTILES[type][gender][age.toString() as keyof typeof GROWTH_PERCENTILES.height.male]
  
  if (!data) return 50 // Valor por defecto
  
  if (value <= data.p5) return 5
  if (value <= data.p10) return 10
  if (value <= data.p25) return 25
  if (value <= data.p50) return 50
  if (value <= data.p75) return 75
  if (value <= data.p90) return 90
  if (value <= data.p95) return 95
  return 97
}
