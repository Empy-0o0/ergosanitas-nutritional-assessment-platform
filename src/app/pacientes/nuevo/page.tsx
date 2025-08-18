"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Athlete } from '@/lib/types'
import { DataStorage } from '@/lib/storage'
import { AnthropometryCalculations } from '@/lib/calculations'
import { generateId } from '@/lib/utils'

export default function NuevoPacientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    gender: 'male' as 'male' | 'female',
    club: '',
    position: '',
    category: '9-13' as '5-8' | '9-13' | '14-18',
    height: '',
    weight: '',
    // Información adicional
    phone: '',
    email: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    allergies: '',
    medications: '',
    // Información deportiva
    yearsPlaying: '',
    trainingDays: '',
    trainingHours: '',
    competitions: '',
    previousInjuries: '',
    // Información nutricional
    dietaryRestrictions: '',
    supplements: '',
    hydrationHabits: '',
    sleepHours: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Campos obligatorios
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es obligatorio'
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es obligatoria'
    } else {
      const birthDate = new Date(formData.birthDate)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      
      if (age < 5 || age > 25) {
        newErrors.birthDate = 'La edad debe estar entre 5 y 25 años'
      }
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

    // Validar email si se proporciona
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no tiene un formato válido'
    }

    // Validar teléfonos si se proporcionan
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos'
    }

    if (formData.emergencyPhone && !/^\d{10}$/.test(formData.emergencyPhone.replace(/\D/g, ''))) {
      newErrors.emergencyPhone = 'El teléfono de emergencia debe tener 10 dígitos'
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
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const height = parseFloat(formData.height)
      const weight = parseFloat(formData.weight)
      const age = calculateAge(formData.birthDate)
      const bmi = AnthropometryCalculations.calculateBMI(weight, height)
      const category = determineCategory(age)

      const newAthlete: Athlete = {
        id: generateId(),
        fullName: formData.fullName.trim(),
        birthDate: formData.birthDate,
        age,
        gender: formData.gender,
        club: formData.club.trim(),
        position: formData.position.trim(),
        category,
        evaluationDate: new Date().toISOString().split('T')[0],
        nutritionalStatus: 'normal',
        lastEvaluation: new Date().toISOString().split('T')[0],
        anthropometry: {
          height,
          weight,
          bmi: parseFloat(bmi.toFixed(1)),
          percentiles: {
            heightPercentile: 50, // Se calculará en evaluación completa
            weightPercentile: 50,
            bmiPercentile: 50
          }
        },
        // Información adicional
        contactInfo: {
          phone: formData.phone,
          email: formData.email,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone
        },
        medicalInfo: {
          medicalHistory: formData.medicalHistory,
          allergies: formData.allergies,
          medications: formData.medications,
          previousInjuries: formData.previousInjuries
        },
        sportsInfo: {
          yearsPlaying: formData.yearsPlaying ? parseInt(formData.yearsPlaying) : undefined,
          trainingDays: formData.trainingDays ? parseInt(formData.trainingDays) : undefined,
          trainingHours: formData.trainingHours ? parseFloat(formData.trainingHours) : undefined,
          competitions: formData.competitions
        },
        nutritionalInfo: {
          dietaryRestrictions: formData.dietaryRestrictions,
          supplements: formData.supplements,
          hydrationHabits: formData.hydrationHabits,
          sleepHours: formData.sleepHours ? parseFloat(formData.sleepHours) : undefined
        }
      }

      DataStorage.saveAthlete(newAthlete)
      
      alert('Paciente registrado exitosamente')
      router.push(`/pacientes/${newAthlete.id}`)
      
    } catch (error) {
      console.error('Error saving athlete:', error)
      alert('Error al guardar el paciente. Por favor intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Auto-calcular categoría cuando cambie la fecha de nacimiento
    if (field === 'birthDate' && value) {
      const age = calculateAge(value)
      const category = determineCategory(age)
      setFormData(prev => ({ ...prev, category }))
    }
  }

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
              <h1 className="text-2xl font-bold">Nuevo Paciente</h1>
              <p className="text-blue-100 text-sm">Registro completo de deportista</p>
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Ej: Juan Pérez López"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Ej: 5551234567"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Ej: juan@email.com"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="Ej: María Pérez (Madre)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono de Emergencia
                </label>
                <input
                  type="tel"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  placeholder="Ej: 5559876543"
                />
                {errors.emergencyPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.club ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.club}
                  onChange={(e) => handleInputChange('club', e.target.value)}
                  placeholder="Nombre del club o equipo"
                />
                {errors.club && <p className="text-red-500 text-sm mt-1">{errors.club}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posición *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.position ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="Ej: Mediocampista, Delantero"
                />
                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Años Jugando
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.yearsPlaying}
                  onChange={(e) => handleInputChange('yearsPlaying', e.target.value)}
                  placeholder="Ej: 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días de Entrenamiento por Semana
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.trainingDays}
                  onChange={(e) => handleInputChange('trainingDays', e.target.value)}
                  placeholder="Ej: 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horas de Entrenamiento por Día
                </label>
                <input
                  type="number"
                  min="0.5"
                  max="8"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.trainingHours}
                  onChange={(e) => handleInputChange('trainingHours', e.target.value)}
                  placeholder="Ej: 2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Competencias/Torneos
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.competitions}
                  onChange={(e) => handleInputChange('competitions', e.target.value)}
                  placeholder="Ej: Liga Local, Torneo Regional"
                />
              </div>
            </div>
          </div>

          {/* Medidas Antropométricas */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Medidas Antropométricas Básicas
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.height ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="Ej: 150"
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.weight ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="Ej: 45.5"
                />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
              </div>
            </div>

            {formData.height && formData.weight && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
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

          {/* Información Médica */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Información Médica
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Historial Médico
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                  placeholder="Enfermedades previas, cirugías, condiciones médicas relevantes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alergias
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="Alergias alimentarias, medicamentos, otros..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicamentos Actuales
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.medications}
                  onChange={(e) => handleInputChange('medications', e.target.value)}
                  placeholder="Medicamentos que toma actualmente..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesiones Previas
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.previousInjuries}
                  onChange={(e) => handleInputChange('previousInjuries', e.target.value)}
                  placeholder="Lesiones deportivas previas, rehabilitación..."
                />
              </div>
            </div>
          </div>

          {/* Información Nutricional */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Información Nutricional y Hábitos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restricciones Dietéticas
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                  placeholder="Vegetariano, vegano, intolerancias..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suplementos Actuales
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.supplements}
                  onChange={(e) => handleInputChange('supplements', e.target.value)}
                  placeholder="Vitaminas, proteínas, otros suplementos..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hábitos de Hidratación
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.hydrationHabits}
                  onChange={(e) => handleInputChange('hydrationHabits', e.target.value)}
                  placeholder="Cantidad de agua diaria, bebidas deportivas..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horas de Sueño por Noche
                </label>
                <input
                  type="number"
                  min="4"
                  max="12"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.sleepHours}
                  onChange={(e) => handleInputChange('sleepHours', e.target.value)}
                  placeholder="Ej: 8"
                />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/pacientes"
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{loading ? 'Guardando...' : 'Registrar Paciente'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 ErgoSanitas - Registro de Nuevo Paciente
          </p>
        </div>
      </footer>
    </div>
  )
}
