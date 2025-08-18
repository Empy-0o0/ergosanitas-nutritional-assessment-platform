import { AnthropometryData, BiochemistryData, ClinicalData, DieteticsData, ReferenceValues } from './types'

// Cálculos Antropométricos (A)
export class AnthropometryCalculations {
  
  // Calcular IMC (Índice de Masa Corporal)
  static calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100
    return weight / (heightInMeters * heightInMeters)
  }

  // Clasificar IMC según edad y género
  static classifyBMI(bmi: number, age: number, gender: 'male' | 'female'): string {
    // Percentiles de IMC para niños y adolescentes (CDC)
    if (age < 18) {
      if (bmi < 5) return 'Bajo peso severo'
      if (bmi < 15) return 'Bajo peso'
      if (bmi < 85) return 'Normal'
      if (bmi < 95) return 'Sobrepeso'
      return 'Obesidad'
    }
    
    // Adultos
    if (bmi < 18.5) return 'Bajo peso'
    if (bmi < 25) return 'Normal'
    if (bmi < 30) return 'Sobrepeso'
    return 'Obesidad'
  }

  // Calcular percentil de crecimiento
  static calculateGrowthPercentile(value: number, age: number, gender: 'male' | 'female', type: 'height' | 'weight'): number {
    // Tablas de referencia OMS/CDC simplificadas
    const referenceData = this.getReferenceData(age, gender, type)
    
    // Cálculo aproximado del percentil usando distribución normal
    const zScore = (value - referenceData.mean) / referenceData.sd
    return this.zScoreToPercentile(zScore)
  }

  // Calcular masa corporal magra
  static calculateLeanBodyMass(weight: number, bodyFatPercentage: number): number {
    return weight * (1 - bodyFatPercentage / 100)
  }

  // Calcular índice cintura-cadera
  static calculateWaistHipRatio(waist: number, hip: number): number {
    return waist / hip
  }

  // Calcular área muscular del brazo
  static calculateArmMuscleArea(armCircumference: number, tricepsSkinfold: number): number {
    const armMuscleCircumference = armCircumference - (Math.PI * tricepsSkinfold / 10)
    return Math.pow(armMuscleCircumference, 2) / (4 * Math.PI)
  }

  // Estimar porcentaje de grasa corporal usando pliegues cutáneos
  static estimateBodyFat(skinfolds: { triceps: number; biceps: number; subscapular: number; suprailiac: number }, age: number, gender: 'male' | 'female'): number {
    const sum = skinfolds.triceps + skinfolds.biceps + skinfolds.subscapular + skinfolds.suprailiac
    
    if (gender === 'male') {
      return 0.29288 * sum - 0.0005 * Math.pow(sum, 2) + 0.15845 * age - 5.76377
    } else {
      return 0.29669 * sum - 0.00043 * Math.pow(sum, 2) + 0.02963 * age + 1.4072
    }
  }

  private static getReferenceData(age: number, gender: 'male' | 'female', type: 'height' | 'weight') {
    // Datos de referencia simplificados (en una implementación real, usar tablas completas)
    const data: Record<string, Record<string, { mean: number; sd: number }>> = {
      height: {
        male: { mean: 170, sd: 10 },
        female: { mean: 160, sd: 8 }
      },
      weight: {
        male: { mean: 65, sd: 12 },
        female: { mean: 55, sd: 10 }
      }
    }
    
    return data[type][gender]
  }

  private static zScoreToPercentile(zScore: number): number {
    // Aproximación de la función de distribución acumulativa normal
    const t = 1 / (1 + 0.2316419 * Math.abs(zScore))
    const d = 0.3989423 * Math.exp(-zScore * zScore / 2)
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    
    return Math.round((zScore > 0 ? 1 - prob : prob) * 100)
  }
}

// Cálculos Bioquímicos (B)
export class BiochemistryCalculations {
  
