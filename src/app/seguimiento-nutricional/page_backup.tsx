"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FoodItem, Athlete, DailyTracking } from '@/lib/types'
import { foodDatabase, searchFoods, calculateNutritionForPortion, getFoodsByCategory } from '@/data/foodDatabase'
import { DataStorage } from '@/lib/storage'
import { formatDate } from '@/lib/utils'
import FoodAnalysisChart from '@/components/nutrition/FoodAnalysisChart'
import WeeklyNutritionReport from '@/components/nutrition/WeeklyNutritionReport'

interface FoodEntry {
  id: string
  foodId: string
  quantity: number
  mealType: 'desayuno' | 'colacion-matutina' | 'almuerzo' | 'colacion-vespertina' | 'cena' | 'colacion-nocturna'
  timestamp: string
}

interface DailyNutrition {
  calories: number
  protein: number
  carbohydrates: number
  fats: number
  fiber: number
  sodium: number
  sugar: number
}

export default function NutritionTracking() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedAthlete, setSelectedAthlete] = useState<string>('')
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FoodItem[]>([])
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [quantity, setQuantity] = useState('')
  const [selectedMeal, setSelectedMeal] = useState<FoodEntry['mealType']>('desayuno')
  const [showAddFood, setShowAddFood] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showWeeklyReport, setShowWeeklyReport] = useState(false)
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition>({
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fats: 0,
    fiber: 0,
    sodium: 0,
    sugar: 0
  })

  const mealTypes = [
    { value: 'desayuno', label: 'Desayuno', icon: '🌅' },
    { value: 'colacion-matutina', label: 'Colación Matutina', icon: '☕' },
    { value: 'almuerzo', label: 'Almuerzo', icon: '🍽️' },
    { value: 'colacion-vespertina', label: 'Colación Vespertina', icon: '🥤' },
    { value: 'cena', label: 'Cena', icon: '🌙' },
    { value: 'colacion-nocturna', label: 'Colación Nocturna', icon: '🌃' }
  ]

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'cereales', label: 'Cereales' },
    { value: 'proteinas', label: 'Proteínas' },
    { value: 'lacteos', label: 'Lácteos' },
    { value: 'frutas', label: 'Frutas' },
    { value: 'verduras', label: 'Verduras' },
    { value: 'grasas', label: 'Grasas' },
    { value: 'leguminosas', label: 'Leguminosas' },
    { value: 'bebidas', label: 'Bebidas' }
  ]

  useEffect(() => {
    setAthletes(DataStorage.getAthletes())
    loadFoodEntries()
  }, [selectedDate, selectedAthlete])

  useEffect(() => {
    if (searchQuery.length > 2) {
      const results = searchFoods(searchQuery)
      const filteredResults = selectedCategory === 'all' 
        ? results 
        : results.filter(food => food.category === selectedCategory)
      setSearchResults(filteredResults.slice(0, 10))
    } else if (selectedCategory !== 'all') {
      setSearchResults(getFoodsByCategory(selectedCategory as any).slice(0, 10))
    } else {
      setSearchResults([])
    }
  }, [searchQuery, selectedCategory])

  useEffect(() => {
    calculateDailyNutrition()
  }, [foodEntries])

  const loadFoodEntries = () => {
    const storageKey = `nutrition_${selectedAthlete}_${selectedDate}`
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      setFoodEntries(JSON.parse(stored))
    } else {
      setFoodEntries([])
    }
  }

  const saveFoodEntries = (entries: FoodEntry[]) => {
    const storageKey = `nutrition_${selectedAthlete}_${selectedDate}`
    localStorage.setItem(storageKey, JSON.stringify(entries))
    setFoodEntries(entries)
  }

  const calculateDailyNutrition = () => {
    let totals: DailyNutrition = {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fats: 0,
      fiber: 0,
      sodium: 0,
      sugar: 0
    }

    foodEntries.forEach(entry => {
      const food = foodDatabase.find(f => f.id === entry.foodId)
      if (food) {
        const nutrition = calculateNutritionForPortion(food, entry.quantity)
        totals.calories += nutrition.calories
        totals.protein += nutrition.protein
        totals.carbohydrates += nutrition.carbohydrates
        totals.fats += nutrition.fats
        totals.fiber += nutrition.fiber
        totals.sodium += nutrition.sodium
        totals.sugar += nutrition.sugar
      }
    })

    setDailyNutrition(totals)
  }

  const addFoodEntry = () => {
    if (!selectedFood || !quantity || !selectedAthlete) return

    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      foodId: selectedFood.id,
      quantity: parseFloat(quantity),
      mealType: selectedMeal,
      timestamp: new Date().toISOString()
    }

    const updatedEntries = [...foodEntries, newEntry]
    saveFoodEntries(updatedEntries)
    
    // Reset form
    setSelectedFood(null)
    setQuantity('')
    setSearchQuery('')
    setShowAddFood(false)
  }

  const removeFoodEntry = (entryId: string) => {
    const updatedEntries = foodEntries.filter(entry => entry.id !== entryId)
    saveFoodEntries(updatedEntries)
  }

  const getFoodEntriesByMeal = (mealType: FoodEntry['mealType']) => {
    return foodEntries.filter(entry => entry.mealType === mealType)
  }

  const getMealNutrition = (mealType: FoodEntry['mealType']) => {
    const mealEntries = getFoodEntriesByMeal(mealType)
    let mealTotals = { calories: 0, protein: 0, carbohydrates: 0, fats: 0 }

    mealEntries.forEach(entry => {
      const food = foodDatabase.find(f => f.id === entry.foodId)
      if (food) {
        const nutrition = calculateNutritionForPortion(food, entry.quantity)
        mealTotals.calories += nutrition.calories
        mealTotals.protein += nutrition.protein
        mealTotals.carbohydrates += nutrition.carbohydrates
        mealTotals.fats += nutrition.fats
      }
    })

    return mealTotals
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">♥</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-montserrat">
                    Ergo<span className="text-green-400">Sanitas</span>
                  </h1>
                  <p className="text-blue-100 text-sm">Seguimiento Nutricional</p>
                </div>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="hover:text-blue-200 transition-colors font-medium px-3 py-2 rounded hover:bg-white hover:bg-opacity-15">
                Inicio
              </Link>
              <Link href="/pacientes" className="hover:text-blue-200 transition-colors font-medium px-3 py-2 rounded hover:bg-white hover:bg-opacity-15">
                Pacientes
              </Link>
              <Link href="/planes-alimenticios" className="hover:text-blue-200 transition-colors font-medium px-3 py-2 rounded hover:bg-white hover:bg-opacity-15">
                Planes
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Atleta</label>
                <select
                  value={selectedAthlete}
                  onChange={(e) => setSelectedAthlete(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar atleta</option>
                  {athletes.map(athlete => (
                    <option key={athlete.id} value={athlete.id}>
                      {athlete.fullName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowWeeklyReport(!showWeeklyReport)}
                disabled={!selectedAthlete}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <span>📊</span>
                <span>{showWeeklyReport ? 'Ocultar' : 'Ver'} Reporte</span>
              </button>
              <button
                onClick={() => setShowAddFood(true)}
                disabled={!selectedAthlete}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Agregar Alimento</span>
              </button>
            </div>
          </div>
        {selectedAthlete && (
          <div className="space-y-8">
            {/* Weekly Report */}
            {showWeeklyReport && (
              <WeeklyNutritionReport 
                athleteId={selectedAthlete} 
                athlete={athletes.find(a => a.id === selectedAthlete)!}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Daily Summary with Enhanced Analysis */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen Diario</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">Calorías</span>
                        <span className="text-2xl font-bold text-blue-800">{Math.round(dailyNutrition.calories)}</span>
                      </div>
                      <div className="text-sm text-blue-600">kcal</div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="text-green-700 font-medium text-sm">Proteínas</div>
                        <div className="text-lg font-bold text-green-800">{Math.round(dailyNutrition.protein)}g</div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-3 text-center">
                        <div className="text-yellow-700 font-medium text-sm">Carbohidratos</div>
                        <div className="text-lg font-bold text-yellow-800">{Math.round(dailyNutrition.carbohydrates)}g</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3 text-center">
                        <div className="text-orange-700 font-medium text-sm">Grasas</div>
                        <div className="text-lg font-bold text-orange-800">{Math.round(dailyNutrition.fats)}g</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <div className="text-purple-700 font-medium text-sm">Fibra</div>
                        <div className="text-lg font-bold text-purple-800">{Math.round(dailyNutrition.fiber)}g</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 text-center">
                        <div className="text-red-700 font-medium text-sm">Sodio</div>
                        <div className="text-lg font-bold text-red-800">{Math.round(dailyNutrition.sodium)}mg</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Food Analysis */}
                <FoodAnalysisChart 
                  dailyNutrition={dailyNutrition}
                  goals={{
                    calories: (athletes.find(a => a.id === selectedAthlete)?.anthropometry?.weight || 70) * 35,
                    protein: (athletes.find(a => a.id === selectedAthlete)?.anthropometry?.weight || 70) * 1.6,
                    carbohydrates: ((athletes.find(a => a.id === selectedAthlete)?.anthropometry?.weight || 70) * 35 * 0.55) / 4,
                    fats: ((athletes.find(a => a.id === selectedAthlete)?.anthropometry?.weight || 70) * 35 * 0.25) / 9
                  }}
                />
              </div>

            {/* Meals */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {mealTypes.map(meal => {
                  const mealEntries = getFoodEntriesByMeal(meal.value as FoodEntry['mealType'])
                  const mealNutrition = getMealNutrition(meal.value as FoodEntry['mealType'])
                  
                  return (
                    <div key={meal.value} className="bg-white rounded-lg shadow-sm">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{meal.icon}</span>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{meal.label}</h3>
                              <p className="text-sm text-gray-500">
                                {mealNutrition.calories} kcal • {Math.round(mealNutrition.protein)}g proteína
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedMeal(meal.value as FoodEntry['mealType'])
                              setShowAddFood(true)
                            }}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            + Agregar
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        {mealEntries.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No hay alimentos registrados</p>
                        ) : (
                          <div className="space-y-3">
                            {mealEntries.map(entry => {
                              const food = foodDatabase.find(f => f.id === entry.foodId)
                              if (!food) return null
                              
                              const nutrition = calculateNutritionForPortion(food, entry.quantity)
                              
                              return (
                                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium text-gray-900">{food.name}</h4>
                                      <button
                                        onClick={() => removeFoodEntry(entry.id)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                      <span>{entry.quantity}g</span>
                                      <span>{nutrition.calories} kcal</span>
                                      <span>{nutrition.protein}g proteína</span>
                                      <span>{nutrition.carbohydrates}g carbohidratos</span>
                                      <span>{nutrition.fats}g grasas</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Add Food Modal */}
        {showAddFood && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Agregar Alimento</h3>
                  <button
                    onClick={() => setShowAddFood(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Meal Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comida</label>
                  <select
                    value={selectedMeal}
                    onChange={(e) => setSelectedMeal(e.target.value as FoodEntry['mealType'])}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {mealTypes.map(meal => (
                      <option key={meal.value} value={meal.value}>
                        {meal.icon} {meal.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Food Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Alimento</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Escriba el nombre del alimento..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                    {searchResults.map(food => (
                      <button
                        key={food.id}
                        onClick={() => setSelectedFood(food)}
                        className={`w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                          selectedFood?.id === food.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                      >
                        <div className="font-medium text-gray-900">{food.name}</div>
                        <div className="text-sm text-gray-600">
                          {food.calories} kcal/100g • {food.macronutrients.protein}g proteína
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected Food Details */}
                {selectedFood && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">{selectedFood.name}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Calorías:</span> {selectedFood.calories} kcal/100g
                      </div>
                      <div>
                        <span className="text-blue-700">Proteínas:</span> {selectedFood.macronutrients.protein}g/100g
                      </div>
                      <div>
                        <span className="text-blue-700">Carbohidratos:</span> {selectedFood.macronutrients.carbohydrates}g/100g
                      </div>
                      <div>
                        <span className="text-blue-700">Grasas:</span> {selectedFood.macronutrients.fats}g/100g
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-blue-700 text-sm">Porción estándar:</span> {selectedFood.portionSize.description} ({selectedFood.portionSize.standard}g)
                    </div>
                  </div>
                )}

                {/* Quantity Input */}
                {selectedFood && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad (gramos)</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Cantidad en gramos"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => setQuantity(selectedFood.portionSize.standard.toString())}
                        className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium"
                      >
                        Porción estándar
                      </button>
                    </div>
                    
                    {quantity && (
                      <div className="mt-2 p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-800">
                          <strong>Información nutricional para {quantity}g:</strong>
                        </div>
                        {(() => {
                          const nutrition = calculateNutritionForPortion(selectedFood, parseFloat(quantity) || 0)
                          return (
                            <div className="grid grid-cols-2 gap-2 mt-1 text-sm text-green-700">
                              <div>Calorías: {nutrition.calories} kcal</div>
                              <div>Proteínas: {nutrition.protein}g</div>
                              <div>Carbohidratos: {nutrition.carbohydrates}g</div>
                              <div>Grasas: {nutrition.fats}g</div>
                            </div>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddFood(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={addFoodEntry}
                  disabled={!selectedFood || !quantity}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                >
                  Agregar Alimento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
