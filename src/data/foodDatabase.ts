import { FoodItem } from '@/lib/types'
import { generateId } from '@/lib/utils'

// Base de datos nutricional estática con alimentos comunes mexicanos/latinoamericanos
// Datos basados en tablas nutricionales oficiales de INCMNSZ, USDA y fuentes médicas verificadas

export const foodDatabase: FoodItem[] = [
  // ==================== CEREALES Y TUBÉRCULOS ====================
  {
    id: generateId(),
    name: 'Arroz blanco cocido',
    category: 'cereales',
    calories: 130,
    macronutrients: {
      protein: 2.7,
      carbohydrates: 28.2,
      fats: 0.3,
      fiber: 0.4,
      sugar: 0.1
    },
    micronutrients: {
      sodium: 1,
      potassium: 55,
      calcium: 10,
      iron: 0.8,
      vitaminC: 0,
      vitaminA: 0
    },
    portionSize: {
      standard: 150,
      description: '3/4 taza cocido'
    },
    glycemicIndex: 73,
    allergens: []
  },
  {
    id: generateId(),
    name: 'Tortilla de maíz',
    category: 'cereales',
    calories: 218,
    macronutrients: {
      protein: 5.7,
      carbohydrates: 44.8,
      fats: 2.9,
      fiber: 6.3,
      sugar: 1.1
    },
    micronutrients: {
      sodium: 11,
      potassium: 165,
      calcium: 159,
      iron: 2.7,
      vitaminC: 0,
      vitaminA: 13
    },
    portionSize: {
      standard: 30,
      description: '1 pieza mediana'
    },
    glycemicIndex: 52,
    allergens: []
  },
  {
    id: generateId(),
    name: 'Pan integral',
    category: 'cereales',
    calories: 247,
    macronutrients: {
      protein: 13.0,
      carbohydrates: 41.0,
      fats: 4.2,
      fiber: 7.0,
      sugar: 6.0
    },
    micronutrients: {
      sodium: 491,
      potassium: 248,
      calcium: 73,
      iron: 3.6,
      vitaminC: 0,
      vitaminA: 0
    },
    portionSize: {
      standard: 25,
      description: '1 rebanada'
    },
    glycemicIndex: 51,
    allergens: ['gluten', 'trigo']
  },
  {
    id: generateId(),
    name: 'Avena cocida',
    category: 'cereales',
    calories: 68,
    macronutrients: {
      protein: 2.4,
      carbohydrates: 12.0,
      fats: 1.4,
      fiber: 1.7,
      sugar: 0.3
    },
    micronutrients: {
      sodium: 4,
      potassium: 70,
      calcium: 9,
      iron: 1.2,
      vitaminC: 0,
      vitaminA: 0
    },
    portionSize: {
      standard: 200,
      description: '1 taza cocida'
    },
    glycemicIndex: 55,
    allergens: ['avena']
  },
  {
    id: generateId(),
    name: 'Papa cocida',
    category: 'cereales',
    calories: 87,
    macronutrients: {
      protein: 1.9,
      carbohydrates: 20.1,
      fats: 0.1,
      fiber: 2.2,
      sugar: 0.8
    },
    micronutrients: {
      sodium: 6,
      potassium: 421,
      calcium: 12,
      iron: 0.8,
      vitaminC: 19.7,
      vitaminA: 0
    },
    portionSize: {
      standard: 150,
      description: '1 pieza mediana'
    },
    glycemicIndex: 78,
    allergens: []
  },

  // ==================== PROTEÍNAS ====================
  {
    id: generateId(),
    name: 'Pechuga de pollo sin piel',
    category: 'proteinas',
    calories: 165,
    macronutrients: {
      protein: 31.0,
      carbohydrates: 0,
      fats: 3.6,
      fiber: 0,
      sugar: 0
    },
    micronutrients: {
      sodium: 74,
      potassium: 256,
      calcium: 15,
      iron: 1.0,
      vitaminC: 0,
      vitaminA: 6
    },
    portionSize: {
      standard: 100,
      description: '1 pieza mediana'
    },
    allergens: []
  },
  {
    id: generateId(),
    name: 'Huevo entero',
    category: 'proteinas',
    calories: 155,
    macronutrients: {
      protein: 13.0,
      carbohydrates: 1.1,
      fats: 11.0,
      fiber: 0,
      sugar: 1.1
    },
    micronutrients: {
      sodium: 124,
      potassium: 138,
      calcium: 56,
      iron: 1.8,
      vitaminC: 0,
      vitaminA: 160
    },
    portionSize: {
      standard: 50,
      description: '1 pieza grande'
    },
    allergens: ['huevo']
  },
  {
    id: generateId(),
    name: 'Frijoles negros cocidos',
    category: 'proteinas',
    calories: 132,
    macronutrients: {
      protein: 8.9,
      carbohydrates: 23.0,
      fats: 0.5,
      fiber: 8.7,
      sugar: 0.3
    },
    micronutrients: {
      sodium: 2,
      potassium: 355,
      calcium: 27,
      iron: 2.1,
      vitaminC: 0,
      vitaminA: 1
    },
    portionSize: {
      standard: 100,
      description: '1/2 taza'
    },
    glycemicIndex: 30,
    allergens: []
  },
  {
    id: generateId(),
    name: 'Pescado blanco (tilapia)',
    category: 'proteinas',
    calories: 96,
    macronutrients: {
      protein: 20.1,
      carbohydrates: 0,
      fats: 1.7,
      fiber: 0,
      sugar: 0
    },
    micronutrients: {
      sodium: 52,
      potassium: 302,
      calcium: 10,
      iron: 0.6,
      vitaminC: 0,
      vitaminA: 0
    },
    portionSize: {
      standard: 100,
      description: '1 filete mediano'
    },
    allergens: ['pescado']
  },
  {
    id: generateId(),
    name: 'Carne de res magra',
    category: 'proteinas',
    calories: 250,
    macronutrients: {
      protein: 26.0,
      carbohydrates: 0,
      fats: 15.0,
      fiber: 0,
      sugar: 0
    },
    micronutrients: {
      sodium: 72,
      potassium: 318,
      calcium: 18,
      iron: 2.6,
      vitaminC: 0,
      vitaminA: 0
    },
    portionSize: {
      standard: 100,
      description: '1 bistec pequeño'
    },
    allergens: []
  },

  // ==================== LÁCTEOS ====================
  {
    id: generateId(),
    name: 'Leche descremada',
    category: 'lacteos',
    calories: 34,
    macronutrients: {
      protein: 3.4,
      carbohydrates: 5.0,
      fats: 0.1,
      fiber: 0,
      sugar: 5.0
    },
    micronutrients: {
      sodium: 44,
      potassium: 150,
      calcium: 125,
      iron: 0.0,
      vitaminC: 1.0,
      vitaminA: 1
    },
    portionSize: {
      standard: 240,
      description: '1 vaso'
    },
    glycemicIndex: 32,
    allergens: ['lactosa']
  },
  {
    id: generateId(),
    name: 'Yogurt natural bajo en grasa',
    category: 'lacteos',
    calories: 59,
    macronutrients: {
      protein: 10.0,
      carbohydrates: 3.6,
      fats: 0.4,
      fiber: 0,
      sugar: 3.6
    },
    micronutrients: {
      sodium: 36,
      potassium: 141,
      calcium: 110,
      iron: 0.0,
      vitaminC: 0.5,
      vitaminA: 2
    },
    portionSize: {
      standard: 125,
      description: '1/2 taza'
    },
    glycemicIndex: 35,
    allergens: ['lactosa']
  },
  {
    id: generateId(),
    name: 'Queso panela',
    category: 'lacteos',
    calories: 321,
    macronutrients: {
      protein: 20.6,
      carbohydrates: 2.8,
      fats: 25.0,
      fiber: 0,
      sugar: 2.8
    },
    micronutrients: {
      sodium: 500,
      potassium: 138,
      calcium: 631,
      iron: 0.4,
      vitaminC: 0,
      vitaminA: 225
    },
    portionSize: {
      standard: 30,
      description: '1 rebanada'
    },
    allergens: ['lactosa']
  },

  // ==================== FRUTAS ====================
  {
    id: generateId(),
    name: 'Manzana con cáscara',
    category: 'frutas',
    calories: 52,
    macronutrients: {
      protein: 0.3,
      carbohydrates: 14.0,
      fats: 0.2,
      fiber: 2.4,
      sugar: 10.4
    },
    micronutrients: {
      sodium: 1,
      potassium: 107,
      calcium: 6,
      iron: 0.1,
      vitaminC: 4.6,
      vitaminA: 3
    },
    portionSize: {
      standard: 150,
      description: '1 pieza mediana'
    },
    glycemicIndex: 36,
    allergens: []
  },
  {
    id: generateId(),
    name: 'Plátano',
    category: 'frutas',
    calories: 89,
    macronutrients: {
      protein: 1.1,
      carbohydrates: 23.0,
      fats: 0.3,
      fiber: 2.6,
      sugar: 12.2
    },
    micronutrients: {
      sodium: 1,
      potassium: 358,
      calcium: 5,
      iron: 0.3,
      vitaminC: 8.7,
      vitaminA: 3
    },
    portionSize: {
      standard: 120,
      description: '1 pieza mediana'
    },
    glycemicIndex: 51,
    allergens: []
  },
  {
    id: generateId(),
    name: 'Naranja',
    category: 'frutas',
    calories: 47,
    macronutrients: {
      protein: 0.9,
      carbohydrates: 12.0,
      fats: 0.1,
      fiber: 2.4,
      sugar: 9.4
    },
    micronutrients: {
      sodium: 0,
      potassium: 181,
      calcium: 40,
      iron: 0.1,
      vitaminC: 53.2,
      vitaminA: 11
    },
    portionSize: {
      standard: 150,
      description: '1 pieza mediana'
    },
    glycemicIndex: 45,
    allergens: []
  },
  {
    id: generateId(),
    name: 'Papaya',
    category: 'frutas',
    calories: 43,
    macronutrients: {
      protein: 0.5,
      carbohydrates: 11.0,
      fats: 0.3,
      fiber: 1.7,
      sugar: 7.8
    },
    micronutrients: {
      sodium: 8,
      potassium: 182,
      calcium: 20,
      iron: 0.3,
      vitaminC: 60.9,
      vitaminA: 47
    },
    portionSize: {
      standard: 140,
      description: '1 taza en cubos'
    },
    glycemicIndex: 59,
    allergens: []
  },

  // ==================== VERDURAS ====================
  {
    id: generateId(),
    name: 'Brócoli cocido',
    category: 'verduras',
    calories: 35,
    macronutrients: {
      protein: 2.4,
      carbohydrates: 7.0,
      fats: 0.4,
      fiber: 3.3,
      sugar: 2.2
    },
    micronutrients: {
      sodium: 41,
      potassium: 293,
      calcium: 40,
      iron: 0.7,
      vitaminC: 64.9,
      vitaminA: 77
    },
    portionSize: {
      standard: 100,
      description: '1/2 taza'
    },
    glycemicIndex: 10,
    allergens: []
  },
  {
    id: generateId(),
    name: 'Espinacas crudas',
    category: 'verduras',
    calories: 23,
    macronutrients: {
      protein: 2.9,
      carbohydrates: 3.6,
      fats: 0.4,
      fiber: 2.2,
      sugar: 0.4
    },
    micronutrients: {
      sodium: 79,
      potassium: 558,
      calcium: 99,
      iron: 2.7,
      vitaminC: 28.1,
      vitaminA: 469
    },
    portionSize: {
      standard: 30,
      description: '1 taza'
    },
    glycemicIndex: 15,
    allergens: []
  },
  {
    id: generateId(),
    name: 'Tomate rojo',
    category: 'verduras',
    calories: 18,
    macronutrients: {
      protein: 0.9,
      carbohydrates: 3.9,
      fats: 0.2,
      fiber: 1.2,
      sugar: 2.6
    },
    micronutrients: {
      sodium: 5,
      potassium: 237,
      calcium: 10,
      iron: 0.3,
      vitaminC: 13.7,
      vitaminA: 42
    },
    portionSize: {
      standard: 120,
      description: '1 pieza mediana'
    },
    glycemicIndex: 10,
    allergens: []
  },
  {
    id: generateId(),
    name: 'Zanahoria cocida',
    category: 'verduras',
    calories: 35,
    macronutrients: {
      protein: 0.8,
      carbohydrates: 8.2,
      fats: 0.2,
      fiber: 2.3,
      sugar: 3.4
    },
    micronutrients: {
      sodium: 58,
      potassium: 235,
      calcium: 30,
      iron: 0.3,
      vitaminC: 3.6,
      vitaminA: 852
    },
    portionSize: {
      standard: 80,
      description: '1/2 taza en rodajas'
    },
    glycemicIndex: 35,
    allergens: []
  },

  // ==================== GRASAS SALUDABLES ====================
  {
    id: generateId(),
    name: 'Aguacate',
    category: 'grasas',
    calories: 160,
    macronutrients: {
      protein: 2.0,
      carbohydrates: 9.0,
      fats: 15.0,
      fiber: 7.0,
      sugar: 0.7
    },
    micronutrients: {
      sodium: 7,
      potassium: 485,
      calcium: 12,
      iron: 0.6,
      vitaminC: 10.0,
      vitaminA: 7
    },
    portionSize: {
      standard: 50,
      description: '1/4 pieza mediana'
    },
    glycemicIndex: 15,
    allergens: []
  },
  {
    id: generateId(),
    name: 'Aceite de oliva',
    category: 'grasas',
    calories: 884,
    macronutrients: {
      protein: 0,
      carbohydrates: 0,
      fats: 100.0,
      fiber: 0,
      sugar: 0
    },
    micronutrients: {
      sodium: 2,
      potassium: 1,
      calcium: 1,
      iron: 0.6,
      vitaminC: 0,
      vitaminA: 0
    },
    portionSize: {
      standard: 5,
      description: '1 cucharadita'
    },
    allergens: []
  },
  {
    id: generateId(),
    name: 'Nueces',
    category: 'grasas',
    calories: 654,
    macronutrients: {
      protein: 15.2,
      carbohydrates: 14.0,
      fats: 65.2,
      fiber: 6.7,
      sugar: 2.6
    },
    micronutrients: {
      sodium: 2,
      potassium: 441,
      calcium: 98,
      iron: 2.9,
      vitaminC: 1.3,
      vitaminA: 1
    },
    portionSize: {
      standard: 15,
      description: '6-8 piezas'
    },
    allergens: ['nueces']
  },

  // ==================== LEGUMINOSAS ====================
  {
    id: generateId(),
    name: 'Lentejas cocidas',
    category: 'leguminosas',
    calories: 116,
    macronutrients: {
      protein: 9.0,
      carbohydrates: 20.0,
      fats: 0.4,
      fiber: 7.9,
      sugar: 1.8
    },
    micronutrients: {
      sodium: 2,
      potassium: 369,
      calcium: 19,
      iron: 3.3,
      vitaminC: 1.5,
      vitaminA: 4
    },
    portionSize: {
      standard: 100,
      description: '1/2 taza'
    },
    glycemicIndex: 29,
    allergens: []
  },
  {
    id: generateId(),
    name: 'Garbanzos cocidos',
    category: 'leguminosas',
    calories: 164,
    macronutrients: {
      protein: 8.9,
      carbohydrates: 27.0,
      fats: 2.6,
      fiber: 7.6,
      sugar: 4.8
    },
    micronutrients: {
      sodium: 7,
      potassium: 291,
      calcium: 49,
      iron: 2.9,
      vitaminC: 1.3,
      vitaminA: 3
    },
    portionSize: {
      standard: 100,
      description: '1/2 taza'
    },
    glycemicIndex: 28,
    allergens: []
  },

  // ==================== BEBIDAS ====================
  {
    id: generateId(),
    name: 'Agua natural',
    category: 'bebidas',
    calories: 0,
    macronutrients: {
      protein: 0,
      carbohydrates: 0,
      fats: 0,
      fiber: 0,
      sugar: 0
    },
    micronutrients: {
      sodium: 7,
      potassium: 0,
      calcium: 0,
      iron: 0,
      vitaminC: 0,
      vitaminA: 0
    },
    portionSize: {
      standard: 240,
      description: '1 vaso'
    },
    allergens: []
  },
  {
    id: generateId(),
    name: 'Té verde sin azúcar',
    category: 'bebidas',
    calories: 2,
    macronutrients: {
      protein: 0.2,
      carbohydrates: 0,
      fats: 0,
      fiber: 0,
      sugar: 0
    },
    micronutrients: {
      sodium: 1,
      potassium: 8,
      calcium: 0,
      iron: 0.02,
      vitaminC: 0.3,
      vitaminA: 0
    },
    portionSize: {
      standard: 240,
      description: '1 taza'
    },
    allergens: []
  }
]

