"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Athlete, ABCDEvaluation, NutritionalAlert, MealPlan, MealReminder } from '@/lib/types'
import { DataStorage } from '@/lib/storage'
import { formatDate, getStatusColor, getStatusText, getCategoryText } from '@/lib/utils'

export default function PacienteDetallePage() {
  const params = useParams()
  const athleteId = params.id as string
  
  const [athlete, setAthlete] = useState<Athlete | null>(null)
  const [evaluations, setEvaluations] = useState<ABCDEvaluation[]>([])
  const [alerts, setAlerts] = useState<NutritionalAlert[]>([])
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [mealReminders, setMealReminders] = useState<MealReminder[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    if (athleteId) {
      const loadedAthlete = DataStorage.getAthleteById(athleteId)
      const loadedEvaluations = DataStorage.getEvaluationsByAthleteId(athleteId)
      const loadedAlerts = DataStorage.getAlertsByAthleteId(athleteId)
      
      // Cargar planes alimenticios y recordatorios (datos vacíos por ahora)
      const loadedMealPlans: MealPlan[] = []
      const loadedMealReminders: MealReminder[] = []
      
      setAthlete(loadedAthlete)
      setEvaluations(loadedEvaluations)
      setAlerts(loadedAlerts)
      setMealPlans(loadedMealPlans)
      setMealReminders(loadedMealReminders)
      setLoading(false)
    }
  }, [athleteId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información del paciente...</p>
        </div>
      </div>
    )
  }

  if (!athlete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">❌</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Paciente no encontrado</h3>
          <p className="text-gray-600 mb-4">El paciente solicitado no existe o ha sido eliminado.</p>
          <Link
            href="/pacientes"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Volver a Pacientes
          </Link>
        </div>
      </div>
    )
  }

  const activeAlerts = alerts.filter((alert: NutritionalAlert) => !alert.resolved)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/pacientes" 
                className="text-white hover:text-blue-200 transition-colors flex items-center space-x-2"
              >
                <span className="text-xl">←</span>
                <span>Volver a Pacientes</span>
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">{athlete.fullName}</h1>
              <p className="text-blue-100 text-sm">Perfil completo del paciente</p>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href={`/pacientes/${athlete.id}/editar`}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Editar
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información Principal */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-2xl">
                  {athlete.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{athlete.fullName}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Edad:</span> {athlete.age} años
                  </div>
                  <div>
                    <span className="font-medium">Género:</span> {athlete.gender === 'male' ? 'Masculino' : 'Femenino'}
                  </div>
                  <div>
                    <span className="font-medium">Categoría:</span> {getCategoryText(athlete.category)}
                  </div>
                  <div>
                    <span className="font-medium">Club:</span> {athlete.club}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(athlete.nutritionalStatus)}`}>
                {getStatusText(athlete.nutritionalStatus)}
              </span>
              <p className="text-sm text-gray-600 mt-2">
                Última evaluación: {formatDate(athlete.lastEvaluation)}
              </p>
            </div>
          </div>
        </div>

        {/* Alertas Activas */}
        {activeAlerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-red-800 mb-3">
              🚨 Alertas Activas ({activeAlerts.length})
            </h3>
            <div className="space-y-2">
              {activeAlerts.map((alert: NutritionalAlert) => (
                <div key={alert.id} className="bg-white rounded p-3 border border-red-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-red-800">{alert.message}</p>
                      <p className="text-sm text-red-600">
                        Severidad: {alert.severity} | Fecha: {formatDate(alert.createdDate)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  {alert.recommendations.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-red-700">Recomendaciones:</p>
                      <ul className="text-sm text-red-600 list-disc list-inside">
                        {alert.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evaluaciones ABCD</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href={`/evaluaciones/antropometria?paciente=${athlete.id}`}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-center transition-colors"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">A</span>
              </div>
              <p className="text-sm font-medium text-blue-800">Antropometría</p>
            </Link>

            <Link
              href={`/evaluaciones/bioquimica?paciente=${athlete.id}`}
              className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-center transition-colors"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">B</span>
              </div>
              <p className="text-sm font-medium text-green-800">Bioquímica</p>
            </Link>

            <Link
              href={`/evaluaciones/clinica?paciente=${athlete.id}`}
              className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-4 text-center transition-colors"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">C</span>
              </div>
              <p className="text-sm font-medium text-orange-800">Clínica</p>
            </Link>

            <Link
              href={`/evaluaciones/dietetica?paciente=${athlete.id}`}
              className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-center transition-colors"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">D</span>
              </div>
              <p className="text-sm font-medium text-purple-800">Dietética</p>
            </Link>
          </div>
        </div>

        {/* Tabs de Información */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'general', label: 'Información General' },
                { id: 'contacto', label: 'Contacto' },
                { id: 'medica', label: 'Información Médica' },
                { id: 'deportiva', label: 'Información Deportiva' },
                { id: 'nutricional', label: 'Información Nutricional' },
                { id: 'planes-alimenticios', label: 'Planes Alimenticios' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Tab: Información General */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Datos Básicos</h4>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Nombre Completo:</dt>
                        <dd className="text-sm text-gray-900">{athlete.fullName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Fecha de Nacimiento:</dt>
                        <dd className="text-sm text-gray-900">{formatDate(athlete.birthDate)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Edad:</dt>
                        <dd className="text-sm text-gray-900">{athlete.age} años</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Género:</dt>
                        <dd className="text-sm text-gray-900">{athlete.gender === 'male' ? 'Masculino' : 'Femenino'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Categoría:</dt>
                        <dd className="text-sm text-gray-900">{getCategoryText(athlete.category)}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Medidas Actuales</h4>
                    {athlete.anthropometry ? (
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Altura:</dt>
                          <dd className="text-sm text-gray-900">{athlete.anthropometry.height} cm</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">Peso:</dt>
                          <dd className="text-sm text-gray-900">{athlete.anthropometry.weight} kg</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600">IMC:</dt>
                          <dd className="text-sm text-gray-900">{athlete.anthropometry.bmi} kg/m²</dd>
                        </div>
                        {athlete.anthropometry.bodyFatPercentage && (
                          <div>
                            <dt className="text-sm font-medium text-gray-600">% Grasa Corporal:</dt>
                            <dd className="text-sm text-gray-900">{athlete.anthropometry.bodyFatPercentage}%</dd>
                          </div>
                        )}
                      </dl>
                    ) : (
                      <p className="text-sm text-gray-500">No hay medidas antropométricas registradas</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Contacto */}
            {activeTab === 'contacto' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h4>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Teléfono:</dt>
                        <dd className="text-sm text-gray-900">{athlete.contactInfo?.phone || 'No registrado'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Email:</dt>
                        <dd className="text-sm text-gray-900">{athlete.contactInfo?.email || 'No registrado'}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Contacto de Emergencia</h4>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Nombre:</dt>
                        <dd className="text-sm text-gray-900">{athlete.contactInfo?.emergencyContact || 'No registrado'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Teléfono:</dt>
                        <dd className="text-sm text-gray-900">{athlete.contactInfo?.emergencyPhone || 'No registrado'}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Información Médica */}
            {activeTab === 'medica' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Historial Médico</h4>
                  <div className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-600 mb-1">Historial Médico:</dt>
                      <dd className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {athlete.medicalInfo?.medicalHistory || 'No registrado'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 mb-1">Alergias:</dt>
                      <dd className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {athlete.medicalInfo?.allergies || 'No registrado'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 mb-1">Medicamentos Actuales:</dt>
                      <dd className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {athlete.medicalInfo?.medications || 'No registrado'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 mb-1">Lesiones Previas:</dt>
                      <dd className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {athlete.medicalInfo?.previousInjuries || 'No registrado'}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Información Deportiva */}
            {activeTab === 'deportiva' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Datos Deportivos</h4>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Club/Equipo:</dt>
                        <dd className="text-sm text-gray-900">{athlete.club}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Posición:</dt>
                        <dd className="text-sm text-gray-900">{athlete.position}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Años Jugando:</dt>
                        <dd className="text-sm text-gray-900">{athlete.sportsInfo?.yearsPlaying || 'No registrado'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Días de Entrenamiento:</dt>
                        <dd className="text-sm text-gray-900">{athlete.sportsInfo?.trainingDays || 'No registrado'} días/semana</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Horas de Entrenamiento:</dt>
                        <dd className="text-sm text-gray-900">{athlete.sportsInfo?.trainingHours || 'No registrado'} horas/día</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Competencias</h4>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 mb-1">Competencias/Torneos:</dt>
                      <dd className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {athlete.sportsInfo?.competitions || 'No registrado'}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Información Nutricional */}
            {activeTab === 'nutricional' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Hábitos Nutricionales</h4>
                  <div className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-600 mb-1">Restricciones Dietéticas:</dt>
                      <dd className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {athlete.nutritionalInfo?.dietaryRestrictions || 'No registrado'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 mb-1">Suplementos Actuales:</dt>
                      <dd className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {athlete.nutritionalInfo?.supplements || 'No registrado'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 mb-1">Hábitos de Hidratación:</dt>
                      <dd className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {athlete.nutritionalInfo?.hydrationHabits || 'No registrado'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 mb-1">Horas de Sueño:</dt>
                      <dd className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {athlete.nutritionalInfo?.sleepHours ? `${athlete.nutritionalInfo.sleepHours} horas/noche` : 'No registrado'}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Planes Alimenticios */}
            {activeTab === 'planes-alimenticios' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">Planes Alimenticios ({mealPlans.length})</h4>
                  <Link
                    href={`/planes-alimenticios/nuevo?paciente=${athlete.id}`}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    Crear Nuevo Plan
                  </Link>
                </div>

                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-2xl">📋</span>
                  </div>
                  <h5 className="text-lg font-medium text-gray-900 mb-2">No hay planes alimenticios</h5>
                  <p className="text-gray-600 mb-4">Este paciente aún no tiene planes alimenticios asignados</p>
                  <Link
                    href={`/planes-alimenticios/nuevo?paciente=${athlete.id}`}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Crear Primer Plan
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 ErgoSanitas - Perfil del Paciente
          </p>
        </div>
      </footer>
    </div>
  )
}
