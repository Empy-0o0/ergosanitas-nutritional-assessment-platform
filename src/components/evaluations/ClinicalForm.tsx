"use client"

import { useState, useEffect } from 'react'
import { ClinicalData } from '@/lib/types'
import { ClinicalCalculations } from '@/lib/calculations'

interface ClinicalFormProps {
  athleteId: string
  age: number
  gender: 'male' | 'female'
  initialData?: ClinicalData
  onSave: (data: ClinicalData) => void
}

export default function ClinicalForm({ 
  athleteId, 
  age, 
  gender, 
  initialData, 
  onSave 
}: ClinicalFormProps) {
  const [formData, setFormData] = useState<Partial<ClinicalData>>({
    vitalSigns: initialData?.vitalSigns || {
      bloodPressure: { systolic: 0, diastolic: 0 },
      heartRate: 0,
      respiratoryRate: 0,
      temperature: 36.5
    },
    physicalExamination: initialData?.physicalExamination || {
      generalAppearance: '',
      skinCondition: '',
      oralHealth: '',
      lymphNodes: '',
      edema: false,
      dehydrationSigns: false
    },
    functionalAssessment: initialData?.functionalAssessment || {
      energyLevel: 'normal',
      sleepQuality: 'good',
      digestiveSymptoms: [],
      appetiteLevel: 'good',
      fatigueLevel: 'none'
    },
    medicalHistory: initialData?.medicalHistory || {
      allergies: [],
      medications: [],
      chronicConditions: [],
      injuries: []
    },
    performanceMetrics: initialData?.performanceMetrics || {
      vo2Max: 0,
      strength: 0,
      endurance: 0,
      flexibility: 0,
      speed: 0
    }
  })

  const [analysis, setAnalysis] = useState({
    bloodPressureStatus: '',
    heartRateStatus: '',
    targetHeartRate: { target: 0, range: [0, 0] as [number, number] },
    hydrationStatus: { status: '', level: 0, recommendations: [] as string[] },
    recoveryStatus: { status: '', percentage: 0, recommendations: [] as string[] },
    overallAssessment: ''
  })

  // Analizar automáticamente cuando cambien los valores
  useEffect(() => {
    const vitalSigns = formData.vitalSigns
    if (vitalSigns?.bloodPressure.systolic && vitalSigns?.heartRate) {
      // Evaluar presión arterial
      let bpStatus = 'Normal'
      if (vitalSigns.bloodPressure.systolic > 130 || vitalSigns.bloodPressure.diastolic > 85) {
        bpStatus = 'Elevada'
      } else if (vitalSigns.bloodPressure.systolic < 90 || vitalSigns.bloodPressure.diastolic < 60) {
        bpStatus = 'Baja'
      }

      // Evaluar frecuencia cardíaca
      let hrStatus = 'Normal'
      if (vitalSigns.heartRate > 100) {
        hrStatus = 'Taquicardia'
      } else if (vitalSigns.heartRate < 60) {
        hrStatus = age > 16 ? 'Bradicardia (normal en atletas)' : 'Bradicardia'
      }

      // Calcular frecuencia cardíaca objetivo
      const targetHR = ClinicalCalculations.calculateTargetHeartRate(age, vitalSigns.heartRate, 0.7)

      // Evaluar hidratación (simulado)
      const hydrationStatus = ClinicalCalculations.evaluateHydrationStatus(
        1.015, // Densidad urinaria simulada
        1, // Turgor cutáneo simulado
        formData.physicalExamination?.dehydrationSigns ? 'dry' : 'normal'
      )

      // Evaluar recuperación (simulado)
      const recoveryStatus = ClinicalCalculations.evaluateRecovery(
        vitalSigns.heartRate,
        vitalSigns.heartRate + 10, // FC actual simulada
        30 // Tiempo post-ejercicio simulado
      )

      setAnalysis({
        bloodPressureStatus: bpStatus,
        heartRateStatus: hrStatus,
        targetHeartRate: targetHR,
        hydrationStatus,
        recoveryStatus,
        overallAssessment: generateOverallAssessment(bpStatus, hrStatus, hydrationStatus, recoveryStatus)
      })
    }
  }, [formData.vitalSigns, formData.physicalExamination, age])

  const generateOverallAssessment = (bpStatus: string, hrStatus: string, hydrationStatus: any, recoveryStatus: any) => {
    const issues = []
    if (bpStatus !== 'Normal') issues.push(`presión arterial ${bpStatus.toLowerCase()}`)
    if (hrStatus !== 'Normal' && !hrStatus.includes('normal en atletas')) issues.push(hrStatus.toLowerCase())
    if (hydrationStatus.level < 80) issues.push('deshidratación')
    if (recoveryStatus.percentage < 70) issues.push('recuperación deficiente')

    if (issues.length === 0) return 'Evaluación clínica normal'
    if (issues.length === 1) return `Se detecta ${issues[0]}`
    return `Se detectan: ${issues.join(', ')}`
  }

  const handleVitalSignChange = (field: keyof ClinicalData['vitalSigns'], value: number | { systolic: number; diastolic: number }) => {
    setFormData(prev => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns!,
        [field]: value
      }
    }))
  }

  const handlePhysicalExamChange = (field: keyof ClinicalData['physicalExamination'], value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      physicalExamination: {
        ...prev.physicalExamination!,
        [field]: value
      }
    }))
  }

  const handleFunctionalChange = (field: keyof ClinicalData['functionalAssessment'], value: any) => {
    setFormData(prev => ({
      ...prev,
      functionalAssessment: {
        ...prev.functionalAssessment!,
        [field]: value
      }
    }))
  }

  const handlePerformanceChange = (field: keyof NonNullable<ClinicalData['performanceMetrics']>, value: number) => {
    setFormData(prev => ({
      ...prev,
      performanceMetrics: {
        ...prev.performanceMetrics!,
        [field]: value
      }
    }))
  }

  const handleArrayChange = (category: 'allergies' | 'medications' | 'chronicConditions' | 'injuries', value: string) => {
    if (!value.trim()) return
    
    setFormData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory!,
        [category]: [...(prev.medicalHistory![category] || []), value.trim()]
      }
    }))
  }

  const removeArrayItem = (category: 'allergies' | 'medications' | 'chronicConditions' | 'injuries', index: number) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory!,
        [category]: prev.medicalHistory![category]?.filter((_, i) => i !== index) || []
      }
    }))
  }

  const handleSave = () => {
    const completeData: ClinicalData = {
      vitalSigns: formData.vitalSigns || {
        bloodPressure: { systolic: 0, diastolic: 0 },
        heartRate: 0,
        respiratoryRate: 0,
        temperature: 36.5
      },
      physicalExamination: formData.physicalExamination || {
        generalAppearance: '',
        skinCondition: '',
        oralHealth: '',
        lymphNodes: '',
        edema: false,
        dehydrationSigns: false
      },
      functionalAssessment: formData.functionalAssessment || {
        energyLevel: 'normal',
        sleepQuality: 'good',
        digestiveSymptoms: [],
        appetiteLevel: 'good',
        fatigueLevel: 'none'
      },
      medicalHistory: formData.medicalHistory || {
        allergies: [],
        medications: [],
        chronicConditions: [],
        injuries: []
      },
      performanceMetrics: formData.performanceMetrics
    }
    onSave(completeData)
  }

  const getVitalSignColor = (value: number, normal: [number, number]) => {
    if (value < normal[0] || value > normal[1]) return 'text-red-600'
    return 'text-green-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-orange-800">C: Evaluación Clínica</h3>
        <div className="text-sm text-gray-500">
          {age} años • Evaluación funcional y signos vitales
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de entrada */}
        <div className="space-y-6">
          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="font-semibold text-orange-800 mb-4">Signos Vitales</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presión Sistólica (mmHg) *
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={formData.vitalSigns?.bloodPressure.systolic || ''}
                  onChange={(e) => handleVitalSignChange('bloodPressure', {
                    systolic: parseFloat(e.target.value) || 0,
                    diastolic: formData.vitalSigns?.bloodPressure.diastolic || 0
                  })}
                  placeholder="120"
                />
                <div className="text-xs text-gray-500 mt-1">Normal: 90-130 mmHg</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presión Diastólica (mmHg) *
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={formData.vitalSigns?.bloodPressure.diastolic || ''}
                  onChange={(e) => handleVitalSignChange('bloodPressure', {
                    systolic: formData.vitalSigns?.bloodPressure.systolic || 0,
                    diastolic: parseFloat(e.target.value) || 0
                  })}
                  placeholder="80"
                />
                <div className="text-xs text-gray-500 mt-1">Normal: 60-85 mmHg</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frecuencia Cardíaca (lpm) *
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={formData.vitalSigns?.heartRate || ''}
                  onChange={(e) => handleVitalSignChange('heartRate', parseFloat(e.target.value) || 0)}
                  placeholder="70"
                />
                <div className="text-xs text-gray-500 mt-1">Normal: 60-100 lpm</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frecuencia Respiratoria (rpm)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={formData.vitalSigns?.respiratoryRate || ''}
                  onChange={(e) => handleVitalSignChange('respiratoryRate', parseFloat(e.target.value) || 0)}
                  placeholder="16"
                />
                <div className="text-xs text-gray-500 mt-1">Normal: 12-20 rpm</div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperatura (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={formData.vitalSigns?.temperature || ''}
                  onChange={(e) => handleVitalSignChange('temperature', parseFloat(e.target.value) || 36.5)}
                  placeholder="36.5"
                />
                <div className="text-xs text-gray-500 mt-1">Normal: 36.0-37.5°C</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-4">Examen Físico</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apariencia General
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.physicalExamination?.generalAppearance || ''}
                  onChange={(e) => handlePhysicalExamChange('generalAppearance', e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="excelente">Excelente</option>
                  <option value="buena">Buena</option>
                  <option value="regular">Regular</option>
                  <option value="deficiente">Deficiente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condición de la Piel
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.physicalExamination?.skinCondition || ''}
                  onChange={(e) => handlePhysicalExamChange('skinCondition', e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="normal">Normal</option>
                  <option value="seca">Seca</option>
                  <option value="palida">Pálida</option>
                  <option value="cianosis">Cianosis</option>
                  <option value="lesiones">Lesiones</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salud Oral
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.physicalExamination?.oralHealth || ''}
                  onChange={(e) => handlePhysicalExamChange('oralHealth', e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="excelente">Excelente</option>
                  <option value="buena">Buena</option>
                  <option value="caries">Caries</option>
                  <option value="gingivitis">Gingivitis</option>
                  <option value="problemas_ortodonticos">Problemas Ortodónticos</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edema"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={formData.physicalExamination?.edema || false}
                    onChange={(e) => handlePhysicalExamChange('edema', e.target.checked)}
                  />
                  <label htmlFor="edema" className="text-sm font-medium text-gray-700">
                    Edema presente
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="dehydration"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={formData.physicalExamination?.dehydrationSigns || false}
                    onChange={(e) => handlePhysicalExamChange('dehydrationSigns', e.target.checked)}
                  />
                  <label htmlFor="dehydration" className="text-sm font-medium text-gray-700">
                    Signos de deshidratación
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-4">Evaluación Funcional</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de Energía
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.functionalAssessment?.energyLevel || ''}
                  onChange={(e) => handleFunctionalChange('energyLevel', e.target.value)}
                >
                  <option value="low">Bajo</option>
                  <option value="normal">Normal</option>
                  <option value="high">Alto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calidad del Sueño
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.functionalAssessment?.sleepQuality || ''}
                  onChange={(e) => handleFunctionalChange('sleepQuality', e.target.value)}
                >
                  <option value="poor">Pobre</option>
                  <option value="fair">Regular</option>
                  <option value="good">Buena</option>
                  <option value="excellent">Excelente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de Apetito
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.functionalAssessment?.appetiteLevel || ''}
                  onChange={(e) => handleFunctionalChange('appetiteLevel', e.target.value)}
                >
                  <option value="poor">Pobre</option>
                  <option value="fair">Regular</option>
                  <option value="good">Bueno</option>
                  <option value="excellent">Excelente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de Fatiga
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.functionalAssessment?.fatigueLevel || ''}
                  onChange={(e) => handleFunctionalChange('fatigueLevel', e.target.value)}
                >
                  <option value="none">Ninguna</option>
                  <option value="mild">Leve</option>
                  <option value="moderate">Moderada</option>
                  <option value="severe">Severa</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-4">Métricas de Rendimiento</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VO2 Max (ml/kg/min)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.performanceMetrics?.vo2Max || ''}
                  onChange={(e) => handlePerformanceChange('vo2Max', parseFloat(e.target.value) || 0)}
                  placeholder="45.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuerza (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.performanceMetrics?.strength || ''}
                  onChange={(e) => handlePerformanceChange('strength', parseFloat(e.target.value) || 0)}
                  placeholder="7"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resistencia (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.performanceMetrics?.endurance || ''}
                  onChange={(e) => handlePerformanceChange('endurance', parseFloat(e.target.value) || 0)}
                  placeholder="8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flexibilidad (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.performanceMetrics?.flexibility || ''}
                  onChange={(e) => handlePerformanceChange('flexibility', parseFloat(e.target.value) || 0)}
                  placeholder="6"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Análisis y resultados */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-4">Análisis Clínico</h4>
            
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border-l-4 border-orange-500">
                <h5 className="font-medium text-orange-800 mb-2">Signos Vitales</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Presión Arterial:</span>
                    <span className={analysis.bloodPressureStatus === 'Normal' ? 'text-green-600' : 'text-red-600'}>
                      {analysis.bloodPressureStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frecuencia Cardíaca:</span>
                    <span className={analysis.heartRateStatus === 'Normal' ? 'text-green-600' : 'text-yellow-600'}>
                      {analysis.heartRateStatus}
                    </span>
                  </div>
                  {analysis.targetHeartRate.target > 0 && (
                    <div className="flex justify-between">
                      <span>FC Objetivo (70%):</span>
                      <span className="text-blue-600">
                        {analysis.targetHeartRate.target} lpm
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
                <h5 className="font-medium text-blue-800 mb-2">Estado de Hidratación</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Estado:</span>
                    <span className={analysis.hydrationStatus.level > 80 ? 'text-green-600' : 'text-yellow-600'}>
                      {analysis.hydrationStatus.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nivel:</span>
                    <span className="text-blue-600">
                      {analysis.hydrationStatus.level}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border-l-4 border-green-500">
                <h5 className="font-medium text-green-800 mb-2">Capacidad de Recuperación</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Estado:</span>
                    <span className={analysis.recoveryStatus.percentage > 80 ? 'text-green-600' : 'text-yellow-600'}>
                      {analysis.recoveryStatus.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Porcentaje:</span>
                    <span className="text-green-600">
                      {analysis.recoveryStatus.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-3">Evaluación General</h4>
            <p className="text-sm text-gray-700 mb-3">{analysis.overallAssessment}</p>
            
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-yellow-800">Recomendaciones:</h5>
              <ul className="text-xs text-gray-600 space-y-1">
                {analysis.hydrationStatus.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-600">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
                {analysis.recoveryStatus.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-600">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-600">•</span>
                  <span>Monitorear signos vitales regularmente</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-600">•</span>
                  <span>Mantener rutina de calentamiento y enfriamiento</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-3">Alertas Clínicas</h4>
            <div className="space-y-2 text-sm">
              {formData.vitalSigns?.bloodPressure.systolic && 
               (formData.vitalSigns.bloodPressure.systolic > 130 || formData.vitalSigns.bloodPressure.systolic < 90) && (
                <div className="flex items-start space-x-2 text-red-600">
                  <span>⚠</span>
                  <span>Presión arterial fuera del rango normal</span>
                </div>
              )}
              
              {formData.vitalSigns?.heartRate && 
               (formData.vitalSigns.heartRate > 100 || formData.vitalSigns.heartRate < 60) && (
                <div className="flex items-start space-x-2 text-red-600">
                  <span>⚠</span>
                  <span>Frecuencia cardíaca anormal</span>
                </div>
              )}

              {formData.physicalExamination?.dehydrationSigns && (
                <div className="flex items-start space-x-2 text-red-600">
                  <span>⚠</span>
                  <span>Signos de deshidratación detectados</span>
                </div>
              )}

              {formData.functionalAssessment?.fatigueLevel === 'severe' && (
                <div className="flex items-start space-x-2 text-red-600">
                  <span>⚠</span>
                  <span>Nivel de fatiga severo</span>
                </div>
              )}

              {formData.functionalAssessment?.sleepQuality === 'poor' && (
                <div className="flex items-start space-x-2 text-red-600">
                  <span>⚠</span>
                  <span>Calidad de sueño deficiente</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-800 mb-3">Historial Médico</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alergias
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.medicalHistory?.allergies?.map((allergy, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                      {allergy}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('allergies', index)}
                        className="ml-1 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Agregar alergia..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleArrayChange('allergies', e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicamentos
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.medicalHistory?.medications?.map((medication, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {medication}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('medications', index)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Agregar medicamento..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleArrayChange('medications', e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesiones Previas
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.medicalHistory?.injuries?.map((injury, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      {injury}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('injuries', index)}
                        className="ml-1 text-yellow-600 hover:text-yellow-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Agregar lesión..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleArrayChange('injuries', e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Guardar Evaluación Clínica
        </button>
      </div>
    </div>
  )
}
