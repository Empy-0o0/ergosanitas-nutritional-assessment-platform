"use client"

import { useState, useEffect } from 'react'
import { Athlete, NutritionalAlert, ABCDEvaluation } from '@/lib/types'
import { DataStorage } from '@/lib/storage'
import { formatDate, getStatusColor, getStatusText, getCategoryText } from '@/lib/utils'
import { AnthropometryCalculations } from '@/lib/calculations'
import { initializeEnhancedDatabase } from '@/data/sampleData'
import ABCDEvaluationForm from '@/components/evaluations/ABCDEvaluationForm'

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
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
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
              <a href="#" className="hover:text-blue-200 transition-colors">Inicio</a>
              <a href="#" className="hover:text-blue-200 transition-colors">Pacientes</a>
              <a href="#" className="hover:text-blue-200 transition-colors">Evaluaciones</a>
              <a href="#" className="hover:text-blue-200 transition-colors">Reportes</a>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">Dr. Nutriólogo</p>
                <p className="text-blue-200 text-sm">Especialista Deportivo</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">DN</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deportistas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estado Normal</p>
                <p className="text-3xl font-bold text-green-600">{stats.normal}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Riesgo</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.warning}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-xl">⚠</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alerta</p>
                <p className="text-3xl font-bold text-red-600">{stats.danger}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xl">🚨</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas Activas</p>
                <p className="text-3xl font-bold text-purple-600">{stats.activeAlerts}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">🔔</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y acciones */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar deportista por nombre, club o categoría..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewAthleteForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                ➕ Nuevo Deportista
              </button>
              <button 
                onClick={() => {
                  if (athletes.length > 0) {
                    handleNewEvaluation(athletes[0])
                  } else {
                    alert('Primero debe registrar un deportista')
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                📊 Nueva Evaluación ABCD
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                📋 Generar Reporte
              </button>
            </div>
          </div>
        </div>

        {/* Modelo ABCD Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-montserrat">Evaluación ABCD del Estado Nutricional</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              ➕ Nuevo Registro
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div 
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-t-4 border-blue-500 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => athletes.length > 0 && handleNewEvaluation(athletes[0])}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">📏</span>
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">A: Antropometría</h3>
                <p className="text-blue-600 text-sm mb-4">Medición de composición corporal y dimensiones físicas</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Datos Completos
                </div>
              </div>
            </div>

            <div 
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-t-4 border-green-500 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => athletes.length > 0 && handleNewEvaluation(athletes[0])}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🧪</span>
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">B: Bioquímica</h3>
                <p className="text-green-600 text-sm mb-4">Indicadores de laboratorio y marcadores nutricionales</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Datos Completos
                </div>
              </div>
            </div>

            <div 
              className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border-t-4 border-orange-500 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => athletes.length > 0 && handleNewEvaluation(athletes[0])}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🩺</span>
                </div>
                <h3 className="text-xl font-bold text-orange-800 mb-2">C: Clínica</h3>
                <p className="text-orange-600 text-sm mb-4">Evaluación de signos, síntomas y estado funcional</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Datos Completos
                </div>
              </div>
            </div>

            <div 
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-t-4 border-purple-500 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => athletes.length > 0 && handleNewEvaluation(athletes[0])}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🍎</span>
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-2">D: Dietética</h3>
                <p className="text-purple-600 text-sm mb-4">Análisis de consumo alimentario y hábitos nutricionales</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Datos Completos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de deportistas */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Deportistas Registrados</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deportista
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edad/Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Club/Posición
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Evaluación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado Nutricional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IMC
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAthletes.map((athlete) => (
                  <tr key={athlete.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {athlete.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{athlete.fullName}</div>
                          <div className="text-sm text-gray-500">{getStatusText(athlete.gender)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{athlete.age} años</div>
                      <div className="text-sm text-gray-500">{getCategoryText(athlete.category)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{athlete.club}</div>
                      <div className="text-sm text-gray-500">{athlete.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(athlete.lastEvaluation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(athlete.nutritionalStatus)}`}>
                        {getStatusText(athlete.nutritionalStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {athlete.anthropometry?.bmi?.toFixed(1) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                      <button 
                        onClick={() => handleNewEvaluation(athlete)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Evaluar ABCD
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">Reporte</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para nuevo deportista */}
      {showNewAthleteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Registrar Nuevo Deportista</h3>
                <button
                  onClick={() => setShowNewAthleteForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newAthlete.fullName}
                    onChange={(e) => setNewAthlete({...newAthlete, fullName: e.target.value})}
                    placeholder="Ej: Juan Pérez López"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newAthlete.birthDate}
                    onChange={(e) => setNewAthlete({...newAthlete, birthDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Género *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newAthlete.gender}
                    onChange={(e) => setNewAthlete({...newAthlete, gender: e.target.value as 'male' | 'female'})}
                  >
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newAthlete.category}
                    onChange={(e) => setNewAthlete({...newAthlete, category: e.target.value as '5-8' | '9-13' | '14-18'})}
                  >
                    <option value="5-8">5-8 años (Iniciación)</option>
                    <option value="9-13">9-13 años (Desarrollo)</option>
                    <option value="14-18">14-18 años (Rendimiento)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Club/Equipo
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newAthlete.club}
                    onChange={(e) => setNewAthlete({...newAthlete, club: e.target.value})}
                    placeholder="Nombre del club o equipo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Posición
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newAthlete.position}
                    onChange={(e) => setNewAthlete({...newAthlete, position: e.target.value})}
                    placeholder="Ej: Mediocampista, Delantero"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (cm) *
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newAthlete.height}
                    onChange={(e) => setNewAthlete({...newAthlete, height: e.target.value})}
                    placeholder="Ej: 150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newAthlete.weight}
                    onChange={(e) => setNewAthlete({...newAthlete, weight: e.target.value})}
                    placeholder="Ej: 45.5"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewAthleteForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveAthlete}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Guardar Deportista
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Evaluación ABCD */}
      {showEvaluationForm && selectedAthlete && (
        <ABCDEvaluationForm
          athlete={selectedAthlete}
          onClose={handleCloseEvaluation}
          onSave={handleEvaluationSave}
        />
      )}

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
