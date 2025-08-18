"use client"

import { useState, useEffect } from 'react'
import { AnthropometryData } from '@/lib/types'
import { AnthropometryCalculations } from '@/lib/calculations'
import { getGrowthPercentile } from '@/data/references'

interface AnthropometryFormProps {
  athleteId: string
  age: number
  gender: 'male' | 'female'
  initialData?: AnthropometryData
  onSave: (data: AnthropometryData) => void
}

export default function AnthropometryForm({ 
  athleteId, 
  age, 
  gender, 
  initialData, 
  onSave 
}: AnthropometryFormProps) {
  const [formData, setFormData] = useState<Partial<AnthropometryData>>({
    height: initialData?.height || 0,
    weight: initialData?.weight || 0,
    bmi: initialData?.bmi || 0,
    bodyFatPercentage: initialData?.bodyFatPercentage || 0,
    muscleMass: initialData?.muscleMass || 0,
    waistCircumference: initialData?.waistCircumference || 0,
    hipCircumference: initialData?.hipCircumference || 0,
    armCircumference: initialData?.armCircumference || 0,
    skinfoldMeasurements: initialData?.skinfoldMeasurements || {
      triceps: 0,
      biceps: 0,
      subscapular: 0,
      suprailiac: 0
    },
    percentiles: initialData?.percentiles || {
      heightPercentile: 50,
      weightPercentile: 50,
      bmiPercentile: 50
    }
  })

  const [calculations, setCalculations] = useState({
    bmi: 0,
    bmiClassification: '',
    waistHipRatio: 0,
    armMuscleArea: 0,
    estimatedBodyFat: 0,
    leanBodyMass: 0
  })

  // Calcular automáticamente cuando cambien los valores
  useEffect(() => {
    if (formData.height && formData.weight) {
      const bmi = AnthropometryCalculations.calculateBMI(formData.weight, formData.height)
      const bmiClassification = AnthropometryCalculations.classifyBMI(bmi, age, gender)
      
      const heightPercentile = getGrowthPercentile(formData.height, age, gender, 'height')
      const weightPercentile = getGrowthPercentile(formData.weight, age, gender, 'weight')
      const bmiPercentile = Math.round((100 - Math.abs(bmi - 20) * 5))

      let waistHipRatio = 0
      if (formData.waistCircumference && formData.hipCircumference) {
        waistHipRatio = AnthropometryCalculations.calculateWaistHipRatio(
          formData.waistCircumference, 
          formData.hipCircumference
        )
      }

      let armMuscleArea = 0
      if (formData.armCircumference && formData.skinfoldMeasurements?.triceps) {
        armMuscleArea = AnthropometryCalculations.calculateArmMuscleArea(
          formData.armCircumference,
          formData.skinfoldMeasurements.triceps
        )
      }

      let estimatedBodyFat = 0
      if (formData.skinfoldMeasurements?.triceps && 
          formData.skinfoldMeasurements?.biceps &&
          formData.skinfoldMeasurements?.subscapular &&
          formData.skinfoldMeasurements?.suprailiac) {
        estimatedBodyFat = AnthropometryCalculations.estimateBodyFat(
          {
            triceps: formData.skinfoldMeasurements.triceps,
            biceps: formData.skinfoldMeasurements.biceps,
            subscapular: formData.skinfoldMeasurements.subscapular,
            suprailiac: formData.skinfoldMeasurements.suprailiac
          },
          age,
          gender
        )
      }

      let leanBodyMass = 0
      if (formData.weight && formData.bodyFatPercentage) {
        leanBodyMass = AnthropometryCalculations.calculateLeanBodyMass(
          formData.weight,
          formData.bodyFatPercentage
        )
      }

      setFormData(prev => ({
        ...prev,
        bmi,
        percentiles: {
          heightPercentile,
          weightPercentile,
          bmiPercentile
        }
      }))

      setCalculations({
        bmi,
        bmiClassification,
        waistHipRatio,
        armMuscleArea,
        estimatedBodyFat,
        leanBodyMass
      })
    }
  }, [formData.height, formData.weight, formData.waistCircumference, formData.hipCircumference, 
      formData.armCircumference, formData.skinfoldMeasurements, formData.bodyFatPercentage, age, gender])

  const handleInputChange = (field: keyof AnthropometryData, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSkinfoldChange = (field: keyof NonNullable<AnthropometryData['skinfoldMeasurements']>, value: number) => {
    setFormData(prev => ({
      ...prev,
      skinfoldMeasurements: {
        ...prev.skinfoldMeasurements,
        [field]: value
      }
    }))
  }

  const handleSave = () => {
    const completeData: AnthropometryData = {
      height: formData.height || 0,
      weight: formData.weight || 0,
      bmi: formData.bmi || 0,
      bodyFatPercentage: formData.bodyFatPercentage,
      muscleMass: formData.muscleMass,
      waistCircumference: formData.waistCircumference,
      hipCircumference: formData.hipCircumference,
      armCircumference: formData.armCircumference,
      skinfoldMeasurements: formData.skinfoldMeasurements,
      percentiles: formData.percentiles || {
        heightPercentile: 50,
        weightPercentile: 50,
        bmiPercentile: 50
      }
    }
    onSave(completeData)
  }

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return 'text-blue-600'
    if (bmi < 25) return 'text-green-600'
    if (bmi < 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPercentileColor = (percentile: number) => {
    if (percentile < 10) return 'text-red-600'
    if (percentile < 25) return 'text-yellow-600'
    if (percentile > 90) return 'text-red-600'
    return 'text-green-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-blue-800">A: Evaluación Antropométrica</h3>
        <div className="text-sm text-gray-500">
          {age} años • {gender === 'male' ? 'Masculino' : 'Femenino'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de entrada */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-4">Mediciones Básicas</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (cm) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.height || ''}
                  onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
                  placeholder="150.0"
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
                  value={formData.weight || ''}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                  placeholder="45.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  % Grasa Corporal
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.bodyFatPercentage || ''}
                  onChange={(e) => handleInputChange('bodyFatPercentage', parseFloat(e.target.value) || 0)}
                  placeholder="15.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Masa Muscular (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.muscleMass || ''}
                  onChange={(e) => handleInputChange('muscleMass', parseFloat(e.target.value) || 0)}
                  placeholder="30.0"
                />
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-4">Circunferencias (cm)</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cintura
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.waistCircumference || ''}
                  onChange={(e) => handleInputChange('waistCircumference', parseFloat(e.target.value) || 0)}
                  placeholder="70.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cadera
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.hipCircumference || ''}
                  onChange={(e) => handleInputChange('hipCircumference', parseFloat(e.target.value) || 0)}
                  placeholder="85.0"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brazo
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.armCircumference || ''}
                  onChange={(e) => handleInputChange('armCircumference', parseFloat(e.target.value) || 0)}
                  placeholder="25.0"
                />
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-4">Pliegues Cutáneos (mm)</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tríceps
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.skinfoldMeasurements?.triceps || ''}
                  onChange={(e) => handleSkinfoldChange('triceps', parseFloat(e.target.value) || 0)}
                  placeholder="10.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bíceps
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.skinfoldMeasurements?.biceps || ''}
                  onChange={(e) => handleSkinfoldChange('biceps', parseFloat(e.target.value) || 0)}
                  placeholder="8.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subescapular
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.skinfoldMeasurements?.subscapular || ''}
                  onChange={(e) => handleSkinfoldChange('subscapular', parseFloat(e.target.value) || 0)}
                  placeholder="12.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suprailíaco
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.skinfoldMeasurements?.suprailiac || ''}
                  onChange={(e) => handleSkinfoldChange('suprailiac', parseFloat(e.target.value) || 0)}
                  placeholder="15.0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resultados y cálculos */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-4">Cálculos Automáticos</h4>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium">IMC</span>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getBMIColor(calculations.bmi)}`}>
                    {calculations.bmi.toFixed(1)} kg/m²
                  </div>
                  <div className="text-sm text-gray-500">
                    {calculations.bmiClassification}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium">Percentil Altura</span>
                <div className={`text-lg font-bold ${getPercentileColor(formData.percentiles?.heightPercentile || 0)}`}>
                  P{formData.percentiles?.heightPercentile || 0}
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium">Percentil Peso</span>
                <div className={`text-lg font-bold ${getPercentileColor(formData.percentiles?.weightPercentile || 0)}`}>
                  P{formData.percentiles?.weightPercentile || 0}
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium">Percentil IMC</span>
                <div className={`text-lg font-bold ${getPercentileColor(formData.percentiles?.bmiPercentile || 0)}`}>
                  P{formData.percentiles?.bmiPercentile || 0}
                </div>
              </div>

              {calculations.waistHipRatio > 0 && (
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">Índice Cintura/Cadera</span>
                  <div className="text-lg font-bold text-gray-700">
                    {calculations.waistHipRatio.toFixed(2)}
                  </div>
                </div>
              )}

              {calculations.estimatedBodyFat > 0 && (
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">% Grasa Estimado</span>
                  <div className="text-lg font-bold text-gray-700">
                    {calculations.estimatedBodyFat.toFixed(1)}%
                  </div>
                </div>
              )}

              {calculations.leanBodyMass > 0 && (
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">Masa Magra</span>
                  <div className="text-lg font-bold text-gray-700">
                    {calculations.leanBodyMass.toFixed(1)} kg
                  </div>
                </div>
              )}

              {calculations.armMuscleArea > 0 && (
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">Área Muscular Brazo</span>
                  <div className="text-lg font-bold text-gray-700">
                    {calculations.armMuscleArea.toFixed(1)} cm²
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-3">Interpretación</h4>
            <div className="space-y-2 text-sm">
              {calculations.bmi > 0 && (
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-600">•</span>
                  <span>
                    IMC de {calculations.bmi.toFixed(1)} indica: {calculations.bmiClassification}
                  </span>
                </div>
              )}
              
              {formData.percentiles?.heightPercentile && (
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-600">•</span>
                  <span>
                    Altura en percentil {formData.percentiles.heightPercentile} para su edad
                  </span>
                </div>
              )}

              {calculations.waistHipRatio > 0 && (
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-600">•</span>
                  <span>
                    Índice cintura/cadera: {calculations.waistHipRatio > 0.9 ? 'Elevado' : 'Normal'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Guardar Evaluación Antropométrica
        </button>
      </div>
    </div>
  )
}
