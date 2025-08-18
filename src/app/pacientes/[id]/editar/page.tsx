"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Athlete } from '@/lib/types'
import { DataStorage } from '@/lib/storage'
import { AnthropometryCalculations } from '@/lib/calculations'

export default function EditarPacientePage() {
  const params = useParams()
  const router = useRouter()
  const athleteId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [athlete, setAthlete] = useState<Athlete | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    gender: 'male' as 'male' | 'female',
    club: '',
    position: '',
    category: '9-13' as '5-8' | '9-13' | '14-18',
    height: '',
    weight: '',
    phone: '',
    email: '',
    emergencyContact: '',
    emergencyPhone: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (athleteId) {
      const loadedAthlete = DataStorage.getAthleteById(athleteId)
      if (loadedAthlete) {
        setAthlete(loadedAthlete)
        setFormData({
          fullName: loadedAthlete.fullName,
          birthDate: loadedAthlete.birthDate,
          gender: loadedAthlete.gender,
          club: loadedAthlete.club,
          position: loadedAthlete.position,
          category: loadedAthlete.category,
          height: loadedAthlete.anthropometry?.height?.toString() || '',
          weight: loadedAthlete.anthropometry?.weight?.toString() || '',
          phone: loadedAthlete.contactInfo?.phone || '',
          email: loadedAthlete.contactInfo?.email || '',
          emergencyContact: loadedAthlete.contactInfo?.emergencyContact || '',
          emergencyPhone: loadedAthlete.contactInfo?.emergencyPhone || ''
        })
      }
      setLoading(false)
    }
  }, [athleteId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es obligatorio'
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es obligatoria'
    }

    if (!formData.height || parseFloat(formData.height) <= 0) {
      newErrors.height = 'La altura debe ser un número positivo'
    }

    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'El peso debe ser un número positivo'
    }

    if (!formData.club.trim()) {
      newErrors.club = 'El club es obligatorio'
    }

    if (!formData.position.trim()) {
      newErrors.position = 'La posición es obligatoria'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no tiene un formato válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  const determineCategory = (age: number): '5-8' | '9-13' | '14-18' => {
    if (age >= 5 && age <= 8) return '5-8'
    if (age >= 9 && age <= 13) return '9-13'
    return '14-18'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !athlete) {
      return
    }

    setSaving(true)

    try {
      const height = parseFloat(formData.height)
      const weight = parseFloat(formData.weight)
      const age = calculateAge(formData.birthDate)
      const bmi = AnthropometryCalculations.calculateBMI(weight, height)
      const category = determineCategory(age)

      const updatedAthlete: Athlete = {
        ...athlete,
        fullName: formData.fullName.trim(),
        birthDate: formData.birthDate,
        age,
        gender: formData.gender,
        club: formData.club.trim(),
        position: formData.position.trim(),
        category,
        anthropometry: {
          ...athlete.anthropometry,
          height,
          weight,
          bmi: parseFloat(bmi.toFixed(1))
        },
        contactInfo: {
          phone: formData.phone,
          email: formData.email,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone
        }
      }

      DataStorage.saveAthlete(updatedAthlete)
      
      alert('Paciente actualizado exitosamente')
      router.push(`/pacientes/${athlete.id}`)
      
    } catch (error) {
      console.error('Error updating athlete:', error)
      alert('Error al actualizar el paciente. Por favor intente nuevamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    if (field === 'birthDate' && value) {
      const age = calculateAge(value)
      const category = determineCategory(age)
      setFormData(prev => ({ ...prev, category }))
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/pacientes/${athlete.id}`} 
                className="text-white hover:text-green-200 transition-colors flex items-center space-x-2"
              >
                <span className="text-xl">←</span>
                <span>Volver al Perfil</span>
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Editar Paciente</h1>
              <p className="text-green-100 text-sm">{athlete.fullName}</p>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Personal */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Información Personal
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.birthDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                />
                {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría (Auto-calculada)
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  value={formData.category}
                  disabled
                >
                  <option value="5-8">5-8 años (Iniciación)</option>
                  <option value="9-13">9-13 años (Desarrollo)</option>
                  <option value="14-18">14-18 años (Rendimiento)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Contacto de Emergencia */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Contacto de Emergencia
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Contacto
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono de Emergencia
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Información Deportiva */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Información Deportiva
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Club/Equipo *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.club ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.club}
                  onChange={(e) => handleInputChange('club', e.target.value)}
                />
                {errors.club && <p className="text-red-500 text-sm mt-1">{errors.club}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posición *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.position ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                />
                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
              </div>
            </div>
          </div>

          {/* Medidas Antropométricas */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Medidas Antropométricas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (cm) *
                </label>
                <input
                  type="number"
                  min="50"
                  max="250"
                  step="0.1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.height ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  min="10"
                  max="200"
                  step="0.1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.weight ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
              </div>
            </div>

            {formData.height && formData.weight && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>IMC Calculado:</strong> {
                    AnthropometryCalculations.calculateBMI(
                      parseFloat(formData.weight), 
                      parseFloat(formData.height)
                    ).toFixed(1)
                  } kg/m²
                </p>
              </div>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4">
            <Link
              href={`/pacientes/${athlete.id}`}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {saving && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{saving ? 'Guardando...' : 'Actualizar Paciente'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 ErgoSanitas - Editar Paciente
          </p>
        </div>
      </footer>
    </div>
  )
}
