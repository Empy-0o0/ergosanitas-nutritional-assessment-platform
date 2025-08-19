// Tipos para el modelo ABCD de evaluación nutricional

export interface Athlete {
  id: string;
  fullName: string;
  birthDate: string;
  age: number;
  gender: 'male' | 'female';
  club: string;
  position: string;
  category: '5-8' | '9-13' | '14-18';
  evaluationDate: string;
  anthropometry?: AnthropometryData;
  biochemistry?: BiochemistryData;
  clinical?: ClinicalData;
  dietetics?: DieteticsData;
  nutritionalStatus: 'normal' | 'warning' | 'danger';
  lastEvaluation: string;
  // Información adicional del paciente
  contactInfo?: {
    phone?: string;
    email?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  };
  medicalInfo?: {
    medicalHistory?: string;
    allergies?: string;
    medications?: string;
    previousInjuries?: string;
  };
  sportsInfo?: {
    yearsPlaying?: number;
    trainingDays?: number;
    trainingHours?: number;
    competitions?: string;
  };
  nutritionalInfo?: {
    dietaryRestrictions?: string;
    supplements?: string;
    hydrationHabits?: string;
    sleepHours?: number;
  };
}

// A: Antropometría - Mediciones corporales
export interface AnthropometryData {
  height: number; // cm
  weight: number; // kg
  bmi: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  boneDensity?: number;
  waistCircumference?: number; // cm
  hipCircumference?: number; // cm
  armCircumference?: number; // cm
  skinfoldMeasurements?: {
    triceps?: number;
    biceps?: number;
    subscapular?: number;
    suprailiac?: number;
  };
  percentiles?: {
    heightPercentile: number;
    weightPercentile: number;
    bmiPercentile: number;
  };
}

// B: Bioquímica - Análisis de laboratorio
export interface BiochemistryData {
  hemoglobin?: number; // g/dL
  hematocrit?: number; // %
  iron?: number; // μg/dL
  ferritin?: number; // ng/mL
  vitaminD?: number; // ng/mL
  vitaminB12?: number; // pg/mL
  folate?: number; // ng/mL
  glucose?: number; // mg/dL
  cholesterol?: {
    total?: number; // mg/dL
    hdl?: number; // mg/dL
    ldl?: number; // mg/dL
    triglycerides?: number; // mg/dL
  };
  proteins?: {
    totalProtein?: number; // g/dL
    albumin?: number; // g/dL
    prealbumin?: number; // mg/dL
  };
  electrolytes?: {
    sodium?: number; // mEq/L
    potassium?: number; // mEq/L
    calcium?: number; // mg/dL
    magnesium?: number; // mg/dL
  };
  lastTestDate: string;
}

// C: Clínica - Evaluación funcional y de signos
export interface ClinicalData {
  vitalSigns: {
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    heartRate: number; // bpm
    respiratoryRate: number; // rpm
    temperature: number; // °C
  };
  physicalExamination: {
    generalAppearance: string;
    skinCondition: string;
    oralHealth: string;
    lymphNodes: string;
    edema: boolean;
    dehydrationSigns: boolean;
  };
  functionalAssessment: {
    energyLevel: 'low' | 'normal' | 'high';
    sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
    digestiveSymptoms: string[];
    appetiteLevel: 'poor' | 'fair' | 'good' | 'excellent';
    fatigueLevel: 'none' | 'mild' | 'moderate' | 'severe';
  };
  medicalHistory: {
    allergies: string[];
    medications: string[];
    chronicConditions: string[];
    injuries: string[];
  };
  performanceMetrics?: {
    vo2Max?: number;
    strength?: number;
    endurance?: number;
    flexibility?: number;
    speed?: number;
  };
}

