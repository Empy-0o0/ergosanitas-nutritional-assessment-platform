"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Athlete, NutritionalAlert, ABCDEvaluation } from '@/lib/types'
import { DataStorage } from '@/lib/storage'
import { formatDate, getStatusColor, getStatusText, getCategoryText } from '@/lib/utils'
import { AnthropometryCalculations } from '@/lib/calculations'
import { initializeEnhancedDatabase } from '@/data/sampleData'
import ABCDEvaluationForm from '@/components/evaluations/ABCDEvaluationForm'
import { AuthNavigation } from '@/components/AuthNavigation'

export default function Dashboard() {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [alerts, setAlerts] = useState<NutritionalAlert[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [showEvaluationForm, setShowEvaluationForm] = useState(false)
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)

  // Estados para el formulario de nuevo atleta
  const [showNewAthleteForm, setShowNewAthleteForm] = useState(false)
  const [newAthlete, setNewAthlete] = useState({
    fullName: '',
    birthDate: '',
    gender: 'male' as 'male' | 'female',
    club: '',
    position: '',
    category: '9-13' as '5-8' | '9-13' | '14-18',
    height: '',
    weight: ''
  })

  useEffect(() => {
    // Inicializar base de datos mejorada con datos ABCD completos
    initializeEnhancedDatabase()
    
    // Cargar datos
    setAthletes(DataStorage.getAthletes())
    setAlerts(DataStorage.getActiveAlerts())
    setLoading(false)
  }, [])

  const handleSaveAthlete = () => {
    if (!newAthlete.fullName || !newAthlete.birthDate || !newAthlete.height || !newAthlete.weight) {
      alert('Por favor complete todos los campos requeridos')
      return
    }

    const height = parseFloat(newAthlete.height)
    const weight = parseFloat(newAthlete.weight)
    const bmi = AnthropometryCalculations.calculateBMI(weight, height)
    const age = Math.floor((Date.now() - new Date(newAthlete.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))

    const athlete: Athlete = {
      id: Date.now().toString(),
      fullName: newAthlete.fullName,
      birthDate: newAthlete.birthDate,
      age,
      gender: newAthlete.gender,
      club: newAthlete.club,
      position: newAthlete.position,
      category: newAthlete.category,
      evaluationDate: new Date().toISOString().split('T')[0],
      nutritionalStatus: 'normal',
      lastEvaluation: new Date().toISOString().split('T')[0],
      anthropometry: {
        height,
        weight,
        bmi: parseFloat(bmi.toFixed(1)),
        percentiles: {
          heightPercentile: 50,
          weightPercentile: 50,
          bmiPercentile: 50
        }
      }
    }

    DataStorage.saveAthlete(athlete)
    setAthletes(DataStorage.getAthletes())
    setShowNewAthleteForm(false)
    setNewAthlete({
      fullName: '',
      birthDate: '',
      gender: 'male',
      club: '',
      position: '',
      category: '9-13',
      height: '',
      weight: ''
    })
  }

  const handleNewEvaluation = (athlete: Athlete) => {
    setSelectedAthlete(athlete)
    setShowEvaluationForm(true)
  }

  const handleEvaluationSave = (evaluation: ABCDEvaluation) => {
    // Recargar datos actualizados
    setAthletes(DataStorage.getAthletes())
    setAlerts(DataStorage.getActiveAlerts())
    setShowEvaluationForm(false)
    setSelectedAthlete(null)
    
    // Mostrar mensaje de éxito
    alert(`Evaluación ABCD completada para ${selectedAthlete?.fullName}. Estado nutricional actualizado.`)
  }

  const handleCloseEvaluation = () => {
    setShowEvaluationForm(false)
    setSelectedAthlete(null)
  }

  const filteredAthletes = athletes.filter(athlete =>
    athlete.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.category.includes(searchTerm)
  )

  const stats = {
    total: athletes.length,
    normal: athletes.filter(a => a.nutritionalStatus === 'normal').length,
    warning: athletes.filter(a => a.nutritionalStatus === 'warning').length,
    danger: athletes.filter(a => a.nutritionalStatus === 'danger').length,
    activeAlerts: alerts.length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando ErgoSanitas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">♥</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold font-montserrat">
                  Ergo<span className="text-green-400">Sanitas</span>
                </h1>
                <p className="text-blue-100 text-sm">Plataforma Nutricional Deportiva</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="hover:text-blue-200 transition-colors font-medium px-3 py-2 rounded hover:bg-white hover:bg-opacity-15">
                Inicio
              </Link>
              <Link href="/pacientes" className="hover:text-blue-200 transition-colors font-medium px-3 py-2 rounded hover:bg-white hover:bg-opacity-15">
                Pacientes
              </Link>
              <Link href="/evaluaciones" className="hover:text-blue-200 transition-colors font-medium px-3 py-2 rounded hover:bg-white hover:bg-opacity-15">
                Evaluaciones
              </Link>
              <Link href="/seguimiento-nutricional" className="hover:text-blue-200 transition-colors font-medium px-3 py-2 rounded hover:bg-white hover:bg-opacity-15">
                Seguimiento
              </Link>
              <Link href="/reportes" className="hover:text-blue-200 transition-colors font-medium px-3 py-2 rounded hover:bg-white hover:bg-opacity-15">
                Reportes
              </Link>
              <Link href="/biblioteca" className="hover:text-blue-200 transition-colors font-medium px-3 py-2 rounded hover:bg-white hover:bg-opacity-15">
                Biblioteca
              </Link>
            </nav>

            <AuthNavigation />
          </div>
        </div>
      </header>

      {/* Dashboard Layout with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-blue-600 mb-6 pb-3 border-b border-gray-200">
                Menú de Navegación
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group">
                    <span className="w-5 h-5 flex items-center justify-center">🏠</span>
                    <span className="font-medium">Panel Principal</span>
                  </Link>
                </li>
                <li>
                  <Link href="/pacientes/nuevo" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group">
                    <span className="w-5 h-5 flex items-center justify-center">👤</span>
                    <span className="font-medium">Nuevo Paciente</span>
                  </Link>
                </li>
                <li>
                  <Link href="/evaluaciones" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group">
                    <span className="w-5 h-5 flex items-center justify-center">🩺</span>
                    <span className="font-medium">Evaluación ABCD</span>
                  </Link>
                </li>
                <li>
                  <Link href="/seguimiento-nutricional" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group">
                    <span className="w-5 h-5 flex items-center justify-center">📈</span>
                    <span className="font-medium">Seguimiento Nutricional</span>
                  </Link>
                </li>
                <li>
                  <Link href="/planes-alimenticios" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group">
                    <span className="w-5 h-5 flex items-center justify-center">🍽️</span>
                    <span className="font-medium">Planes Alimenticios</span>
                  </Link>
                </li>
                <li>
                  <Link href="/suplementacion" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group">
                    <span className="w-5 h-5 flex items-center justify-center">💊</span>
                    <span className="font-medium">Suplementación</span>
                  </Link>
                </li>
                <li>
                  <Link href="/reportes" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group">
                    <span className="w-5 h-5 flex items-center justify-center">📋</span>
                    <span className="font-medium">Reportes</span>
                  </Link>
                </li>
                <li>
                  <Link href="/biblioteca" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group">
                    <span className="w-5 h-5 flex items-center justify-center">📚</span>
                    <span className="font-medium">Biblioteca</span>
                  </Link>
                </li>
                <li>
                  <Link href="/configuracion" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group">
                    <span className="w-5 h-5 flex items-center justify-center">⚙️</span>
                    <span className="font-medium">Configuración</span>
                  </Link>
                </li>
              </ul>
              
              <div className="mt-8 space-y-3">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Accesos Rápidos</h4>
                <Link href="/seguimiento-nutricional" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <span>🍎</span>
                  <span>Seguimiento Nutricional</span>
                </Link>
                <button
                  onClick={() => {
                    if (athletes.length > 0) {
                      handleNewEvaluation(athletes[0])
                    } else {
                      alert('Primero debe registrar un deportista')
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <span>➕</span>
                  <span>Nueva Evaluación</span>
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <span>📄</span>
                  <span>Generar Reporte</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {/* New Nutrition Tracking Card */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">🍎 Seguimiento Nutricional</h2>
                  <p className="text-green-100 mb-4">
                    Registra y monitorea la ingesta diaria de alimentos de tus atletas con nuestra base de datos nutricional completa.
                  </p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      <span>Base de datos con +50 alimentos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      <span>Análisis nutricional completo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      <span>Seguimiento por comidas</span>
                    </div>
                  </div>
                </div>
                <Link 
                  href="/seguimiento-nutricional"
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center space-x-2"
                >
                  <span>Acceder</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* ABCD Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat">Evaluación ABCD del Estado Nutricional</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  ➕ Nuevo Registro
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Link href="/evaluaciones/antropometria">
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
                </Link>

                <Link href="/evaluaciones/bioquimica">
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
                </Link>

                <Link href="/evaluaciones/clinica">
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
                </Link>

                <Link href="/evaluaciones/dietetica">
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
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">ErgoSanitas</h4>
              <p className="text-gray-300 text-sm">
                Plataforma especializada en nutrición deportiva para atletas juveniles. 
                Basada en el modelo ABCD de evaluación nutricional.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Inicio</a></li>
                <li><a href="#" className="hover:text-white">Evaluaciones</a></li>
                <li><a href="#" className="hover:text-white">Seguimiento Nutricional</a></li>
                <li><a href="#" className="hover:text-white">Reportes</a></li>
                <li><a href="#" className="hover:text-white">Ayuda</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Guías Nutricionales</a></li>
                <li><a href="#" className="hover:text-white">Calculadoras</a></li>
                <li><a href="#" className="hover:text-white">Investigaciones</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>📍 Av. Nutrición 123, Ciudad Deportiva</li>
                <li>📞 +1 234 567 890</li>
                <li>✉️ info@ergosanitas.com</li>
                <li>🕒 Lunes-Viernes: 9:00 - 18:00</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 ErgoSanitas. Todos los derechos reservados. | Basado en "El ABCD de la Evaluación del Estado Nutricional"
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
