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
