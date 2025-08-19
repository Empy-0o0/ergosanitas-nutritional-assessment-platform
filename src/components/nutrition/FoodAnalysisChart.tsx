"use client"

import { useState } from 'react'

interface NutritionData {
  calories: number
  protein: number
  carbohydrates: number
  fats: number
  fiber: number
  sodium: number
  sugar: number
}

interface FoodAnalysisChartProps {
  dailyNutrition: NutritionData
  goals?: {
    calories: number
    protein: number
    carbohydrates: number
    fats: number
  }
}

export default function FoodAnalysisChart({ dailyNutrition, goals }: FoodAnalysisChartProps) {
  const [activeTab, setActiveTab] = useState<'macros' | 'micros' | 'goals'>('macros')

  const macroPercentages = dailyNutrition.calories > 0 ? {
    protein: Math.round((dailyNutrition.protein * 4 / dailyNutrition.calories) * 100),
    carbs: Math.round((dailyNutrition.carbohydrates * 4 / dailyNutrition.calories) * 100),
    fats: Math.round((dailyNutrition.fats * 9 / dailyNutrition.calories) * 100)
  } : { protein: 0, carbs: 0, fats: 0 }

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-red-500'
    if (percentage < 80) return 'bg-yellow-500'
    if (percentage <= 100) return 'bg-green-500'
    return 'bg-orange-500'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Análisis Nutricional</h3>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('macros')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'macros' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Macros
          </button>
          <button
            onClick={() => setActiveTab('micros')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'micros' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Micros
          </button>
          {goals && (
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'goals' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Objetivos
            </button>
          )}
        </div>
      </div>

      {activeTab === 'macros' && (
        <div className="space-y-6">
          {/* Macronutrient Distribution */}
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-4">Distribución de Macronutrientes</h4>
            <div className="space-y-4">
              {/* Protein */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Proteínas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{Math.round(dailyNutrition.protein)}g</span>
                  <span className="text-sm font-medium text-gray-900">{macroPercentages.protein}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${macroPercentages.protein}%` }}
                ></div>
              </div>

              {/* Carbohydrates */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Carbohidratos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{Math.round(dailyNutrition.carbohydrates)}g</span>
                  <span className="text-sm font-medium text-gray-900">{macroPercentages.carbs}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${macroPercentages.carbs}%` }}
                ></div>
              </div>

              {/* Fats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Grasas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{Math.round(dailyNutrition.fats)}g</span>
                  <span className="text-sm font-medium text-gray-900">{macroPercentages.fats}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${macroPercentages.fats}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-blue-800 mb-2">Recomendaciones para Atletas</h5>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• Proteínas: 15-20% (1.2-2.0g/kg peso corporal)</p>
              <p>• Carbohidratos: 45-65% (5-10g/kg peso corporal)</p>
              <p>• Grasas: 20-35% del total calórico</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'micros' && (
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-700 mb-4">Micronutrientes</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-700 font-medium text-sm">Fibra</div>
              <div className="text-2xl font-bold text-purple-800">{Math.round(dailyNutrition.fiber)}g</div>
              <div className="text-xs text-purple-600">Recomendado: 25-35g/día</div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-red-700 font-medium text-sm">Sodio</div>
              <div className="text-2xl font-bold text-red-800">{Math.round(dailyNutrition.sodium)}mg</div>
              <div className="text-xs text-red-600">Límite: menos de 2300mg/día</div>
            </div>
            
            <div className="bg-pink-50 rounded-lg p-4">
              <div className="text-pink-700 font-medium text-sm">Azúcares</div>
              <div className="text-2xl font-bold text-pink-800">{Math.round(dailyNutrition.sugar)}g</div>
              <div className="text-xs text-pink-600">Límite: menos de 50g/día</div>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="text-indigo-700 font-medium text-sm">Densidad Calórica</div>
              <div className="text-2xl font-bold text-indigo-800">
                {dailyNutrition.calories > 0 ? Math.round(dailyNutrition.calories / 100) : 0}
              </div>
              <div className="text-xs text-indigo-600">kcal/100g promedio</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-green-800 mb-2">Consejos Nutricionales</h5>
            <div className="text-xs text-green-700 space-y-1">
              <p>• Aumenta el consumo de fibra con frutas y verduras</p>
              <p>• Limita el sodio para mantener una buena hidratación</p>
              <p>• Prefiere azúcares naturales de frutas</p>
              <p>• Mantén una densidad calórica equilibrada</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'goals' && goals && (
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-700 mb-4">Progreso hacia Objetivos</h4>
          
          <div className="space-y-4">
            {/* Calories Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Calorías</span>
                <span className="text-sm text-gray-600">
                  {Math.round(dailyNutrition.calories)} / {goals.calories} kcal
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    getProgressColor(getProgressPercentage(dailyNutrition.calories, goals.calories))
                  }`}
                  style={{ width: `${getProgressPercentage(dailyNutrition.calories, goals.calories)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(getProgressPercentage(dailyNutrition.calories, goals.calories))}% completado
              </div>
            </div>

            {/* Protein Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Proteínas</span>
                <span className="text-sm text-gray-600">
                  {Math.round(dailyNutrition.protein)} / {goals.protein}g
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    getProgressColor(getProgressPercentage(dailyNutrition.protein, goals.protein))
                  }`}
                  style={{ width: `${getProgressPercentage(dailyNutrition.protein, goals.protein)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(getProgressPercentage(dailyNutrition.protein, goals.protein))}% completado
              </div>
            </div>

            {/* Carbohydrates Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Carbohidratos</span>
                <span className="text-sm text-gray-600">
                  {Math.round(dailyNutrition.carbohydrates)} / {goals.carbohydrates}g
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    getProgressColor(getProgressPercentage(dailyNutrition.carbohydrates, goals.carbohydrates))
                  }`}
                  style={{ width: `${getProgressPercentage(dailyNutrition.carbohydrates, goals.carbohydrates)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(getProgressPercentage(dailyNutrition.carbohydrates, goals.carbohydrates))}% completado
              </div>
            </div>

            {/* Fats Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Grasas</span>
                <span className="text-sm text-gray-600">
                  {Math.round(dailyNutrition.fats)} / {goals.fats}g
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    getProgressColor(getProgressPercentage(dailyNutrition.fats, goals.fats))
                  }`}
                  style={{ width: `${getProgressPercentage(dailyNutrition.fats, goals.fats)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(getProgressPercentage(dailyNutrition.fats, goals.fats))}% completado
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-yellow-800 mb-2">Estado del Progreso</h5>
            <div className="text-xs text-yellow-700">
              {getProgressPercentage(dailyNutrition.calories, goals.calories) < 50 && (
                <p>• Necesitas aumentar tu ingesta calórica para alcanzar tus objetivos</p>
              )}
              {getProgressPercentage(dailyNutrition.protein, goals.protein) < 80 && (
                <p>• Considera agregar más fuentes de proteína a tus comidas</p>
              )}
              {getProgressPercentage(dailyNutrition.carbohydrates, goals.carbohydrates) < 80 && (
                <p>• Incluye más carbohidratos complejos para energía sostenida</p>
              )}
              {getProgressPercentage(dailyNutrition.calories, goals.calories) >= 80 && 
               getProgressPercentage(dailyNutrition.protein, goals.protein) >= 80 && (
                <p>• ¡Excelente progreso! Mantén este ritmo para alcanzar tus objetivos</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