// D: Dietética - Hábitos alimentarios
export interface DieteticsData {
  dailyIntake: {
    calories: number;
    protein: number; // g
    carbohydrates: number; // g
    fats: number; // g
    fiber: number; // g
    water: number; // L
  };
  mealPattern: {
    mealsPerDay: number;
    breakfastTime: string;
    lunchTime: string;
    dinnerTime: string;
    snacks: number;
  };
  foodPreferences: {
    likes: string[];
    dislikes: string[];
    restrictions: string[];
    culturalPreferences: string[];
  };
  supplementation: {
    vitamins: string[];
    minerals: string[];
    proteins: string[];
    other: string[];
  };
  hydrationHabits: {
    waterIntake: number; // L/day
    sportsdrinks: boolean;
    caffeineIntake: number; // mg/day
  };
  eatingBehavior: {
    eatingSpeed: 'slow' | 'normal' | 'fast';
    portionSizes: 'small' | 'normal' | 'large';
    emotionalEating: boolean;
    socialEating: boolean;
  };
  nutritionalKnowledge: {
    level: 'low' | 'basic' | 'intermediate' | 'advanced';
    areas: string[];
  };
}

// Evaluación completa ABCD
export interface ABCDEvaluation {
  id: string;
  athleteId: string;
  date: string;
  evaluator: string;
  anthropometry: AnthropometryData;
  biochemistry: BiochemistryData;
  clinical: ClinicalData;
  dietetics: DieteticsData;
  overallAssessment: {
    nutritionalStatus: 'optimal' | 'adequate' | 'deficient' | 'at-risk';
    riskFactors: string[];
    strengths: string[];
    recommendations: string[];
  };
  followUpDate: string;
}

// Plan de tratamiento personalizado
export interface TreatmentPlan {
  id: string;
  athleteId: string;
  evaluationId: string;
  createdDate: string;
  objectives: string[];
  nutritionalGoals: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fats: number;
    hydration: number;
  };
  mealPlan: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  supplementation: {
    supplements: string[];
    dosage: string[];
    timing: string[];
  };
  monitoring: {
    frequency: string;
    parameters: string[];
    nextReview: string;
  };
  educationalMaterials: string[];
  status: 'active' | 'completed' | 'modified' | 'discontinued';
}

// Alertas del sistema
export interface NutritionalAlert {
  id: string;
  athleteId: string;
  type: 'anthropometric' | 'biochemical' | 'clinical' | 'dietary';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendations: string[];
  createdDate: string;
  resolved: boolean;
  resolvedDate?: string;
}

// Reportes y estadísticas
export interface Report {
  id: string;
  title: string;
  type: 'individual' | 'group' | 'comparative' | 'longitudinal';
  athleteIds: string[];
  dateRange: {
    start: string;
    end: string;
  };
  parameters: string[];
  data: any;
  generatedDate: string;
  generatedBy: string;
}

// Valores de referencia nutricionales
export interface ReferenceValues {
  ageGroup: string;
  gender: 'male' | 'female';
  anthropometry: {
    bmiRanges: {
      underweight: number;
      normal: [number, number];
      overweight: number;
      obese: number;
    };
    bodyFatRanges: {
      low: number;
      normal: [number, number];
      high: number;
    };
  };
  biochemistry: {
    hemoglobin: [number, number];
    iron: [number, number];
    vitaminD: [number, number];
    glucose: [number, number];
  };
  dietary: {
    caloriesPerKg: [number, number];
    proteinPerKg: [number, number];
    carbohydratesPercent: [number, number];
    fatsPercent: [number, number];
  };
}

// Configuración del sistema
export interface SystemConfig {
  alerts: {
    enabled: boolean;
    thresholds: {
      bmiDeviation: number;
      weightLossRate: number;
      biochemicalValues: Record<string, [number, number]>;
    };
  };
  reports: {
    autoGenerate: boolean;
    frequency: 'weekly' | 'monthly' | 'quarterly';
    recipients: string[];
  };
  evaluations: {
    reminderDays: number;
    mandatoryFields: string[];
  };
}

// ==================== SISTEMA DE PLANES ALIMENTICIOS ====================