  // Evaluar estado del hierro
  static evaluateIronStatus(hemoglobin: number, ferritin: number, age: number, gender: 'male' | 'female'): {
    status: string;
    recommendations: string[];
  } {
    const ironDeficiency = this.checkIronDeficiency(hemoglobin, ferritin, age, gender)
    
    if (ironDeficiency.severe) {
      return {
        status: 'Deficiencia severa de hierro',
        recommendations: [
          'Suplementación con hierro inmediata',
          'Evaluación médica urgente',
          'Dieta rica en hierro hemo',
          'Seguimiento semanal'
        ]
      }
    }
    
    if (ironDeficiency.moderate) {
      return {
        status: 'Deficiencia moderada de hierro',
        recommendations: [
          'Suplementación con hierro',
          'Aumentar consumo de carnes rojas',
          'Combinar con vitamina C',
          'Seguimiento mensual'
        ]
      }
    }
    
    if (ironDeficiency.mild) {
      return {
        status: 'Deficiencia leve de hierro',
        recommendations: [
          'Mejorar dieta con alimentos ricos en hierro',
          'Evitar inhibidores de absorción',
          'Seguimiento en 3 meses'
        ]
      }
    }
    
    return {
      status: 'Estado normal de hierro',
      recommendations: ['Mantener dieta balanceada']
    }
  }

  // Evaluar perfil lipídico
  static evaluateLipidProfile(cholesterol: { total: number; hdl: number; ldl: number; triglycerides: number }): {
    status: string;
    risks: string[];
    recommendations: string[];
  } {
    const risks: string[] = []
    const recommendations: string[] = []
    
    if (cholesterol.total > 200) {
      risks.push('Colesterol total elevado')
      recommendations.push('Reducir grasas saturadas')
    }
    
    if (cholesterol.ldl > 130) {
      risks.push('LDL elevado')
      recommendations.push('Aumentar fibra soluble')
    }
    
    if (cholesterol.hdl < 40) {
      risks.push('HDL bajo')
      recommendations.push('Aumentar actividad física')
    }
    
    if (cholesterol.triglycerides > 150) {
      risks.push('Triglicéridos elevados')
      recommendations.push('Reducir carbohidratos simples')
    }
    
    const status = risks.length === 0 ? 'Perfil lipídico normal' : 'Perfil lipídico alterado'
    
    return { status, risks, recommendations }
  }

  // Calcular riesgo cardiovascular
  static calculateCardiovascularRisk(age: number, gender: 'male' | 'female', cholesterol: number, hdl: number, systolicBP: number, smoking: boolean): number {
    // Framingham Risk Score simplificado para adolescentes
    let score = 0
    
    // Edad
    if (age >= 16) score += 1
    if (age >= 18) score += 2
    
    // Género
    if (gender === 'male') score += 1
    
    // Colesterol
    if (cholesterol > 200) score += 1
    if (cholesterol > 240) score += 2
    
    // HDL
    if (hdl < 40) score += 1
    
    // Presión arterial
    if (systolicBP > 130) score += 1
    if (systolicBP > 140) score += 2
    
    // Tabaquismo
    if (smoking) score += 2
    
    return Math.min(score * 2, 20) // Máximo 20%
  }

  private static checkIronDeficiency(hemoglobin: number, ferritin: number, age: number, gender: 'male' | 'female') {
    const hbThresholds = gender === 'male' ? { low: 13, veryLow: 11 } : { low: 12, veryLow: 10 }
    const ferritinThreshold = 15
    
    return {
      severe: hemoglobin < hbThresholds.veryLow || ferritin < 10,
      moderate: hemoglobin < hbThresholds.low || ferritin < ferritinThreshold,
      mild: ferritin < 20
    }
  }
}

// Cálculos Clínicos (C)
export class ClinicalCalculations {
  
  // Calcular índice de masa corporal ajustado por rendimiento
  static calculatePerformanceAdjustedBMI(bmi: number, muscleMass: number, sport: string): number {
    const sportAdjustments: Record<string, number> = {
      'futbol': 1.05,
      'basketball': 1.08,
      'natacion': 1.03,
      'atletismo': 1.02,
      'gimnasia': 0.98,
      'default': 1.0
    }
    
    const adjustment = sportAdjustments[sport] || sportAdjustments.default
    const muscleAdjustment = muscleMass > 45 ? 1.1 : 1.0
    
    return bmi * adjustment * muscleAdjustment
  }

