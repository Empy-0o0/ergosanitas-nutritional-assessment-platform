"use client"

import { useState, useEffect } from 'react'
import { DieteticsData } from '@/lib/types'
import { DieteticsCalculations } from '@/lib/calculations'

interface DieteticsFormProps {
  athleteId: string
  age: number
  gender: 'male' | 'female'
  weight: number
  height: number
  sport: string
  initialData?: DieteticsData
  onSave: (data: DieteticsData) => void
}

export default function DieteticsForm({ 
  athleteId, 
  age, 
  gender, 
  weight,
  height,
  sport,
  initialData, 
  onSave 
}: DieteticsFormProps) {
  const [formData, setFormData] = useState<Partial<DieteticsData>>({
    dailyIntake: initialData?.dailyIntake || {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fats: 0,
      fiber: 0,
      water: 0
    },
    mealPattern: initialData?.mealPattern || {
      mealsPerDay: 3,
      breakfastTime: '07:00',
      lunchTime: '12:00',
      dinnerTime: '19:00',
      snacks: 2
    },
    foodPreferences: initialData?.foodPreferences || {
      likes: [],
      dislikes: [],
      restrictions: [],
      culturalPreferences: []
    },
    supplementation: initialData?.supplementation || {
      vitamins: [],
      minerals: [],
      proteins: [],
      other: []
    },
    hydrationHabits: initialData?.hydrationHabits || {
      waterIntake: 0,
      sportsdrinks: false,
      caffeineIntake: 0
    },
    eatingBehavior: initialData?.eatingBehavior || {
      eatingSpeed: 'normal',
      portionSizes: 'normal',
      emotionalEating: false,
      socialEating: true
    },
    nutritionalKnowledge: initialData?.nutritionalKnowledge || {
      level: 'basic',
      areas: []
    }
  })

  const [analysis, setAnalysis] = useState({
    caloricNeeds: { bmr: 0, totalCalories: 0, breakdown: { carbohydrates: 0, proteins: 0, fats: 0 } },
    hydrationNeeds: { baseNeeds: 0, exerciseNeeds: 0, totalNeeds: 0, recommendations: [] as string[] },
    dietQuality: { score: 0, grade: '', recommendations: [] as string[] },
    nutrientTiming: {
      preExercise: { time: '', recommendations: [] as string[] },
      duringExercise: { recommendations: [] as string[] },
      postExercise: { time: '', recommendations: [] as string[] }
    },
    overallAssessment: ''
  })

  useEffect(() => {
    if (weight && height) {
      const caloricNeeds = DieteticsCalculations.calculateCaloricNeeds(
        weight, height, age, gender, 1.5, sport
      )

      const hydrationNeeds = DieteticsCalculations.calculateHydrationNeeds(
        weight, 90, 1.2, 25
      )

      const dietQuality = DieteticsCalculations.evaluateDietQuality({
        fruits: 2,
        vegetables: 3,
        wholegrains: 2,
        proteins: 2,
        dairy: 2,
        processedFoods: 1
      })

      const nutrientTiming = DieteticsCalculations.calculateNutrientTiming('16:00', 90)

      setAnalysis({
        caloricNeeds,
        hydrationNeeds,
        dietQuality,
        nutrientTiming,
        overallAssessment: generateOverallAssessment(caloricNeeds, dietQuality, formData)
      })
    }
  }, [weight, height, age, gender, sport, formData.dailyIntake])

  const generateOverallAssessment = (caloricNeeds: any, dietQuality: any, formData: any) => {
    const issues = []
    const currentCalories = formData.dailyIntake?.calories || 0
    
    if (currentCalories < caloricNeeds.totalCalories * 0.8) {
      issues.push('ingesta calórica insuficiente')
    } else if (currentCalories > caloricNeeds.totalCalories * 1.2) {
      issues.push('ingesta calórica excesiva')
    }

    if (dietQuality.score < 70) issues.push('calidad dietética deficiente')
    if ((formData.hydrationHabits?.waterIntake || 0) < 2) issues.push('hidratación insuficiente')

    if (issues.length === 0) return 'Patrón dietético adecuado'
    if (issues.length === 1) return `Se detecta ${issues[0]}`
    return `Se detectan: ${issues.join(', ')}`
  }

  const handleDailyIntakeChange = (field: keyof DieteticsData['dailyIntake'], value: number) => {
    setFormData(prev => ({
      ...prev,
      dailyIntake: {
        ...prev.dailyIntake!,
        [field]: value
      }
    }))
  }

  const handleSave = () => {
    const completeData: DieteticsData = {
      dailyIntake: formData.dailyIntake || {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fats: 0,
        fiber: 0,
        water: 0
      },
      mealPattern: formData.mealPattern || {
        mealsPerDay: 3,
        breakfastTime: '07:00',
        lunchTime: '12:00',
        dinnerTime: '19:00',
        snacks: 2
      },
      foodPreferences: formData.foodPreferences || {
        likes: [],
        dislikes: [],
        restrictions: [],
        culturalPreferences: []
      },
      supplementation: formData.supplementation || {
        vitamins: [],
        minerals: [],
        proteins: [],
        other: []
      },
      hydrationHabits: formData.hydrationHabits || {
        waterIntake: 0,
        sportsdrinks: false,
        caffeineIntake: 0
      },
      eatingBehavior: formData.eatingBehavior || {
        eatingSpeed: 'normal',
        portionSizes: 'normal',
        emotionalEating: false,
        socialEating: true
      },
      nutritionalKnowledge: formData.nutritionalKnowledge || {
        level: 'basic',
        areas: []
      }
    }
    onSave(completeData)
  }

  const getIntakeColor = (current: number, recommended: number) => {
    const ratio = current / recommended
    if (ratio < 0.8 || ratio > 1.2) return 'text-red-600'
    if (ratio < 0.9 || ratio > 1.1) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-purple-800">D: Evaluación Dietética</h3>
        <div className="text-sm text-gray-500">
          {sport} • {weight}kg • {height}cm
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-4">Ingesta Diaria Actual</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calorías (kcal) *
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.dailyIntake?.calories || ''}
                  onChange={(e) => handleDailyIntakeChange('calories', parseFloat(e.target.value) || 0)}
                  placeholder="2500"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Recomendado: {analysis.caloricNeeds.totalCalories} kcal
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proteínas (g) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.dailyIntake?.protein || ''}
                  onChange={(e) => handleDailyIntakeChange('protein', parseFloat(e.target.value) || 0)}
                  placeholder="120"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Recomendado: {analysis.caloricNeeds.breakdown.proteins}g
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carbohidratos (g) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.dailyIntake?.carbohydrates || ''}
                  onChange={(e) => handleDailyIntakeChange('carbohydrates', parseFloat(e.target.value) || 0)}
                  placeholder="350"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Recomendado: {analysis.caloricNeeds.breakdown.carbohydrates}g
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grasas (g) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.dailyIntake?.fats || ''}
                  onChange={(e) => handleDailyIntakeChange('fats', parseFloat(e.target.value) || 0)}
                  placeholder="80"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Recomendado: {analysis.caloricNeeds.breakdown.fats}g
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agua (L) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.dailyIntake?.water || ''}
                  onChange={(e) => handleDailyIntakeChange('water', parseFloat(e.target.value) || 0)}
                  placeholder="3.0"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Recomendado: {(analysis.hydrationNeeds.totalNeeds / 1000).toFixed(1)}L
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-4">Análisis Nutricional</h4>
            
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                <h5 className="font-medium text-purple-800 mb-2">Requerimientos Calóricos</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>TMB:</span>
                    <span className="text-purple-600">{analysis.caloricNeeds.bmr} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Necesidades Totales:</span>
                    <span className="text-purple-600 font-bold">{analysis.caloricNeeds.totalCalories} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ingesta Actual:</span>
                    <span className={getIntakeColor(formData.dailyIntake?.calories || 0, analysis.caloricNeeds.totalCalories)}>
                      {formData.dailyIntake?.calories || 0} kcal
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
                <h5 className="font-medium text-blue-800 mb-2">Distribución de Macronutrientes</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Carbohidratos (55%):</span>
                    <span className={getIntakeColor(formData.dailyIntake?.carbohydrates || 0, analysis.caloricNeeds.breakdown.carbohydrates)}>
                      {formData.dailyIntake?.carbohydrates || 0}g / {analysis.caloricNeeds.breakdown.carbohydrates}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Proteínas (20%):</span>
                    <span className={getIntakeColor(formData.dailyIntake?.protein || 0, analysis.caloricNeeds.breakdown.proteins)}>
                      {formData.dailyIntake?.protein || 0}g / {analysis.caloricNeeds.breakdown.proteins}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grasas (25%):</span>
                    <span className={getIntakeColor(formData.dailyIntake?.fats || 0, analysis.caloricNeeds.breakdown.fats)}>
                      {formData.dailyIntake?.fats || 0}g / {analysis.caloricNeeds.breakdown.fats}g
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border-l-4 border-green-500">
                <h5 className="font-medium text-green-800 mb-2">Calidad de la Dieta</h5>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Puntuación:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-700">{analysis.dietQuality.score}/100</span>
                    <span className="text-lg font-bold text-blue-600">{analysis.dietQuality.grade}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border-l-4 border-orange-500">
                <h5 className="font-medium text-orange-800 mb-2">Hidratación</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Necesidades Totales:</span>
                    <span className="text-orange-600 font-bold">{(analysis.hydrationNeeds.totalNeeds / 1000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ingesta Actual:</span>
                    <span className={getIntakeColor((formData.dailyIntake?.water || 0) * 1000, analysis.hydrationNeeds.totalNeeds)}>
                      {formData.dailyIntake?.water || 0}L
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-3">Evaluación General</h4>
            <p className="text-sm text-gray-700 mb-3">{analysis.overallAssessment}</p>
            
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-yellow-800">Recomendaciones:</h5>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-600">•</span>
                  <span>Mantener horarios regulares de comida</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-600">•</span>
                  <span>Hidratarse antes, durante y después del ejercicio</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-600">•</span>
                  <span>Incluir variedad de alimentos en cada grupo</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-600">•</span>
                  <span>Consultar con nutricionista deportivo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Guardar Evaluación Dietética
        </button>
      </div>
    </div>
  )
}
