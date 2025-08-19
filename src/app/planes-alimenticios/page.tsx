"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MealPlan, Athlete } from '@/lib/types'
import { DataStorage } from '@/lib/storage'
import { formatDate, getStatusColor } from '@/lib/utils'

export default function PlanesAlimenticiosPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'paused' | 'cancelled'>('all')

  useEffect(() => {
    const loadData = () => {
      try {
        const loadedMealPlans = DataStorage.getMealPlans()
        const loadedAthletes = DataStorage.getAthletes()
        
        setMealPlans(loadedMealPlans)
        setAthletes(loadedAthletes)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getAthleteById = (id: string) => {
    return athletes.find(athlete => athlete.id === id)
  }

  const handleDeletePlan = (id: string, name: string) => {
    if (confirm(`¿Está seguro de eliminar el plan "${name}"? Esta acción no se puede deshacer.`)) {
      try {
        DataStorage.deleteMealPlan(id)
        setMealPlans(prev => prev.filter(plan => plan.id !== id))
        alert('Plan alimenticio eliminado exitosamente')
      } catch (error) {
        console.error('Error deleting meal plan:', error)
        alert('Error al eliminar el plan alimenticio')
      }
    }
  }

  const filteredPlans = mealPlans.filter(plan => {
    const athlete = getAthleteById(plan.athleteId)
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         athlete?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusText = (status: MealPlan['status']) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'completed': return 'Completado'
      case 'paused': return 'Pausado'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  const getStatusColorClass = (status: MealPlan['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando planes alimenticios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Planes Alimenticios</h1>
              <p className="text-green-100 mt-1">Gestión y seguimiento de planes nutricionales personalizados</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/planes-alimenticios/nuevo"
                className="bg-white text-green-600 hover:bg-green-50 px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <span className="text-xl">+</span>
                <span>Nuevo Plan</span>
              </Link>
              <Link
                href="/"
                className="text-white hover:text-green-200 transition-colors flex items-center space-x-2"
              >
                <span className="text-xl">←</span>
                <span>Inicio</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar planes
              </label>
              <input
                type="text"
                id="search"
                placeholder="Buscar por nombre del plan, paciente o nutricionista..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="completed">Completados</option>
                  <option value="paused">Pausados</option>
                  <option value="cancelled">Cancelados</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Planes</p>
                <p className="text-2xl font-bold text-gray-900">{mealPlans.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Planes Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mealPlans.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Planes Pausados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mealPlans.filter(p => p.status === 'paused').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mealPlans.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de planes */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Planes Alimenticios ({filteredPlans.length})
            </h3>
          </div>

          {filteredPlans.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {mealPlans.length === 0 ? 'No hay planes alimenticios registrados' : 'No se encontraron planes'}
              </h3>
              <p className="text-gray-600 mb-4">
                {mealPlans.length === 0
                  ? 'Comience creando el primer plan alimenticio para sus pacientes'
                  : 'Intente ajustar los filtros de búsqueda'
                }
              </p>
              {mealPlans.length === 0 && (
                <Link
                  href="/planes-alimenticios/nuevo"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Crear Primer Plan
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredPlans.map((plan) => {
                const athlete = getAthleteById(plan.athleteId)
                return (
                  <div key={plan.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorClass(plan.status)}`}>
                            {getStatusText(plan.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Paciente:</span> {athlete?.fullName || 'Paciente no encontrado'}
                          </div>
                          <div>
                            <span className="font-medium">Creado por:</span> {plan.createdBy}
                          </div>
                          <div>
                            <span className="font-medium">Fecha de inicio:</span> {formatDate(plan.startDate)}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="bg-blue-50 rounded p-2">
                            <span className="font-medium text-blue-800">Calorías diarias:</span>
                            <p className="text-blue-600">{plan.nutritionalGoals.dailyCalories} kcal</p>
                          </div>
                          <div className="bg-green-50 rounded p-2">
                            <span className="font-medium text-green-800">Proteínas:</span>
                            <p className="text-green-600">{plan.nutritionalGoals.proteinPercentage}%</p>
                          </div>
                          <div className="bg-yellow-50 rounded p-2">
                            <span className="font-medium text-yellow-800">Carbohidratos:</span>
                            <p className="text-yellow-600">{plan.nutritionalGoals.carbsPercentage}%</p>
                          </div>
                          <div className="bg-purple-50 rounded p-2">
                            <span className="font-medium text-purple-800">Grasas:</span>
                            <p className="text-purple-600">{plan.nutritionalGoals.fatsPercentage}%</p>
                          </div>
                        </div>

                        {plan.description && (
                          <p className="text-gray-600 mt-3 text-sm">{plan.description}</p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          href={`/planes-alimenticios/${plan.id}`}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Ver Detalle
                        </Link>
                        <Link
                          href={`/planes-alimenticios/${plan.id}/editar`}
                          className="text-green-600 hover:text-green-900 text-sm font-medium"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDeletePlan(plan.id, plan.name)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 ErgoSanitas - Sistema de Planes Alimenticios
          </p>
        </div>
      </footer>
    </div>
  )
}
