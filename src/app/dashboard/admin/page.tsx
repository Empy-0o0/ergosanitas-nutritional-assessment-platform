"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Athlete, NutritionalAlert } from '@/lib/types'
import { DataStorage } from '@/lib/storage'
import { formatDate } from '@/lib/utils'
import { institutions } from '@/data/patientCredentials'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [alerts, setAlerts] = useState<NutritionalAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login")
      return
    }

    if (session.user.role !== "admin") {
      router.push(`/dashboard/${session.user.role}`)
      return
    }

    setAthletes(DataStorage.getAthletes())
    setAlerts(DataStorage.getActiveAlerts())
    setLoading(false)
  }, [session, status, router])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard administrativo...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const stats = {
    totalAtletas: athletes.length,
    atletasNormales: athletes.filter(a => a.nutritionalStatus === 'normal').length,
    atletasAtencion: athletes.filter(a => a.nutritionalStatus === 'warning').length,
    atletasCriticos: athletes.filter(a => a.nutritionalStatus === 'danger').length,
    alertasActivas: alerts.length,
    totalInstituciones: institutions.length
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
      {/* Header del Administrador */}
      <header className="bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-xl">⚡</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>
                <p className="text-red-100">Control Total del Sistema ErgoSanitas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{session.user.name}</p>
                <p className="text-red-200 text-sm">Administrador del Sistema</p>
              </div>
              <Link
                href="/login"
                className="bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded-lg font-medium transition-colors"
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
              { id: 'users', name: 'Gestión de Usuarios', icon: '👥' },
              { id: 'patients', name: 'Gestión de Pacientes', icon: '🏥' },
              { id: 'institutions', name: 'Instituciones', icon: '🏫' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-red-500 text-red-600'
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
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Atletas</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalAtletas}</dd>
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
                      <dt className="text-sm font-medium text-gray-500 truncate">Estado Normal</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.atletasNormales}</dd>
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
                      <dt className="text-sm font-medium text-gray-500 truncate">Requieren Atención</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.atletasAtencion}</dd>
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
                      <dt className="text-sm font-medium text-gray-500 truncate">Estado Crítico</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.atletasCriticos}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico de distribución global */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Distribución Global de Estados Nutricionales
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
          </div>
        )}

        {/* Gestión de Usuarios */}
        {selectedTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                ➕ Crear Usuario
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Usuarios del Sistema</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Dr. Carlos Mendoza</h4>
                      <p className="text-sm text-gray-500">doctor@ergosanitas.com</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Admin</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Editar</button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Lic. María González</h4>
                      <p className="text-sm text-gray-500">maria.gonzalez@ergosanitas.com</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Nutricionista</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Editar</button>
                    </div>
                  </div>
                </div>

                {institutions.map((inst, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{inst.name}</h4>
                        <p className="text-sm text-gray-500">{inst.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Institución</span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Editar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gestión de Pacientes */}
        {selectedTab === 'patients' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Pacientes</h2>
              <Link
                href="/pacientes/nuevo"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                ➕ Nuevo Paciente
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institución</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {athletes.map((athlete) => (
                    <tr key={athlete.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">{athlete.fullName.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{athlete.fullName}</div>
                            <div className="text-sm text-gray-500">{athlete.age} años - {athlete.position}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{athlete.club}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(athlete.nutritionalStatus)}`}>
                          {getStatusText(athlete.nutritionalStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">Ver</button>
                        <button className="text-green-600 hover:text-green-900 mr-4">Editar</button>
                        <button className="text-red-600 hover:text-red-900">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instituciones */}
        {selectedTab === 'institutions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Instituciones</h2>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                ➕ Nueva Institución
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {institutions.map((inst, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{inst.name.charAt(0)}</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{inst.name}</h3>
                      <p className="text-sm text-gray-500">{inst.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Atletas inscritos:</span>
                      <span className="font-medium">{athletes.filter(a => a.club === inst.name).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estado:</span>
                      <span className="font-medium text-green-600">Activa</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-100 text-blue-700 text-center py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                      Ver Detalles
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 text-center py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información del sistema */}
        <div className="bg-red-50 rounded-lg p-6 mt-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">⚡</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-900 mb-2">Dashboard Administrativo - Control Total</h3>
              <p className="text-red-700 text-sm mb-4">
                Como administrador, tienes acceso completo a todas las funcionalidades del sistema ErgoSanitas. 
                Puedes crear, editar, actualizar y eliminar usuarios, pacientes e instituciones.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red-600">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Gestión completa de usuarios</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Control total de pacientes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Administración de instituciones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Estadísticas globales del sistema</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