  // Evaluar estado de hidratación
  static evaluateHydrationStatus(urineSG: number, skinTurgor: number, mucousMembranes: string): {
    status: string;
    level: number;
    recommendations: string[];
  } {
    let dehydrationScore = 0
    
    if (urineSG > 1.020) dehydrationScore += 2
    else if (urineSG > 1.015) dehydrationScore += 1
    
    if (skinTurgor > 2) dehydrationScore += 2
    else if (skinTurgor > 1) dehydrationScore += 1
    
    if (mucousMembranes === 'dry') dehydrationScore += 2
    else if (mucousMembranes === 'sticky') dehydrationScore += 1
    
    let status: string
    let recommendations: string[]
    
    if (dehydrationScore >= 4) {
      status = 'Deshidratación severa'
      recommendations = [
        'Rehidratación inmediata',
        'Evaluación médica',
        'Monitoreo continuo'
      ]
    } else if (dehydrationScore >= 2) {
      status = 'Deshidratación moderada'
      recommendations = [
        'Aumentar ingesta de líquidos',
        'Bebidas deportivas',
        'Monitoreo cada 2 horas'
      ]
    } else if (dehydrationScore >= 1) {
      status = 'Deshidratación leve'
      recommendations = [
        'Incrementar consumo de agua',
        'Monitoreo regular'
      ]
    } else {
      status = 'Hidratación adecuada'
      recommendations = ['Mantener ingesta actual']
    }
    
    return {
      status,
      level: Math.max(0, 100 - (dehydrationScore * 20)),
      recommendations
    }
  }

  // Calcular frecuencia cardíaca objetivo
  static calculateTargetHeartRate(age: number, restingHR: number, intensity: number): {
    target: number;
    range: [number, number];
  } {
    const maxHR = 220 - age
    const hrReserve = maxHR - restingHR
    const target = Math.round(restingHR + (hrReserve * intensity))
    
    return {
      target,
      range: [Math.round(target * 0.95), Math.round(target * 1.05)]
    }
  }

  // Evaluar recuperación post-ejercicio
  static evaluateRecovery(restingHR: number, currentHR: number, timePostExercise: number): {
    status: string;
    percentage: number;
    recommendations: string[];
  } {
    const expectedRecovery = Math.max(0, 100 - (timePostExercise * 2))
    const actualRecovery = Math.max(0, 100 - ((currentHR - restingHR) / restingHR * 100))
    
    let status: string
    let recommendations: string[]
    
    if (actualRecovery >= expectedRecovery * 0.9) {
      status = 'Recuperación excelente'
      recommendations = ['Mantener rutina actual']
    } else if (actualRecovery >= expectedRecovery * 0.7) {
      status = 'Recuperación buena'
      recommendations = ['Optimizar descanso', 'Revisar hidratación']
    } else {
      status = 'Recuperación deficiente'
      recommendations = [
        'Aumentar tiempo de descanso',
        'Evaluar sobrecarga de entrenamiento',
        'Mejorar calidad del sueño'
      ]
    }
    
    return {
      status,
      percentage: Math.round(actualRecovery),
      recommendations
    }
  }
}

// Cálculos Dietéticos (D)
export class DieteticsCalculations {
  
  // Calcular requerimientos calóricos
  static calculateCaloricNeeds(weight: number, height: number, age: number, gender: 'male' | 'female', activityLevel: number, sport: string): {
    bmr: number;
    totalCalories: number;
    breakdown: {
      carbohydrates: number;
      proteins: number;
      fats: number;
    };
  } {
    // Ecuación de Mifflin-St Jeor
    let bmr: number
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }
    
    // Ajuste por deporte
    const sportMultipliers: Record<string, number> = {
      'futbol': 1.8,
      'basketball': 1.9,
      'natacion': 2.0,
      'atletismo': 1.7,
      'gimnasia': 1.6,
      'default': 1.7
    }
    
    const sportMultiplier = sportMultipliers[sport] || sportMultipliers.default
    const totalCalories = Math.round(bmr * sportMultiplier * activityLevel)
    
    // Distribución de macronutrientes para deportistas
    const carbohydrateCalories = totalCalories * 0.55 // 55%
    const proteinCalories = totalCalories * 0.20 // 20%
    const fatCalories = totalCalories * 0.25 // 25%
    
