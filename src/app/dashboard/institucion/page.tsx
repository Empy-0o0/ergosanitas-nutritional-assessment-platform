"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Athlete, NutritionalAlert } from '@/lib/types'
import { getAthletesByInstitution } from '@/data/patientCredentials'
import { formatDate } from '@/lib/utils'

export default function InstitucionDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login")
      return
    }

    if (session.user.role !== "institucion") {
      // Si no es institución, redirigir según su rol
      router.push(`/dashboard/${session.user.role}`)
      return
    }

    // Cargar atletas de la institución
    const institutionAthletes = getAthletesByInstitution(session.user.name || '')
    setAthletes(institutionAthletes)
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

  // Estadísticas de la institución
  const stats = {
    totalAtletas: athletes.length,
    atletasNormales: athletes.filter(a => a.nutritionalStatus === 'normal').length,
    atletasAtencion: athletes.filter(a => a.nutritionalStatus === 'warning').length,
    atletasCriticos: athletes.filter(a => a.nutritionalStatus === 'danger').length,
    promedioEdad: athletes.length > 0 ? Math.round(athletes.reduce((sum, a) => sum + a.age, 0) / athletes.length) : 0,
    categorias: {
      '5-8': athletes.filter(a => a.category === '5-8').length,
      '9-13': athletes.filter(a => a.category === '9-13').length,
      '14-18': athletes.filter(a => a.category === '14-18').length,
    }
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
      {/* Header de la Institución */}
      <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-xl">
                  {session.user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Dashboard Institucional
                </h1>
                <p className="text-green-100">
                  {session.user.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{session.user.name}</p>
                <p className="text-green-200 text-sm">Institución Deportiva</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    Total Atletas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalAtletas}
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
                    {stats.atletasNormales}
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
                    {stats.atletasAtencion}
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
                    {stats.atletasCriticos}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos y estadísticas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Distribución por Estados Nutricionales */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Distribución de Estados Nutricionales
            </h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-around p-4">
              <div className="flex flex-col items-center">
                <div 
                  className="bg-green-500 w-16 rounded-t"
                  style={{height: `${stats.totalAtletas > 0 ? (stats.atletasNormales / stats.totalAtletas) * 200 : 0}px`}}
                ></div>
                <span className="text-sm text-gray-600 mt-2">Normal</span>
                <span className="text-xs text-gray-500">{stats.atletasNormales}</span>
              </div>
              <div className="flex flex-col items-center">
                <div 
                  className="bg-yellow-500 w-16 rounded-t"
                  style={{height: `${stats.totalAtletas > 0 ? (stats.atletasAtencion / stats.totalAtletas) * 200 : 0}px`}}
                ></div>
                <span className="text-sm text-gray-600 mt-2">Atención</span>
                <span className="text-xs text-gray-500">{stats.atletasAtencion}</span>
              </div>
              <div className="flex flex-col items-center">
                <div 
                  className="bg-red-500 w-16 rounded-t"
                  style={{height: `${stats.totalAtletas > 0 ? (stats.atletasCriticos / stats.totalAtletas) * 200 : 0}px`}}
                ></div>
                <span className="text-sm text-gray-600 mt-2">Crítico</span>
                <span className="text-xs text-gray-500">{stats.atletasCriticos}</span>
              </div>
            </div>
          </div>

          {/* Distribución por Categorías de Edad */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Distribución por Categorías de Edad
            </h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-around p-4">
              <div className="flex flex-col items-center">
                <div 
                  className="bg-blue-500 w-16 rounded-t"
                  style={{height: `${stats.totalAtletas > 0 ? (stats.categorias['5-8'] / stats.totalAtletas) * 200 : 0}px`}}
                ></div>
                <span className="text-sm text-gray-600 mt-2">5-8 años</span>
                <span className="text-xs text-gray-500">{stats.categorias['5-8']}</span>
              </div>
              <div className="flex flex-col items-center">
                <div 
                  className="bg-purple-500 w-16 rounded-t"
                  style={{height: `${stats.totalAtletas > 0 ? (stats.categorias['9-13'] / stats.totalAtletas) * 200 : 0}px`}}
                ></div>
                <span className="text-sm text-gray-600 mt-2">9-13 años</span>
                <span className="text-xs text-gray-500">{stats.categorias['9-13']}</span>
              </div>
              <div className="flex flex-col items-center">
                <div 
                  className="bg-indigo-500 w-16 rounded-t"
                  style={{height: `${stats.totalAtletas > 0 ? (stats.categorias['14-18'] / stats.totalAtletas) * 200 : 0}px`}}
                ></div>
                <span className="text-sm text-gray-600 mt-2">14-18 años</span>
                <span className="text-xs text-gray-500">{stats.categorias['14-18']}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen estadístico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Resumen Nutricional
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Porcentaje en estado normal:</span>
                <span className="font-medium text-green-600">
                  {stats.totalAtletas > 0 ? Math.round((stats.atletasNormales / stats.totalAtletas) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Requieren seguimiento:</span>
                <span className="font-medium text-yellow-600">
                  {stats.atletasAtencion + stats.atletasCriticos}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Edad promedio:</span>
                <span className="font-medium">{stats.promedioEdad} años</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Distribución por Género
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Masculino:</span>
                <span className="font-medium">
                  {athletes.filter(a => a.gender === 'male').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Femenino:</span>
                <span className="font-medium">
                  {athletes.filter(a => a.gender === 'female').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ratio M/F:</span>
                <span className="font-medium">
                  {athletes.filter(a => a.gender === 'female').length > 0 
                    ? (athletes.filter(a => a.gender === 'male').length / athletes.filter(a => a.gender === 'female').length).toFixed(1)
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Evaluaciones Recientes
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Esta semana:</span>
                <span className="font-medium">
                  {athletes.filter(a => {
                    const evalDate = new Date(a.lastEvaluation)
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return evalDate >= weekAgo
                  }).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Este mes:</span>
                <span className="font-medium">
                  {athletes.filter(a => {
                    const evalDate = new Date(a.lastEvaluation)
                    const monthAgo = new Date()
                    monthAgo.setMonth(monthAgo.getMonth() - 1)
                    return evalDate >= monthAgo
                  }).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pendientes:</span>
                <span className="font-medium text-orange-600">
                  {athletes.filter(a => {
                    const evalDate = new Date(a.lastEvaluation)
                    const threeMonthsAgo = new Date()
                    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
                    return evalDate < threeMonthsAgo
                  }).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de atletas de la institución */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Atletas Inscritos ({stats.totalAtletas})
            </h3>
          </div>
          
          {athletes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Atleta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Edad/Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posición
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado Nutricional
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Evaluación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IMC
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {athletes.map((athlete) => (
                    <tr key={athlete.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {athlete.fullName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {athlete.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {athlete.gender === 'male' ? 'Masculino' : 'Femenino'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{athlete.age} años</div>
                        <div className="text-sm text-gray-500">Categoría {athlete.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{athlete.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(athlete.nutritionalStatus)}`}>
                          {getStatusText(athlete.nutritionalStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(athlete.lastEvaluation)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {athlete.anthropometry?.bmi ? athlete.anthropometry.bmi.toFixed(1) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-3xl">👥</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay atletas registrados
              </h3>
              <p className="text-gray-500 mb-6">
                Aún no hay atletas inscritos en {session.user.name}
              </p>
              <p className="text-sm text-gray-400">
                Los atletas aparecerán aquí una vez que sean registrados por el personal de nutrición.
              </p>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">ℹ️</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Información del Dashboard Institucional
              </h3>
              <p className="text-blue-700 text-sm mb-4">
                Este dashboard muestra únicamente los atletas inscritos en <strong>{session.user.name}</strong>. 
                Los datos mostrados incluyen estadísticas nutricionales y de evaluación específicas de su institución.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-600">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Visualización de estados nutricionales</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Estadísticas globales por institución</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Seguimiento de evaluaciones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Análisis por categorías de edad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
