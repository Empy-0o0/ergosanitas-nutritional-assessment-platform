"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Athlete, ABCDEvaluation } from '@/lib/types'
import { DataStorage } from '@/lib/storage'
import { formatDate } from '@/lib/utils'

export default function PatientDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [athleteData, setAthleteData] = useState<Athlete | null>(null)
  const [evaluations, setEvaluations] = useState<ABCDEvaluation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login")
      return
    }

    if (session.user.role !== "patient") {
      // Si no es paciente, redirigir según su rol
      router.push(`/dashboard/${session.user.role}`)
      return
    }

    // Cargar datos del atleta
    if (session.user.athleteId) {
      const athletes = DataStorage.getAthletes()
      const athlete = athletes.find(a => a.id === session.user.athleteId)
      
      if (athlete) {
        setAthleteData(athlete)
        
        // Cargar evaluaciones del atleta
        const allEvaluations = DataStorage.getEvaluations()
        const athleteEvaluations = allEvaluations.filter(e => e.athleteId === athlete.id)
        setEvaluations(athleteEvaluations)
      }
    }
    
    setLoading(false)
  }, [session, status, router])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tu perfil...</p>
        </div>
      </div>
    )
  }

  if (!athleteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Error: No se pudieron cargar tus datos</p>
          <button 
            onClick={() => router.push("/login")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Volver al login
          </button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'danger': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return 'Normal'
      case 'warning': return 'Atención'
      case 'danger': return 'Crítico'
      default: return 'Sin evaluar'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del paciente */}
      <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-xl">
                  {athleteData.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  ¡Hola, {athleteData.fullName}!
                </h1>
                <p className="text-green-100">
                  {athleteData.club} • {athleteData.position} • {athleteData.age} años
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(athleteData.nutritionalStatus)}`}>
                Estado: {getStatusText(athleteData.nutritionalStatus)}
              </div>
              <Link
                href="/login"
                onClick={() => {
                  // Aquí iría la lógica de logout
                }}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Cerrar Sesión
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Panel Principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Resumen de Estado Nutricional */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tu Estado Nutricional</h2>
              
              {athleteData.anthropometry && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{athleteData.anthropometry.height}</div>
                    <div className="text-sm text-gray-600">Altura (cm)</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{athleteData.anthropometry.weight}</div>
                    <div className="text-sm text-gray-600">Peso (kg)</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{athleteData.anthropometry.bmi}</div>
                    <div className="text-sm text-gray-600">IMC</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {athleteData.anthropometry.bodyFatPercentage || 'N/A'}%
                    </div>
                    <div className="text-sm text-gray-600">Grasa Corporal</div>
                  </div>
                </div>
              )}

              {/* Gráfico de Progreso Simulado */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Progreso de Peso (últimos 6 meses)</h3>
                <div className="h-32 bg-white rounded border flex items-end justify-around p-4">
                  {/* Simulación de barras de progreso */}
                  <div className="bg-blue-500 w-8 rounded-t" style={{height: '60%'}}></div>
                  <div className="bg-blue-500 w-8 rounded-t" style={{height: '65%'}}></div>
                  <div className="bg-blue-500 w-8 rounded-t" style={{height: '70%'}}></div>
                  <div className="bg-blue-500 w-8 rounded-t" style={{height: '75%'}}></div>
                  <div className="bg-blue-500 w-8 rounded-t" style={{height: '80%'}}></div>
                  <div className="bg-green-500 w-8 rounded-t" style={{height: '85%'}}></div>
                </div>
                <div className="flex justify-around text-xs text-gray-500 mt-2">
                  <span>Jul</span>
                  <span>Ago</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dic</span>
                </div>
              </div>
            </div>

            {/* Plan Alimenticio */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tu Plan Alimenticio de Hoy</h2>
              
              {athleteData.dietetics && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-yellow-800">Desayuno</h3>
                      <p className="text-sm text-yellow-600">{athleteData.dietetics.mealPattern.breakfastTime}</p>
                      <div className="mt-2 text-sm">
                        <p>• Avena con frutas</p>
                        <p>• Yogur natural</p>
                        <p>• Jugo de naranja</p>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-orange-800">Almuerzo</h3>
                      <p className="text-sm text-orange-600">{athleteData.dietetics.mealPattern.lunchTime}</p>
                      <div className="mt-2 text-sm">
                        <p>• Pollo a la plancha</p>
                        <p>• Arroz integral</p>
                        <p>• Ensalada mixta</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800">Cena</h3>
                      <p className="text-sm text-blue-600">{athleteData.dietetics.mealPattern.dinnerTime}</p>
                      <div className="mt-2 text-sm">
                        <p>• Pescado al horno</p>
                        <p>• Verduras al vapor</p>
                        <p>• Fruta de temporada</p>
                      </div>
                    </div>
                  </div>

                  {/* Objetivos Nutricionales */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">Objetivos Diarios</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Calorías:</span>
                        <div className="font-semibold">{athleteData.dietetics.dailyIntake.calories} kcal</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Proteínas:</span>
                        <div className="font-semibold">{athleteData.dietetics.dailyIntake.protein}g</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Carbohidratos:</span>
                        <div className="font-semibold">{athleteData.dietetics.dailyIntake.carbohydrates}g</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Agua:</span>
                        <div className="font-semibold">{athleteData.dietetics.dailyIntake.water}L</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Información Personal */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Mi Información</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Edad:</span>
                  <span className="ml-2 font-medium">{athleteData.age} años</span>
                </div>
                <div>
                  <span className="text-gray-600">Categoría:</span>
                  <span className="ml-2 font-medium">{athleteData.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Club:</span>
                  <span className="ml-2 font-medium">{athleteData.club}</span>
                </div>
                <div>
                  <span className="text-gray-600">Posición:</span>
                  <span className="ml-2 font-medium">{athleteData.position}</span>
                </div>
                <div>
                  <span className="text-gray-600">Última evaluación:</span>
                  <span className="ml-2 font-medium">{formatDate(athleteData.lastEvaluation)}</span>
                </div>
              </div>
            </div>

            {/* Próximas Citas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Próximas Citas</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-800">Evaluación Nutricional</div>
                  <div className="text-sm text-blue-600">15 Enero 2024 - 10:00 AM</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800">Seguimiento Mensual</div>
                  <div className="text-sm text-green-600">22 Enero 2024 - 2:00 PM</div>
                </div>
              </div>
            </div>

            {/* Consejos del Día */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Consejo del Día</h3>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  💧 Recuerda mantener una hidratación constante durante tus entrenamientos. 
                  Bebe agua antes, durante y después del ejercicio.
                </p>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  Registrar Comida
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  Ver Mi Progreso
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  Contactar Nutricionista
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