    return {
      bmr: Math.round(bmr),
      totalCalories,
      breakdown: {
        carbohydrates: Math.round(carbohydrateCalories / 4), // g
        proteins: Math.round(proteinCalories / 4), // g
        fats: Math.round(fatCalories / 9) // g
      }
    }
  }

  // Calcular requerimientos de hidratación
  static calculateHydrationNeeds(weight: number, exerciseDuration: number, sweatRate: number, temperature: number): {
    baseNeeds: number;
    exerciseNeeds: number;
    totalNeeds: number;
    recommendations: string[];
  } {
    const baseNeeds = weight * 35 // ml/kg/día
    const exerciseNeeds = (exerciseDuration / 60) * sweatRate * 1000 // ml
    
    // Ajuste por temperatura
    const tempAdjustment = temperature > 25 ? 1.2 : temperature < 10 ? 0.9 : 1.0
    const totalNeeds = (baseNeeds + exerciseNeeds) * tempAdjustment
    
    const recommendations: string[] = []
    
    if (exerciseDuration > 60) {
      recommendations.push('Bebidas deportivas durante el ejercicio')
    }
    
    if (temperature > 30) {
      recommendations.push('Hidratación pre-enfriamiento')
      recommendations.push('Monitoreo frecuente de peso')
    }
    
    if (sweatRate > 1.5) {
      recommendations.push('Estrategia de reposición personalizada')
    }
    
    return {
      baseNeeds: Math.round(baseNeeds),
      exerciseNeeds: Math.round(exerciseNeeds),
      totalNeeds: Math.round(totalNeeds),
      recommendations
    }
  }

  // Evaluar calidad de la dieta
  static evaluateDietQuality(intake: {
    fruits: number;
    vegetables: number;
    wholegrains: number;
    proteins: number;
    dairy: number;
    processedFoods: number;
  }): {
    score: number;
    grade: string;
    recommendations: string[];
  } {
    let score = 0
    const recommendations: string[] = []
    
    // Frutas (0-20 puntos)
    if (intake.fruits >= 3) score += 20
    else if (intake.fruits >= 2) score += 15
    else if (intake.fruits >= 1) score += 10
    else recommendations.push('Aumentar consumo de frutas a 3 porciones diarias')
    
    // Vegetales (0-20 puntos)
    if (intake.vegetables >= 4) score += 20
    else if (intake.vegetables >= 3) score += 15
    else if (intake.vegetables >= 2) score += 10
    else recommendations.push('Aumentar consumo de vegetales a 4 porciones diarias')
    
    // Granos integrales (0-15 puntos)
    if (intake.wholegrains >= 3) score += 15
    else if (intake.wholegrains >= 2) score += 10
    else if (intake.wholegrains >= 1) score += 5
    else recommendations.push('Incluir granos integrales en la dieta')
    
    // Proteínas (0-15 puntos)
    if (intake.proteins >= 2) score += 15
    else if (intake.proteins >= 1) score += 10
    else recommendations.push('Asegurar 2 porciones de proteína diarias')
    
    // Lácteos (0-15 puntos)
    if (intake.dairy >= 2) score += 15
    else if (intake.dairy >= 1) score += 10
    else recommendations.push('Incluir productos lácteos o alternativas')
    
    // Penalización por alimentos procesados (0 a -15 puntos)
    if (intake.processedFoods <= 1) score += 15
    else if (intake.processedFoods <= 2) score += 10
    else if (intake.processedFoods <= 3) score += 5
    else recommendations.push('Reducir alimentos procesados')
    
    let grade: string
    if (score >= 85) grade = 'A'
    else if (score >= 70) grade = 'B'
    else if (score >= 55) grade = 'C'
    else if (score >= 40) grade = 'D'
    else grade = 'F'
    
    return { score, grade, recommendations }
  }

  // Calcular timing de nutrientes
  static calculateNutrientTiming(exerciseTime: string, exerciseDuration: number): {
    preExercise: { time: string; recommendations: string[] };
    duringExercise: { recommendations: string[] };
    postExercise: { time: string; recommendations: string[] };
  } {
    const exerciseDate = new Date(`2024-01-01 ${exerciseTime}`)
    
    // Pre-ejercicio (2-3 horas antes)
    const preTime = new Date(exerciseDate.getTime() - 2.5 * 60 * 60 * 1000)
    
    // Post-ejercicio (30 minutos después)
    const postTime = new Date(exerciseDate.getTime() + exerciseDuration * 60 * 1000 + 30 * 60 * 1000)
    
    return {
      preExercise: {
        time: preTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        recommendations: [
          'Comida rica en carbohidratos complejos',
          'Proteína moderada',
          'Baja en grasas y fibra',
          'Hidratación adecuada'
        ]
      },
      duringExercise: {
        recommendations: exerciseDuration > 60 ? [
          'Bebidas deportivas cada 15-20 min',
          'Carbohidratos simples si >90 min',
          'Monitorear hidratación'
        ] : [
          'Agua según sed',
          'No necesario carbohidratos'
        ]
      },
      postExercise: {
        time: postTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        recommendations: [
          'Ratio 3:1 carbohidratos:proteína',
          'Rehidratación completa',
          'Alimentos ricos en antioxidantes',
          'Comida completa en 2 horas'
        ]
      }
    }
  }
}