// Información nutricional de un alimento
export interface FoodItem {
  id: string;
  name: string;
  category: 'cereales' | 'proteinas' | 'lacteos' | 'frutas' | 'verduras' | 'grasas' | 'leguminosas' | 'azucares' | 'bebidas';
  calories: number; // kcal por 100g
  macronutrients: {
    protein: number; // g por 100g
    carbohydrates: number; // g por 100g
    fats: number; // g por 100g
    fiber: number; // g por 100g
    sugar: number; // g por 100g
  };
  micronutrients: {
    sodium: number; // mg por 100g
    potassium: number; // mg por 100g
    calcium: number; // mg por 100g
    iron: number; // mg por 100g
    vitaminC: number; // mg por 100g
    vitaminA: number; // μg por 100g
  };
  portionSize: {
    standard: number; // gramos de porción estándar
    description: string; // descripción de la porción (ej: "1 taza", "1 pieza mediana")
  };
  glycemicIndex?: number; // índice glucémico (0-100)
  allergens: string[]; // alergenos comunes
}

// Porción de alimento en una comida
export interface FoodPortion {
  foodId: string;
  quantity: number; // cantidad en gramos
  portionDescription: string; // descripción legible (ej: "1 taza", "150g")
}

// Comida individual (desayuno, almuerzo, etc.)
export interface Meal {
  id: string;
  name: string;
  type: 'desayuno' | 'colacion-matutina' | 'almuerzo' | 'colacion-vespertina' | 'cena' | 'colacion-nocturna';
  foods: FoodPortion[];
  scheduledTime: string; // formato HH:MM
  instructions?: string; // instrucciones especiales de preparación
  nutritionalSummary: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
    totalFiber: number;
  };
}

// Plan alimenticio completo
export interface MealPlan {
  id: string;
  athleteId: string;
  name: string;
  description?: string;
  createdDate: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  createdBy: string; // nutricionista/profesional
  
  // Objetivos nutricionales
  nutritionalGoals: {
    dailyCalories: number;
    proteinPercentage: number; // % del total calórico
    carbsPercentage: number; // % del total calórico
    fatsPercentage: number; // % del total calórico
    fiberGoal: number; // gramos por día
    hydrationGoal: number; // litros por día
  };
  
  // Plan semanal (7 días)
  weeklyPlan: {
    [key: string]: { // 'monday', 'tuesday', etc.
      meals: Meal[];
      notes?: string;
    };
  };
  
  // Restricciones y consideraciones
  restrictions: {
    allergies: string[];
    intolerances: string[];
    dietaryPreferences: string[]; // vegetariano, vegano, etc.
    medicalRestrictions: string[];
  };
  
  // Seguimiento
  adherence?: {
    weeklyCompliance: number; // porcentaje de cumplimiento semanal
    missedMeals: number;
    notes: string[];
  };
}

// Recordatorio de comida
export interface MealReminder {
  id: string;
  athleteId: string;
  mealPlanId: string;
  mealId: string;
  type: 'meal' | 'hydration' | 'supplement' | 'measurement';
  title: string;
  message: string;
  scheduledTime: string; // formato HH:MM
  daysOfWeek: number[]; // 0=domingo, 1=lunes, etc.
  isActive: boolean;
  createdDate: string;
  lastTriggered?: string;
}

// Seguimiento diario del plan
export interface DailyTracking {
  id: string;
  athleteId: string;
  mealPlanId: string;
  date: string; // YYYY-MM-DD
  meals: {
    mealId: string;
    consumed: boolean;
    consumedTime?: string;
    notes?: string;
    satisfactionLevel?: 1 | 2 | 3 | 4 | 5; // escala de satisfacción
  }[];
  hydration: {
    goal: number; // litros
    consumed: number; // litros
  };
  supplements: {
    name: string;
    taken: boolean;
    time?: string;
  }[];
  overallCompliance: number; // porcentaje del día
  notes?: string;
}

// Análisis nutricional del plan
export interface NutritionalAnalysis {
  id: string;
  mealPlanId: string;
  analysisDate: string;
  dailyAverages: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fats: number;
    fiber: number;
    sodium: number;
    sugar: number;
  };
  weeklyDistribution: {
    [day: string]: {
      calories: number;
      macronutrients: {
        protein: number;
        carbs: number;
        fats: number;
      };
    };
  };
  recommendations: string[];
  deficiencies: string[];
  excesses: string[];
  complianceWithGoals: {
    calories: number; // porcentaje de cumplimiento
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
}
