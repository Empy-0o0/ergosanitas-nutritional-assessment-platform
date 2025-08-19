"use client"

import { useState, useEffect } from 'react'
import { Athlete } from '@/lib/types'
import { foodDatabase, calculateNutritionForPortion } from '@/data/foodDatabase'

interface WeeklyData {
  date: string
  calories: number
  protein: number
  carbohydrates: number
  fats: number
  fiber: number
}

interface WeeklyNutritionReportProps {
  athleteId: string
  athlete: Athlete
}

export default function WeeklyNutritionReport({ athleteId, athlete }: WeeklyNutritionReportProps) {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
  const [selectedWeek, setSelectedWeek] = useState(0) // 0 = current week, 1 = last week, etc.

  useEffect(() => {
    loadWeeklyData()
  }, [athleteId, selectedWeek])

  const loadWeeklyData = () => {
    const data: WeeklyData[] = []
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() - (selectedWeek * 7))

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      const dateString = date.toISOString().split('T')[0]
      
      const storageKey = `nutrition_${athleteId}_${dateString}`
      const stored = localStorage.getItem(storageKey)
      
      let dayTotals = {
        date: dateString,
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fats: 0,
        fiber: 0
      }

      if (stored) {
        const entries = JSON.parse(stored)
        entries.forEach((entry: any) => {
          const food = foodDatabase.find(f => f.id === entry.foodId)
          if (food) {
            const nutrition = calculateNutritionForPortion(food, entry.quantity)
            dayTotals.calories += nutrition.calories
            dayTotals.protein += nutrition.protein
            dayTotals.carbohydrates += nutrition.carbohydrates
            dayTotals.fats += nutrition.fats
            dayTotals.fiber += nutrition.fiber
          }
        })
      }

      data.push(dayTotals)
    }

    setWeeklyData(data)
  }

  const getWeeklyAverages = () => {
    const daysWithData = weeklyData.filter(day => day.calories > 0)
    if (daysWithData.length === 0) return null

    return {
      calories: Math.round(daysWithData.reduce((sum, day) => sum + day.calories, 0) / daysWithData.length),
      protein: Math.round(daysWithData.reduce((sum, day) => sum + day.protein, 0) / daysWithData.length),
      carbohydrates: Math.round(daysWithData.reduce((sum, day) => sum + day.carbohydrates, 0) / daysWithData.length),
      fats: Math.round(daysWithData.reduce((sum, day) => sum + day.fats, 0) / daysWithData.length),
      fiber: Math.round(daysWithData.reduce((sum, day) => sum + day.fiber, 0) / daysWithData.length),
      daysTracked: daysWithData.length
    }
  }

  const getRecommendations = () => {
    const averages = getWeeklyAverages()
    if (!averages) return []

    const recommendations = []
    const weight = athlete.anthropometry?.weight || 70 // Default weight if not available

    // Calorie recommendations for athletes (30-40 kcal/kg)
    const minCalories = weight * 30
    const maxCalories = weight * 40
    
    if (averages.calories < minCalories) {
      recommendations.push({
        type: 'warning',
        message: `Ingesta calórica baja. Recomendado: ${minCalories}-${maxCalories} kcal/día`,
        action: 'Aumentar porciones o agregar snacks saludables'
      })
    }

    // Protein recommendations (1.2-2.0 g/kg for athletes)
    const minProtein = weight * 1.2
    const maxProtein = weight * 2.0
    
    if (averages.protein < minProtein) {
      recommendations.push({
        type: 'warning',
        message: `Proteína insuficiente. Recomendado: ${Math.round(minProtein)}-${Math.round(maxProtein)}g/día`,
        action: 'Incluir más carnes magras, huevos, lácteos o leguminosas'
      })
    }

    // Fiber recommendations
    if (averages.fiber < 25) {
      recommendations.push({
        type: 'info',
        message: 'Fibra por debajo del recomendado (25-35g/día)',
        action: 'Aumentar consumo de frutas, verduras y cereales integrales'
      })
    }

    // Consistency recommendations
    if (averages.daysTracked < 5) {
      recommendations.push({
        type: 'info',
        message: `Solo ${averages.daysTracked} días registrados esta semana`,
        action: 'Mantener un registro diario más consistente'
      })
    }

    return recommendations
  }

  const getDayName = (dateString: string) => {
    const date = new Date(dateString)
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    return days[date.getDay()]
  }

  const getMaxValue = (key: keyof Omit<WeeklyData, 'date'>) => {
    return Math.max(...weeklyData.map(day => day[key]))
  }

  const averages = getWeeklyAverages()
  const recommendations = getRecommendations()

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Reporte Semanal</h3>
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={0}>Esta semana</option>
          <option value={1}>Semana pasada</option>
          <option value={2}>Hace 2 semanas</option>
          <option value={3}>Hace 3 semanas</option>
        </select>
      </div>

      {averages ? (
        <div className="space-y-6">
          {/* Weekly Averages */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-blue-700 font-medium text-sm">Calorías</div>
              <div className="text-2xl font-bold text-blue-800">{averages.calories}</div>
              <div className="text-xs text-blue-600">kcal/día</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-green-700 font-medium text-sm">Proteínas</div>
              <div className="text-2xl font-bold text-green-800">{averages.protein}g</div>
              <div className="text-xs text-green-600">promedio</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-yellow-700 font-medium text-sm">Carbohidratos</div>
              <div className="text-2xl font-bold text-yellow-800">{averages.carbohydrates}g</div>
              <div className="text-xs text-yellow-600">promedio</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-orange-700 font-medium text-sm">Grasas</div>
              <div className="text-2xl font-bold text-orange-800">{averages.fats}g</div>
              <div className="text-xs text-orange-600">promedio</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-purple-700 font-medium text-sm">Fibra</div>
              <div className="text-2xl font-bold text-purple-800">{averages.fiber}g</div>
              <div className="text-xs text-purple-600">promedio</div>
            </div>
          </div>

          {/* Daily Chart */}
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-4">Progreso Diario</h4>
            <div className="space-y-4">
              {/* Calories Chart */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Calorías por día</span>
                  <span className="text-xs text-gray-500">Máximo: {getMaxValue('calories')} kcal</span>
                </div>
                <div className="flex items-end space-x-2 h-20">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                        style={{ 
                          height: `${day.calories > 0 ? (day.calories / getMaxValue('calories')) * 100 : 0}%`,
                          minHeight: day.calories > 0 ? '4px' : '0px'
                        }}
                        title={`${day.calories} kcal`}
                      ></div>
                      <span className="text-xs text-gray-600 mt-1">{getDayName(day.date)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protein Chart */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Proteínas por día</span>
                  <span className="text-xs text-gray-500">Máximo: {getMaxValue('protein')}g</span>
                </div>
                <div className="flex items-end space-x-2 h-16">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                        style={{ 
                          height: `${day.protein > 0 ? (day.protein / getMaxValue('protein')) * 100 : 0}%`,
                          minHeight: day.protein > 0 ? '4px' : '0px'
                        }}
                        title={`${Math.round(day.protein)}g`}
                      ></div>
                      <span className="text-xs text-gray-600 mt-1">{getDayName(day.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-4">Recomendaciones</h4>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className={`rounded-lg p-4 ${
                      rec.type === 'warning' 
                        ? 'bg-yellow-50 border-l-4 border-yellow-400' 
                        : 'bg-blue-50 border-l-4 border-blue-400'
                    }`}
                  >
                    <div className={`font-medium text-sm ${
                      rec.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                    }`}>
                      {rec.message}
                    </div>
                    <div className={`text-xs mt-1 ${
                      rec.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                    }`}>
                      💡 {rec.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tracking Consistency */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-semibold text-gray-700">Consistencia de Registro</h5>
                <p className="text-xs text-gray-600">Días registrados esta semana</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{averages.daysTracked}/7</div>
                <div className="text-xs text-gray-600">
                  {Math.round((averages.daysTracked / 7) * 100)}%
                </div>
              </div>
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(averages.daysTracked / 7) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg mb-2">📊</div>
          <p className="text-gray-600">No hay datos registrados para esta semana</p>
          <p className="text-sm text-gray-500 mt-1">
            Comienza a registrar alimentos para ver tu reporte semanal
          </p>
        </div>
      )}
    </div>
  )
}