// Evaluación integral ABCD
export class ABCDEvaluator {
  
  static evaluateOverallStatus(
    anthropometry: AnthropometryData,
    biochemistry: BiochemistryData,
    clinical: ClinicalData,
    dietetics: DieteticsData,
    age: number,
    gender: 'male' | 'female'
  ): {
    overallScore: number;
    status: 'optimal' | 'adequate' | 'deficient' | 'at-risk';
    riskFactors: string[];
    strengths: string[];
    recommendations: string[];
  } {
    let totalScore = 0
    let maxScore = 0
    const riskFactors: string[] = []
    const strengths: string[] = []
    const recommendations: string[] = []
    
    // Evaluación Antropométrica (25%)
    const bmiStatus = AnthropometryCalculations.classifyBMI(anthropometry.bmi, age, gender)
    if (bmiStatus === 'Normal') {
      totalScore += 25
      strengths.push('IMC en rango normal')
    } else {
      riskFactors.push(`IMC: ${bmiStatus}`)
      recommendations.push('Ajustar composición corporal')
    }
    maxScore += 25
    
    // Evaluación Bioquímica (25%)
    if (biochemistry.hemoglobin && biochemistry.ferritin) {
      const ironStatus = BiochemistryCalculations.evaluateIronStatus(
        biochemistry.hemoglobin,
        biochemistry.ferritin,
        age,
        gender
      )
      
      if (ironStatus.status === 'Estado normal de hierro') {
        totalScore += 25
        strengths.push('Estado de hierro normal')
      } else {
        riskFactors.push(ironStatus.status)
        recommendations.push(...ironStatus.recommendations)
      }
    }
    maxScore += 25
    
    // Evaluación Clínica (25%)
    const vitalSigns = clinical.vitalSigns
    let clinicalScore = 0
    
    if (vitalSigns.bloodPressure.systolic < 130 && vitalSigns.bloodPressure.diastolic < 85) {
      clinicalScore += 12.5
      strengths.push('Presión arterial normal')
    } else {
      riskFactors.push('Presión arterial elevada')
    }
    
    if (vitalSigns.heartRate >= 60 && vitalSigns.heartRate <= 100) {
      clinicalScore += 12.5
      strengths.push('Frecuencia cardíaca normal')
    } else {
      riskFactors.push('Frecuencia cardíaca anormal')
    }
    
    totalScore += clinicalScore
    maxScore += 25
    
    // Evaluación Dietética (25%)
    const dietScore = this.evaluateDietaryIntake(dietetics)
    totalScore += dietScore
    maxScore += 25
    
    if (dietScore >= 20) {
      strengths.push('Dieta de buena calidad')
    } else {
      riskFactors.push('Calidad dietética deficiente')
      recommendations.push('Mejorar calidad de la dieta')
    }
    
    const overallScore = Math.round((totalScore / maxScore) * 100)
    
    let status: 'optimal' | 'adequate' | 'deficient' | 'at-risk'
    if (overallScore >= 85) status = 'optimal'
    else if (overallScore >= 70) status = 'adequate'
    else if (overallScore >= 50) status = 'at-risk'
    else status = 'deficient'
    
    return {
      overallScore,
      status,
      riskFactors,
      strengths,
      recommendations
    }
  }
  
  private static evaluateDietaryIntake(dietetics: DieteticsData): number {
    let score = 0
    
    // Evaluar adecuación calórica (simplificado)
    if (dietetics.dailyIntake.calories >= 2000 && dietetics.dailyIntake.calories <= 3500) {
      score += 8
    }
    
    // Evaluar proteínas
    if (dietetics.dailyIntake.protein >= 1.2 && dietetics.dailyIntake.protein <= 2.0) {
      score += 8
    }
    
    // Evaluar hidratación
    if (dietetics.dailyIntake.water >= 2.5) {
      score += 9
    }
    
    return score
  }
}
