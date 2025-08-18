"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Athlete } from '@/lib/types'
import { DataStorage } from '@/lib/storage'
import { formatDate, getStatusColor, getStatusText, getCategoryText } from '@/lib/utils'

export default function PacientesPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadedAthletes = DataStorage.getAthletes()
    setAthletes(loadedAthletes)
    setLoading(false)
  }, [])

  const handleDeleteAthlete = (id: string, name: string) => {
    if (confirm(`¿Está seguro de eliminar al paciente ${name}? Esta acción no se puede deshacer.`)) {
      try {
        DataStorage.deleteAthlete(id)
        setAthletes(DataStorage.getAthletes())
        alert('Paciente eliminado exitosamente')
      } catch (error) {
        alert('Error al eliminar el paciente')
      }
    }
  }

  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = athlete.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         athlete.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         athlete.position.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || athlete.nutritionalStatus === filterStatus
    const matchesCategory = filterCategory === 'all' || athlete.category === filterCategory
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    total: athletes.length,
    normal: athletes.filter(a => a.nutritionalStatus === 'normal').length,
    warning: athletes.filter(a => a.nutritionalStatus === 'warning').length,
    danger: athletes.filter(a => a.nutritionalStatus === 'danger').length,
    category5_8: athletes.filter(a => a.category === '5-8').length,
    category9_13: athletes.filter(a => a.category === '9-13').length,
    category14_18: athletes.filter(a => a.category === '14-18').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pacientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-white hover:text-blue-200 transition-colors flex items-center space-x-2"
              >
                <span className="text-xl">←</span>
                <span>Volver al Panel</span>
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Gestión de Pacientes</h1>
              <p className="text-blue-100 text-sm">Administración completa de deportistas</p>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pacientes</p>
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
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre, club o posición..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="normal">Normal</option>
                <option value="warning">En riesgo</option>
                <option value="danger">Alerta</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">Todas las categorías</option>
                <option value="5-8">5-8 años</option>
                <option value="9-13">9-13 años</option>
                <option value="14-18">14-18 años</option>
              </select>

              <Link
                href="/pacientes/nuevo"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Nuevo Paciente</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Lista de Pacientes */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Pacientes Registrados ({filteredAthletes.length})
            </h3>
          </div>
          
          {filteredAthletes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">👤</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {athletes.length === 0 ? 'No hay pacientes registrados' : 'No se encontraron pacientes'}
              </h3>
              <p className="text-gray-600 mb-4">
                {athletes.length === 0 
                  ? 'Comience registrando su primer paciente deportista'
                  : 'Intente ajustar los filtros de búsqueda'
                }
              </p>
              {athletes.length === 0 && (
                <Link
                  href="/pacientes/nuevo"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Registrar Primer Paciente
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                            <div className="text-sm text-gray-500">{athlete.gender === 'male' ? 'Masculino' : 'Femenino'}</div>
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
                        <div className="flex space-x-2">
                          <Link
                            href={`/pacientes/${athlete.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Ver
                          </Link>
                          <Link
                            href={`/pacientes/${athlete.id}/editar`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Editar
                          </Link>
                          <Link
                            href={`/evaluaciones/antropometria?paciente=${athlete.id}`}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Evaluar
                          </Link>
                          <button
                            onClick={() => handleDeleteAthlete(athlete.id, athlete.fullName)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 ErgoSanitas - Gestión de Pacientes Deportistas
          </p>
        </div>
      </footer>
    </div>
  )
}
