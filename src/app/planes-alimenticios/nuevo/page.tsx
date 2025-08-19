"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MealPlan, Athlete, FoodItem, Meal, FoodPortion } from '@/lib/types'
import { DataStorage } from '@/lib/storage'
import { generateId } from '@/lib/utils'
import { foodDatabase, getFoodsByCategory, calculateNutritionForPortion } from '@/data/foodDatabase'

export default function NuevoPlanAlimenticioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [selectedAthleteId, setSelectedAthleteId] = useState('')
  
  // Estado del formulario
  const [planName, setPlanName] = useState('')
  const [description, setDescription] = useState('')
  const [createdBy, setCreatedBy] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  // Objetivos nutricionales
  const [dailyCalories, setDailyCalories] = useState(2000)
  const [proteinPercentage, setProteinPercentage] = useState(20)
  const [carbsPercentage, setCarbsPercentage] = useState(55)
  const [fatsPercentage, setFatsPercentage] = useState(25)
  const [fiberGoal, setFiberGoal] = useState(25)
  const [hydrationGoal, setHydrationGoal] = useState(2.5)
  
  // Restricciones
  const [allergies, setAllergies] = useState<string[]>([])
  const [intolerances, setIntolerances] = useState<string[]>([])
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])
  const [medicalRestrictions, setMedicalRestrictions] = useState<string[]>([])
  
  // Plan semanal
  const [currentDay, setCurrentDay] = useState('monday')
  const [weeklyPlan, setWeeklyPlan] = useState<MealPlan['weeklyPlan']>({
    monday: { meals: [], notes: '' },
    tuesday: { meals: [], notes: '' },
    wednesday: { meals: [], notes: '' },
    thursday: { meals: [], notes: '' },
    friday: { meals: [], notes: '' },
    saturday: { meals: [], notes: '' },
    sunday: { meals: [], notes: '' }
  })
  
  // Modal para agregar comidas
  const [showMealModal, setShowMealModal] = useState(false)
  const [currentMeal, setCurrentMeal] = useState<Partial<Meal>>({
    name: '',
    type: 'desayuno',
    foods: [],
    scheduledTime: '08:00',
    instructions: ''
  })
  
  // Modal para agregar alimentos
  const [showFoodModal, setShowFoodModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<FoodItem['category']>('cereales')
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [foodQuantity, setFoodQuantity] = useState(100)

  useEffect(() => {
    const loadAthletes = () => {
      try {
        const loadedAthletes = DataStorage.getAthletes()
        setAthletes(loadedAthletes)
      } catch (error) {
        console.error('Error loading athletes:', error)
      }
    }

    loadAthletes()
    
    // Establecer fecha de inicio por defecto (hoy)
    const today = new Date().toISOString().split('T')[0]
    setStartDate(today)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedAthleteId || !planName || !createdBy) {
      alert('Por favor complete todos los campos obligatorios')
      return
    }

    if (proteinPercentage + carbsPercentage + fatsPercentage !== 100) {
      alert('Los porcentajes de macronutrientes deben sumar 100%')
      return
    }

    setLoading(true)

    try {
      const newMealPlan: MealPlan = {
        id: generateId(),
        athleteId: selectedAthleteId,
        name: planName,
        description: description || undefined,
        createdDate: new Date().toISOString(),
        startDate,
        endDate: endDate || undefined,
        status: 'active',
        createdBy,
        nutritionalGoals: {
          dailyCalories,
          proteinPercentage,
          carbsPercentage,
          fatsPercentage,
          fiberGoal,
          hydrationGoal
        },
        weeklyPlan,
        restrictions: {
          allergies,
          intolerances,
          dietaryPreferences,
          medicalRestrictions
        }
      }

      DataStorage.saveMealPlan(newMealPlan)
      alert('Plan alimenticio creado exitosamente')
      router.push(`/planes-alimenticios/${newMealPlan.id}`)
    } catch (error) {
      console.error('Error saving meal plan:', error)
      alert('Error al crear el plan alimenticio. Por favor intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const addMealToDay = () => {
    if (!currentMeal.name || !currentMeal.type) {
      alert('Por favor complete el nombre y tipo de comida')
      return
    }

    const newMeal: Meal = {
      id: generateId(),
      name: currentMeal.name!,
      type: currentMeal.type!,
      foods: currentMeal.foods || [],
      scheduledTime: currentMeal.scheduledTime || '08:00',
      instructions: currentMeal.instructions,
      nutritionalSummary: calculateMealNutrition(currentMeal.foods || [])
    }

    setWeeklyPlan(prev => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        meals: [...prev[currentDay].meals, newMeal]
      }
    }))

    // Reset modal
    setCurrentMeal({
      name: '',
      type: 'desayuno',
      foods: [],
      scheduledTime: '08:00',
      instructions: ''
    })
    setShowMealModal(false)
  }

  const addFoodToMeal = () => {
    if (!selectedFood) {
      alert('Por favor seleccione un alimento')
      return
    }

    const nutrition = calculateNutritionForPortion(selectedFood, foodQuantity)
    const portionDescription = `${foodQuantity}g`

    const newFoodPortion: FoodPortion = {
      foodId: selectedFood.id,
      quantity: foodQuantity,
      portionDescription
    }

    setCurrentMeal(prev => ({
      ...prev,
      foods: [...(prev.foods || []), newFoodPortion]
    }))

    setShowFoodModal(false)
    setSelectedFood(null)
    setFoodQuantity(100)
  }

  const calculateMealNutrition = (foods: FoodPortion[]) => {
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFats = 0
    let totalFiber = 0

    foods.forEach(foodPortion => {
      const food = foodDatabase.find(f => f.id === foodPortion.foodId)
      if (food) {
        const nutrition = calculateNutritionForPortion(food, foodPortion.quantity)
        totalCalories += nutrition.calories
        totalProtein += nutrition.protein
        totalCarbs += nutrition.carbohydrates
        totalFats += nutrition.fats
        totalFiber += nutrition.fiber
      }
    })

    return {
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein * 10) / 10,
      totalCarbs: Math.round(totalCarbs * 10) / 10,
      totalFats: Math.round(totalFats * 10) / 10,
      totalFiber: Math.round(totalFiber * 10) / 10
    }
  }

  const getDayName = (day: string) => {
    const days: Record<string, string> = {
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo'
    }
    return days[day] || day
  }

  const getMealTypeName = (type: Meal['type']) => {
    const types: Record<Meal['type'], string> = {
      'desayuno': 'Desayuno',
      'colacion-matutina': 'Colación Matutina',
      'almuerzo': 'Almuerzo',
      'colacion-vespertina': 'Colación Vespertina',
      'cena': 'Cena',
      'colacion-nocturna': 'Colación Nocturna'
    }
    return types[type]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/planes-alimenticios" 
                className="text-white hover:text-green-200 transition-colors flex items-center space-x-2"
              >
                <span className="text-xl">←</span>
                <span>Volver a Planes</span>
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Nuevo Plan Alimenticio</h1>
              <p className="text-green-100 text-sm">Crear plan nutricional personalizado</p>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información básica */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="athlete" className="block text-sm font-medium text-gray-700 mb-2">
                  Paciente *
                </label>
                <select
                  id="athlete"
                  value={selectedAthleteId}
                  onChange={(e) => setSelectedAthleteId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar paciente...</option>
                  {athletes.map(athlete => (
                    <option key={athlete.id} value={athlete.id}>
                      {athlete.fullName} - {athlete.age} años
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="planName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Plan *
                </label>
                <input
                  type="text"
                  id="planName"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: Plan Nutricional - Temporada Competitiva"
                  required
                />
              </div>

              <div>
                <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700 mb-2">
                  Creado por *
                </label>
                <input
                  type="text"
                  id="createdBy"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: Dr. Ana Nutricionista"
                  required
                />
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Descripción del plan alimenticio..."
                />
              </div>
            </div>
          </div>

          {/* Objetivos nutricionales */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Objetivos Nutricionales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="dailyCalories" className="block text-sm font-medium text-gray-700 mb-2">
                  Calorías Diarias (kcal)
                </label>
                <input
                  type="number"
                  id="dailyCalories"
                  value={dailyCalories}
                  onChange={(e) => setDailyCalories(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1000"
                  max="5000"
                />
              </div>

              <div>
                <label htmlFor="fiberGoal" className="block text-sm font-medium text-gray-700 mb-2">
                  Fibra Diaria (g)
                </label>
                <input
                  type="number"
                  id="fiberGoal"
                  value={fiberGoal}
                  onChange={(e) => setFiberGoal(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="10"
                  max="50"
                />
              </div>

              <div>
                <label htmlFor="hydrationGoal" className="block text-sm font-medium text-gray-700 mb-2">
                  Hidratación Diaria (L)
                </label>
                <input
                  type="number"
                  id="hydrationGoal"
                  value={hydrationGoal}
                  onChange={(e) => setHydrationGoal(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                  max="5"
                  step="0.1"
                />
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Distribución de Macronutrientes (%)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="proteinPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                    Proteínas
                  </label>
                  <input
                    type="number"
                    id="proteinPercentage"
                    value={proteinPercentage}
                    onChange={(e) => setProteinPercentage(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="10"
                    max="40"
                  />
                </div>

                <div>
                  <label htmlFor="carbsPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                    Carbohidratos
                  </label>
                  <input
                    type="number"
                    id="carbsPercentage"
                    value={carbsPercentage}
                    onChange={(e) => setCarbsPercentage(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="30"
                    max="70"
                  />
                </div>

                <div>
                  <label htmlFor="fatsPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                    Grasas
                  </label>
                  <input
                    type="number"
                    id="fatsPercentage"
                    value={fatsPercentage}
                    onChange={(e) => setFatsPercentage(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="15"
                    max="40"
                  />
                </div>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                Total: {proteinPercentage + carbsPercentage + fatsPercentage}% 
                {proteinPercentage + carbsPercentage + fatsPercentage !== 100 && (
                  <span className="text-red-600 ml-2">
                    (Debe sumar 100%)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Plan semanal */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Plan Semanal</h3>
              <button
                type="button"
                onClick={() => setShowMealModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Agregar Comida
              </button>
            </div>

            {/* Selector de día */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(weeklyPlan).map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setCurrentDay(day)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentDay === day
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getDayName(day)}
                </button>
              ))}
            </div>

            {/* Comidas del día actual */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">
                Comidas para {getDayName(currentDay)} ({weeklyPlan[currentDay].meals.length})
              </h4>
              
              {weeklyPlan[currentDay].meals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay comidas programadas para este día
                </div>
              ) : (
                <div className="space-y-3">
                  {weeklyPlan[currentDay].meals.map((meal, index) => (
                    <div key={meal.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h5 className="font-medium text-gray-900">{meal.name}</h5>
                            <span className="text-sm text-gray-500">
                              {getMealTypeName(meal.type)} - {meal.scheduledTime}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                            <div className="bg-blue-50 rounded p-2">
                              <span className="font-medium text-blue-800">Calorías:</span>
                              <p className="text-blue-600">{meal.nutritionalSummary.totalCalories} kcal</p>
                            </div>
                            <div className="bg-green-50 rounded p-2">
                              <span className="font-medium text-green-800">Proteínas:</span>
                              <p className="text-green-600">{meal.nutritionalSummary.totalProtein}g</p>
                            </div>
                            <div className="bg-yellow-50 rounded p-2">
                              <span className="font-medium text-yellow-800">Carbohidratos:</span>
                              <p className="text-yellow-600">{meal.nutritionalSummary.totalCarbs}g</p>
                            </div>
                            <div className="bg-purple-50 rounded p-2">
                              <span className="font-medium text-purple-800">Grasas:</span>
                              <p className="text-purple-600">{meal.nutritionalSummary.totalFats}g</p>
                            </div>
                            <div className="bg-orange-50 rounded p-2">
                              <span className="font-medium text-orange-800">Fibra:</span>
                              <p className="text-orange-600">{meal.nutritionalSummary.totalFiber}g</p>
                            </div>
                          </div>

                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700">Alimentos ({meal.foods.length}):</p>
                            <div className="mt-1 text-sm text-gray-600">
                              {meal.foods.map((foodPortion, foodIndex) => {
                                const food = foodDatabase.find(f => f.id === foodPortion.foodId)
                                return (
                                  <span key={foodIndex} className="inline-block mr-3">
                                    {food?.name} ({foodPortion.portionDescription})
                                  </span>
                                )
                              })}
                            </div>
                          </div>

                          {meal.instructions && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-700">Instrucciones:</p>
                              <p className="text-sm text-gray-600">{meal.instructions}</p>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setWeeklyPlan(prev => ({
                              ...prev,
                              [currentDay]: {
                                ...prev[currentDay],
                                meals: prev[currentDay].meals.filter((_, i) => i !== index)
                              }
                            }))
                          }}
                          className="text-red-600 hover:text-red-900 text-sm font-medium ml-4"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between">
            <Link
              href="/planes-alimenticios"
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </Link>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Creando...' : 'Crear Plan Alimenticio'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal para agregar comida */}
      {showMealModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Agregar Comida - {getDayName(currentDay)}</h3>
              <button
                onClick={() => setShowMealModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Comida *
                  </label>
                  <input
                    type="text"
                    value={currentMeal.name || ''}
                    onChange={(e) => setCurrentMeal(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ej: Desayuno Energético"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Comida *
                  </label>
                  <select
                    value={currentMeal.type || 'desayuno'}
                    onChange={(e) => setCurrentMeal(prev => ({ ...prev, type: e.target.value as Meal['type'] }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="desayuno">Desayuno</option>
                    <option value="colacion-matutina">Colación Matutina</option>
                    <option value="almuerzo">Almuerzo</option>
                    <option value="colacion-vespertina">Colación Vespertina</option>
                    <option value="cena">Cena</option>
                    <option value="colacion-nocturna">Colación Nocturna</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora Programada
                  </label>
                  <input
                    type="time"
                    value={currentMeal.scheduledTime || '08:00'}
                    onChange={(e) => setCurrentMeal(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alimentos ({(currentMeal.foods || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowFoodModal(true)}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors"
                  >
                    + Agregar Alimento
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instrucciones Especiales
                </label>
                <textarea
                  value={currentMeal.instructions || ''}
                  onChange={(e) => setCurrentMeal(prev => ({ ...prev, instructions: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Instrucciones de preparación o consumo..."
                />
              </div>

              {/* Lista de alimentos agregados */}
              {(currentMeal.foods || []).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Alimentos Agregados ({(currentMeal.foods || []).length})
                  </h4>
                  <div className="space-y-2">
                    {(currentMeal.foods || []).map((foodPortion, index) => {
                      const food = foodDatabase.find(f => f.id === foodPortion.foodId)
                      return (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2">
                          <span className="text-sm">
                            {food?.name} - {foodPortion.portionDescription}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentMeal(prev => ({
                                ...prev,
                                foods: (prev.foods || []).filter((_, i) => i !== index)
                              }))
                            }}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowMealModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={addMealToDay}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Agregar Comida
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar alimentos */}
      {showFoodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Seleccionar Alimento</h3>
              <button
                onClick={() => setShowFoodModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Selector de categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría de Alimento
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as FoodItem['category'])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="cereales">Cereales y Tubérculos</option>
                  <option value="proteinas">Proteínas</option>
                  <option value="lacteos">Lácteos</option>
                  <option value="frutas">Frutas</option>
                  <option value="verduras">Verduras</option>
                  <option value="grasas">Grasas Saludables</option>
                  <option value="leguminosas">Leguminosas</option>
                  <option value="bebidas">Bebidas</option>
                </select>

                {/* Lista de alimentos */}
                <div className="mt-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                  {getFoodsByCategory(selectedCategory).map(food => (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => setSelectedFood(food)}
                      className={`w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                        selectedFood?.id === food.id ? 'bg-green-50 border-green-200' : ''
                      }`}
                    >
                      <div className="font-medium text-gray-900">{food.name}</div>
                      <div className="text-sm text-gray-600">
                        {food.calories} kcal/100g - P: {food.macronutrients.protein}g, C: {food.macronutrients.carbohydrates}g, G: {food.macronutrients.fats}g
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Información del alimento seleccionado */}
              <div>
                {selectedFood ? (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">{selectedFood.name}</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cantidad (gramos)
                        </label>
                        <input
                          type="number"
                          value={foodQuantity}
                          onChange={(e) => setFoodQuantity(Number(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          min="1"
                          max="1000"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                          Porción estándar: {selectedFood.portionSize.standard}g ({selectedFood.portionSize.description})
                        </p>
                      </div>

                      {/* Información nutricional calculada */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3">Información Nutricional ({foodQuantity}g)</h5>
                        {(() => {
                          const nutrition = calculateNutritionForPortion(selectedFood, foodQuantity)
                          return (
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="font-medium">Calorías:</span> {nutrition.calories} kcal
                              </div>
                              <div>
                                <span className="font-medium">Proteínas:</span> {nutrition.protein}g
                              </div>
                              <div>
                                <span className="font-medium">Carbohidratos:</span> {nutrition.carbohydrates}g
                              </div>
                              <div>
                                <span className="font-medium">Grasas:</span> {nutrition.fats}g
                              </div>
                              <div>
                                <span className="font-medium">Fibra:</span> {nutrition.fiber}g
                              </div>
                              <div>
                                <span className="font-medium">Sodio:</span> {nutrition.sodium}mg
                              </div>
                            </div>
                          )
                        })()}
                      </div>

                      {selectedFood.allergens.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-yellow-800">Alergenos:</p>
                          <p className="text-sm text-yellow-700">{selectedFood.allergens.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Seleccione un alimento de la lista para ver su información nutricional
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowFoodModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={addFoodToMeal}
                disabled={!selectedFood}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                Agregar Alimento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
