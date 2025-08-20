"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Athlete, ABCDEvaluation, NutritionalAlert } from '@/lib/types'
import { DataStorage } from '@/lib/storage'
import { formatDate } from '@/lib/utils'

export default function NutricionistaDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [evaluations, setEvaluations] = useState<ABCDEvaluation[]>([])
  const [alerts, setAlerts] = useState<NutritionalAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login")
      return
    }

    if (session.user.role !== "nutricionista") {
      // Si no es nutricionista, redirigir según su rol
      router.push(`/dashboard/${session.user.role}`)
      return
    }

    // Cargar datos
    setAthletes(DataStorage.getAthletes())
    setEvaluations(DataStorage.getEvaluations())
    setAlerts(DataStorage.getActiveAlerts())
    setLoading(false)
  }, [session, status, router])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Estadísticas generales
  const stats = {
    totalPacientes: athletes.length,
    pacientesNormales: athletes.filter(a => a.nutritionalStatus === 'normal').length,
    pacientesAtencion: athletes.filter(a => a.nutritionalStatus === 'warning').length,
    pacientesCriticos: athletes.filter(a => a.nutritionalStatus === 'danger').length,
    alertasActivas: alerts.length,
    evaluacionesRecientes: evaluations.filter(e => {
      const evalDate = new Date(e.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return evalDate >= weekAgo
    }).length
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
      {/* Header del Nutricionista */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">
                  {session.user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Dashboard Nutricionista
                </h1>
                <p className="text-blue-100">
                  Bienvenido, {session.user.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{session.user.name}</p>
                <p className="text-blue-200 text-sm capitalize">{session.user.role}</p>
              </div>
              <Link
                href="/login"
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Cerrar Sesión
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navegación de pestañas */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Resumen General', icon: '📊' },
              { id: 'patients', name: 'Gestión de Pacientes', icon: '👥' },
              { id: 'evaluations', name: 'Evaluaciones ABCD', icon: '🩺' },
              { id: 'nutrition', name: 'Planes Alimenticios', icon: '🍽️' },
              { id: 'tracking', name: 'Seguimiento', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Resumen General */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Pacientes
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalPacientes}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Estado Normal
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.pacientesNormales}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">⚠</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Requieren Atención
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.pacientesAtencion}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">🚨</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Estado Crítico
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.pacientesCriticos}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico de distribución de estados nutricionales */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Distribución de Estados Nutricionales
              </h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-around p-4">
                <div className="flex flex-col items-center">
                  <div 
                    className="bg-green-500 w-16 rounded-t"
                    style={{height: `${stats.totalPacientes > 0 ? (stats.pacientesNormales / stats.totalPacientes) * 200 : 0}px`}}
                  ></div>
                  <span className="text-sm text-gray-600 mt-2">Normal</span>
                  <span className="text-xs text-gray-500">{stats.pacientesNormales}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className="bg-yellow-500 w-16 rounded-t"
                    style={{height: `${stats.totalPacientes > 0 ? (stats.pacientesAtencion / stats.totalPacientes) * 200 : 0}px`}}
                  ></div>
                  <span className="text-sm text-gray-600 mt-2">Atención</span>
                  <span className="text-xs text-gray-500">{stats.pacientesAtencion}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className="bg-red-500 w-16 rounded-t"
                    style={{height: `${stats.totalPacientes > 0 ? (stats.pacientesCriticos / stats.totalPacientes) * 200 : 0}px`}}
                  ></div>
                  <span className="text-sm text-gray-600 mt-2">Crítico</span>
                  <span className="text-xs text-gray-500">{stats.pacientesCriticos}</span>
                </div>
              </div>
            </div>

            {/* Alertas activas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Alertas Activas ({alerts.length})
              </h3>
              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => {
                    const athlete = athletes.find(a => a.id === alert.athleteId)
                    return (
                      <div key={alert.id} className="flex items-center p-3 bg-red-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-red-800">
                            {athlete?.fullName}
                          </p>
                          <p className="text-sm text-red-600">
                            {alert.message}
                          </p>
                        </div>
                        <div className="text-xs text-red-500">
                          {formatDate(alert.createdDate)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No hay alertas activas
                </p>
              )}
            </div>
          </div>
        )}

        {/* Gestión de Pacientes */}
        {selectedTab === 'patients' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Pacientes</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                ➕ Nuevo Paciente
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Edad/Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado Nutricional
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Evaluación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {athletes.map((athlete) => (
                    <tr key={athlete.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {athlete.fullName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {athlete.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {athlete.club} • {athlete.position}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{athlete.age} años</div>
                        <div className="text-sm text-gray-500">Categoría {athlete.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(athlete.nutritionalStatus)}`}>
                          {getStatusText(athlete.nutritionalStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(athlete.lastEvaluation)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          Ver
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Evaluaciones ABCD */}
        {selectedTab === 'evaluations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Evaluaciones ABCD</h2>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                ➕ Nueva Evaluación
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-t-4 border-blue-500 hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">A</span>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">A: Antropometría</h3>
                  <p className="text-blue-600 text-sm mb-4">Medición de composición corporal y dimensiones físicas</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Acceder
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-t-4 border-green-500 hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">B</span>
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">B: Bioquímica</h3>
                  <p className="text-green-600 text-sm mb-4">Indicadores de laboratorio y marcadores nutricionales</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Acceder
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border-t-4 border-orange-500 hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">C</span>
                  </div>
                  <h3 className="text-xl font-bold text-orange-800 mb-2">C: Clínica</h3>
                  <p className="text-orange-600 text-sm mb-4">Evaluación de signos, síntomas y estado funcional</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    Acceder
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-t-4 border-purple-500 hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">D</span>
                  </div>
                  <h3 className="text-xl font-bold text-purple-800 mb-2">D: Dietética</h3>
                  <p className="text-purple-600 text-sm mb-4">Análisis de consumo alimentario y hábitos nutricionales</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Acceder
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de evaluaciones recientes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Evaluaciones Recientes
              </h3>
              {evaluations.length > 0 ? (
                <div className="space-y-3">
                  {evaluations.slice(0, 5).map((evaluation) => {
                    const athlete = athletes.find(a => a.id === evaluation.athleteId)
                    return (
                      <div key={evaluation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {athlete?.fullName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {athlete?.fullName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Evaluación ABCD completa
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">
                            {formatDate(evaluation.date)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {evaluation.evaluator}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No hay evaluaciones registradas
                </p>
              )}
            </div>
          </div>
        )}

        {/* Planes Alimenticios */}
        {selectedTab === 'nutrition' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Planes Alimenticios</h2>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                ➕ Nuevo Plan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {athletes.slice(0, 6).map((athlete) => (
                <div key={athlete.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {athlete.fullName.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {athlete.fullName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {athlete.age} años • {athlete.category}
                      </p>
                    </div>
                  </div>
                  
                  {athlete.dietetics && (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Calorías objetivo:</span>
                        <span className="font-medium">{athlete.dietetics.dailyIntake.calories} kcal</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Proteínas:</span>
                        <span className="font-medium">{athlete.dietetics.dailyIntake.protein}g</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Comidas/día:</span>
                        <span className="font-medium">{athlete.dietetics.mealPattern.mealsPerDay}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-green-100 text-green-700 text-center py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
                      Ver Plan
                    </button>
                    <button className="flex-1 bg-blue-100 text-blue-700 text-center py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seguimiento Nutricional */}
        {selectedTab === 'tracking' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Seguimiento Nutricional</h2>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                📈 Ver Seguimiento Completo
              </button>
            </div>

            {/* Resumen de seguimiento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Progreso Semanal
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Evaluaciones completadas:</span>
                    <span className="font-medium">{stats.evaluacionesRecientes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Planes actualizados:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Seguimientos activos:</span>
                    <span className="font-medium">{stats.totalPacientes}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Tendencias Nutricionales
                </h3>
                <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-around p-4">
                  <div className="bg-blue-500 w-8 rounded-t" style={{height: '60%'}}></div>
                  <div className="bg-blue-500 w-8 rounded-t" style={{height: '75%'}}></div>
                  <div className="bg-blue-500 w-8 rounded-t" style={{height: '85%'}}></div>
                  <div className="bg-green-500 w-8 rounded-t" style={{height: '90%'}}></div>
                </div>
                <div className="flex justify-around text-xs text-gray-500 mt-2">
                  <span>Sem 1</span>
                  <span>Sem 2</span>
                  <span>Sem 3</span>
                  <span>Sem 4</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Próximas Citas
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <div>
                      <p className="text-sm font-medium">Carlos Rodríguez</p>
                      <p className="text-xs text-gray-500">Evaluación ABCD</p>
                    </div>
                    <span className="text-xs text-blue-600">Hoy 10:00</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <div>
                      <p className="text-sm font-medium">María Fernández</p>
                      <p className="text-xs text-gray-500">Seguimiento</p>
                    </div>
                    <span className="text-xs text-green-600">Mañana 14:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
