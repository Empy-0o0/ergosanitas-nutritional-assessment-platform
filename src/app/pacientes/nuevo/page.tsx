"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Athlete } from '@/lib/types'
import { DataStorage } from '@/lib/storage'
import { generateId } from '@/lib/utils'

export default function NuevoPacientePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    gender: '',
    club: '',
    position: '',
    height: '',
    weight: '',
    bodyFatPercentage: '',
    hemoglobin: '',
    iron: '',
    vitaminD: '',
    systolicBP: '',
    diastolicBP: '',
    heartRate: '',
    dailyCalories: '',
    dailyProtein: '',
    dailyWater: '',
    mealsPerDay: '3',
    foodLikes: '',
    foodDislikes: '',
    allergies: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const calculateBMI = (height: number, weight: number) => {
    return parseFloat((weight / ((height / 100) ** 2)).toFixed(1))
  }

  const determineCategory = (age: number): '5-8' | '9-13' | '14-18' => {
    if (age >= 5 && age <= 8) return '5-8'
    if (age >= 9 && age <= 13) return '9-13'
    return '14-18'
  }

  const determineNutritionalStatus = (bmi: number, age: number) => {
    if (age < 18) {
      if (bmi < 16) return 'danger'
      if (bmi < 18.5) return 'warning'
      if (bmi > 25) return 'warning'
      return 'normal'
    } else {
      if (bmi < 18.5) return 'danger'
      if (bmi > 25) return 'warning'
      return 'normal'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const age = calculateAge(formData.birthDate)
      const height = parseFloat(formData.height)
      const weight = parseFloat(formData.weight)
      const bmi = calculateBMI(height, weight)
      const category = determineCategory(age)
      const nutritionalStatus = determineNutritionalStatus(bmi, age)

      const newAthlete: Athlete = {
        id: generateId(),
        fullName: formData.fullName,
        birthDate: formData.birthDate,
        age,
        gender: formData.gender as 'male' | 'female',
        club: formData.club,
        position: formData.position,
        category,
        evaluationDate: new Date().toISOString().split('T')[0],
        nutritionalStatus,
        lastEvaluation: new Date().toISOString().split('T')[0],
        
        anthropometry: {
          height,
          weight,
          bmi,
          bodyFatPercentage: parseFloat(formData.bodyFatPercentage) || 0,
          muscleMass: 0,
          waistCircumference: 0,
          hipCircumference: 0,
          armCircumference: 0,
          skinfoldMeasurements: {
            triceps: 0,
            biceps: 0,
            subscapular: 0,
            suprailiac: 0
          },
          percentiles: {
            heightPercentile: 50,
            weightPercentile: 50,
            bmiPercentile: 50
          }
        },

        biochemistry: {
          hemoglobin: parseFloat(formData.hemoglobin) || 0,
          hematocrit: 0,
          iron: parseFloat(formData.iron) || 0,
          ferritin: 0,
          vitaminD: parseFloat(formData.vitaminD) || 0,
          vitaminB12: 0,
          folate: 0,
          glucose: 0,
          cholesterol: {
            total: 0,
            hdl: 0,
            ldl: 0,
            triglycerides: 0
          },
          proteins: {
            totalProtein: 0,
            albumin: 0,
            prealbumin: 0
          },
          electrolytes: {
            sodium: 0,
            potassium: 0,
            calcium: 0,
            magnesium: 0
          },
          lastTestDate: new Date().toISOString().split('T')[0]
        },

        clinical: {
          vitalSigns: {
            bloodPressure: {
              systolic: parseFloat(formData.systolicBP) || 0,
              diastolic: parseFloat(formData.diastolicBP) || 0
            },
            heartRate: parseFloat(formData.heartRate) || 0,
            respiratoryRate: 0,
            temperature: 36.5
          },
          physicalExamination: {
            generalAppearance: 'normal',
            skinCondition: 'normal',
            oralHealth: 'normal',
            lymphNodes: 'normal',
            edema: false,
            dehydrationSigns: false
          },
          functionalAssessment: {
            energyLevel: 'normal',
            sleepQuality: 'good',
            digestiveSymptoms: [],
            appetiteLevel: 'good',
            fatigueLevel: 'none'
          },
          medicalHistory: {
            allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : [],
            medications: [],
            chronicConditions: [],
            injuries: []
          },
          performanceMetrics: {
            vo2Max: 0,
            strength: 0,
            endurance: 0,
            flexibility: 0,
            speed: 0
          }
        },

        dietetics: {
          dailyIntake: {
            calories: parseFloat(formData.dailyCalories) || 0,
            protein: parseFloat(formData.dailyProtein) || 0,
            carbohydrates: 0,
            fats: 0,
            fiber: 0,
            water: parseFloat(formData.dailyWater) || 0
          },
          mealPattern: {
            mealsPerDay: parseInt(formData.mealsPerDay) || 3,
            breakfastTime: '07:00',
            lunchTime: '12:00',
            dinnerTime: '19:00',
            snacks: 0
          },
          foodPreferences: {
            likes: formData.foodLikes ? formData.foodLikes.split(',').map(s => s.trim()) : [],
            dislikes: formData.foodDislikes ? formData.foodDislikes.split(',').map(s => s.trim()) : [],
            restrictions: [],
            culturalPreferences: []
          },
          supplementation: {
            vitamins: [],
            minerals: [],
            proteins: [],
            other: []
          },
          hydrationHabits: {
            waterIntake: parseFloat(formData.dailyWater) || 0,
            sportsdrinks: false,
            caffeineIntake: 0
          },
          eatingBehavior: {
            eatingSpeed: 'normal',
            portionSizes: 'normal',
            emotionalEating: false,
            socialEating: false
          },
          nutritionalKnowledge: {
            level: 'basic',
            areas: []
          }
        }
      }

      // Guardar el nuevo atleta
      DataStorage.saveAthlete(newAthlete)

      // Redirigir al dashboard con mensaje de éxito
      router.push('/dashboard/nutricionista?success=nuevo-paciente')
      
    } catch (error) {
      console.error('Error al guardar el paciente:', error)
      alert('Error al guardar el paciente. Por favor, intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!session || session.user.role !== 'nutricionista') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Acceso no autorizado</p>
          <Link href="/login" className="text-blue-600 hover:underline">
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/nutricionista"
                className="text-white hover:text-blue-200 transition-colors"
              >
                ← Volver al Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Nuevo Paciente</h1>
                <p className="text-blue-100">Registro completo de deportista</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-medium">{session.user.name}</p>
              <p className="text-blue-200 text-sm">Nutricionista</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Información Personal */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              📋 Información Personal del Atleta
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Juan Pérez García"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar género</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Club/Institución *
                </label>
                <input
                  type="text"
                  name="club"
                  value={formData.club}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Club Deportivo Juvenil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posición/Especialidad *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Mediocampista, Velocista, etc."
                />
              </div>
            </div>
          </div>

          {/* Datos Antropométricos */}
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-6">
              📏 A: Evaluación Antropométrica
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (cm) *
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  required
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 175.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  required
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 70.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grasa Corporal (%)
                </label>
                <input
                  type="number"
                  name="bodyFatPercentage"
                  value={formData.bodyFatPercentage}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 15.2"
                />
              </div>
            </div>
          </div>

          {/* Datos Bioquímicos */}
          <div>
            <h2 className="text-xl font-semibold text-green-700 mb-6">
              🧪 B: Evaluación Bioquímica
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hemoglobina (g/dL)
                </label>
                <input
                  type="number"
                  name="hemoglobin"
                  value={formData.hemoglobin}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 13.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hierro (μg/dL)
                </label>
                <input
                  type="number"
                  name="iron"
                  value={formData.iron}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 95.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vitamina D (ng/mL)
                </label>
                <input
                  type="number"
                  name="vitaminD"
                  value={formData.vitaminD}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 32.0"
                />
              </div>
            </div>
          </div>

          {/* Datos Clínicos */}
          <div>
            <h2 className="text-xl font-semibold text-orange-700 mb-6">
              🩺 C: Evaluación Clínica
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presión Sistólica (mmHg)
                </label>
                <input
                  type="number"
                  name="systolicBP"
                  value={formData.systolicBP}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 110"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presión Diastólica (mmHg)
                </label>
                <input
                  type="number"
                  name="diastolicBP"
                  value={formData.diastolicBP}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 70"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frecuencia Cardíaca (bpm)
                </label>
                <input
                  type="number"
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 75"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alergias (separadas por comas)
              </label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Polen, Mariscos, Nueces"
              />
            </div>
          </div>

          {/* Datos Dietéticos */}
          <div>
            <h2 className="text-xl font-semibold text-purple-700 mb-6">
              🍽️ D: Evaluación Dietética
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calorías Diarias (kcal)
                </label>
                <input
                  type="number"
                  name="dailyCalories"
                  value={formData.dailyCalories}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 2400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proteínas Diarias (g)
                </label>
                <input
                  type="number"
                  name="dailyProtein"
                  value={formData.dailyProtein}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 95.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agua Diaria (L)
                </label>
                <input
                  type="number"
                  name="dailyWater"
                  value={formData.dailyWater}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 2.8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comidas por Día
                </label>
                <select
                  name="mealsPerDay"
                  value={formData.mealsPerDay}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="2">2 comidas</option>
                  <option value="3">3 comidas</option>
                  <option value="4">4 comidas</option>
                  <option value="5">5 comidas</option>
                  <option value="6">6 comidas</option>
                </select>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Preferencias Alimentarias
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alimentos que le gustan (separados por comas)
                  </label>
                  <textarea
                    name="foodLikes"
                    value={formData.foodLikes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Pollo, Arroz, Frutas, Verduras"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alimentos que no le gustan (separados por comas)
                  </label>
                  <textarea
                    name="foodDislikes"
                    value={formData.foodDislikes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Pescado, Brócoli, Espinacas"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botón de envío */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? 'Guardando...' : '✅ Guardar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