// Funciones de utilidad para la base de datos de alimentos
export const getFoodById = (id: string): FoodItem | undefined => {
  return foodDatabase.find(food => food.id === id)
}

export const getFoodsByCategory = (category: FoodItem['category']): FoodItem[] => {
  return foodDatabase.filter(food => food.category === category)
}

export const searchFoods = (query: string): FoodItem[] => {
  const lowercaseQuery = query.toLowerCase()
  return foodDatabase.filter(food => 
    food.name.toLowerCase().includes(lowercaseQuery) ||
    food.category.toLowerCase().includes(lowercaseQuery)
  )
}

export const getFoodCategories = (): FoodItem['category'][] => {
  return ['cereales', 'proteinas', 'lacteos', 'frutas', 'verduras', 'grasas', 'leguminosas', 'azucares', 'bebidas']
}

export const calculateNutritionForPortion = (food: FoodItem, portionGrams: number) => {
  const factor = portionGrams / 100 // Los valores nutricionales están por 100g
  
  return {
    calories: Math.round(food.calories * factor),
    protein: Math.round(food.macronutrients.protein * factor * 10) / 10,
    carbohydrates: Math.round(food.macronutrients.carbohydrates * factor * 10) / 10,
    fats: Math.round(food.macronutrients.fats * factor * 10) / 10,
    fiber: Math.round(food.macronutrients.fiber * factor * 10) / 10,
    sugar: Math.round(food.macronutrients.sugar * factor * 10) / 10,
    sodium: Math.round(food.micronutrients.sodium * factor * 10) / 10,
    potassium: Math.round(food.micronutrients.potassium * factor * 10) / 10,
    calcium: Math.round(food.micronutrients.calcium * factor * 10) / 10,
    iron: Math.round(food.micronutrients.iron * factor * 100) / 100,
    vitaminC: Math.round(food.micronutrients.vitaminC * factor * 10) / 10,
    vitaminA: Math.round(food.micronutrients.vitaminA * factor * 10) / 10
  }
}
