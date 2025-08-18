"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Athlete } from '@/lib/types'
import { DataStorage } from '@/lib/storage'
import BiochemistryForm from '@/components/evaluations/BiochemistryForm'

export default function BiochemistryPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const pacienteId = searchParams.get('paciente')

  useEffect(() => {
    const loadedAthletes = DataStorage.getAthletes()
    setAthletes(loadedAthletes)
    
    // Si hay un paciente específico en la URL, seleccionarlo
    if (pacienteId) {
      const specificAthlete = loadedAthletes.find(a => a.id === pacienteId)
      if (specificAthlete) {
        setSelectedAthlete(specificAthlete)
      } else if (loadedAthletes.length > 0) {
        setSelectedAthlete(loadedAthletes[0])
      }
    } else if (loadedAthletes.length > 0) {
      setSelectedAthlete(loadedAthletes[0])
    }
    
    setLoading(false)
  }, [pacienteId])

  const handleSave = (data: any) => {
    if (selectedAthlete) {
      // Update athlete with biochemistry data
      const updatedAthlete = {
        ...selectedAthlete,
        biochemistry: data
      }
      DataStorage.saveAthlete(updatedAthlete)
      alert('Datos bioquímicos guardados exitosamente')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-white hover:text-green-200 transition-colors flex items-center space-x-2"
              >
                <span className="text-xl">←</span>
                <span>Volver al Panel</span>
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Evaluación ABCD - B: Bioquímica</h1>
              <p className="text-green-100 text-sm">Indicadores de laboratorio y marcadores nutricionales</p>
            </div>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Athlete Selection */}
        {athletes.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Seleccionar Deportista</h2>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={selectedAthlete?.id || ''}
              onChange={(e) => {
                const athlete = athletes.find(a => a.id === e.target.value)
                setSelectedAthlete(athlete || null)
              }}
            >
              <option value="">Seleccionar deportista...</option>
              {athletes.map((athlete) => (
                <option key={athlete.id} value={athlete.id}>
                  {athlete.fullName} - {athlete.age} años - {athlete.category}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {selectedAthlete ? (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Evaluación Bioquímica - {selectedAthlete.fullName}
                </h2>
                <div className="flex space-x-6 text-sm text-gray-600">
                  <span>Edad: {selectedAthlete.age} años</span>
                  <span>Género: {selectedAthlete.gender === 'male' ? 'Masculino' : 'Femenino'}</span>
                  <span>Categoría: {selectedAthlete.category}</span>
                  <span>Club: {selectedAthlete.club}</span>
                </div>
              </div>

              <BiochemistryForm
                athleteId={selectedAthlete.id}
                age={selectedAthlete.age}
                gender={selectedAthlete.gender}
                initialData={selectedAthlete.biochemistry}
                onSave={handleSave}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl font-bold">B</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Evaluación Bioquímica
              </h3>
              {athletes.length === 0 ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    No hay deportistas registrados. Primero debe registrar un deportista.
                  </p>
                  <Link
                    href="/"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Ir al Panel Principal
                  </Link>
                </div>
              ) : (
                <p className="text-gray-600">
                  Seleccione un deportista para comenzar la evaluación bioquímica.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 ErgoSanitas - Evaluación ABCD del Estado Nutricional
          </p>
        </div>
      </footer>
    </div>
  )
}
