"use client"

import { useState, useEffect } from 'react'
import { BiochemistryData } from '@/lib/types'
import { BiochemistryCalculations } from '@/lib/calculations'

interface BiochemistryFormProps {
  athleteId: string
  age: number
  gender: 'male' | 'female'
  initialData?: BiochemistryData
  onSave: (data: BiochemistryData) => void
}

export default function BiochemistryForm({ 
  athleteId, 
  age, 
  gender, 
  initialData, 
  onSave 
}: BiochemistryFormProps) {
  const [formData, setFormData] = useState<Partial<BiochemistryData>>({
    hemoglobin: initialData?.hemoglobin || 0,
    hematocrit: initialData?.hematocrit || 0,
    iron: initialData?.iron || 0,
    ferritin: initialData?.ferritin || 0,
    vitaminD: initialData?.vitaminD || 0,
    vitaminB12: initialData?.vitaminB12 || 0,
    folate: initialData?.folate || 0,
    glucose: initialData?.glucose || 0,
    cholesterol: initialData?.cholesterol || {
      total: 0,
      hdl: 0,
      ldl: 0,
      triglycerides: 0
    },
    proteins: initialData?.proteins || {
      totalProtein: 0,
      albumin: 0,
      prealbumin: 0
    },
    electrolytes: initialData?.electrolytes || {
      sodium: 0,
      potassium: 0,
      calcium: 0,
      magnesium: 0
    },
    lastTestDate: initialData?.lastTestDate || new Date().toISOString().split('T')[0]
  })

  const [analysis, setAnalysis] = useState({
    ironStatus: { status: '', recommendations: [] as string[] },
    lipidProfile: { status: '', risks: [] as string[], recommendations: [] as string[] },
    cardiovascularRisk: 0,
    overallAssessment: ''
  })

  // Analizar automáticamente cuando cambien los valores
  useEffect(() => {
    if (formData.hemoglobin && formData.ferritin) {
      const ironStatus = BiochemistryCalculations.evaluateIronStatus(
        formData.hemoglobin,
        formData.ferritin,
        age,
        gender
      )

      let lipidProfile = { status: '', risks: [] as string[], recommendations: [] as string[] }
      if (formData.cholesterol?.total && formData.cholesterol?.hdl && 
          formData.cholesterol?.ldl && formData.cholesterol?.triglycerides) {
        lipidProfile = BiochemistryCalculations.evaluateLipidProfile({
          total: formData.cholesterol.total,
          hdl: formData.cholesterol.hdl,
          ldl: formData.cholesterol.ldl,
          triglycerides: formData.cholesterol.triglycerides
        })
      }

      let cardiovascularRisk = 0
      if (formData.cholesterol?.total && formData.cholesterol?.hdl) {
        cardiovascularRisk = BiochemistryCalculations.calculateCardiovascularRisk(
          age,
          gender,
          formData.cholesterol.total,
          formData.cholesterol.hdl,
          120, // Presión sistólica por defecto
          false // No fumador por defecto
        )
      }

      setAnalysis({
        ironStatus,
        lipidProfile,
        cardiovascularRisk,
        overallAssessment: generateOverallAssessment(ironStatus, lipidProfile, cardiovascularRisk)
      })
    }
  }, [formData.hemoglobin, formData.ferritin, formData.cholesterol, age, gender])

  const generateOverallAssessment = (ironStatus: any, lipidProfile: any, cvRisk: number) => {
    const issues = []
    if (ironStatus.status !== 'Estado normal de hierro') issues.push('deficiencia de hierro')
    if (lipidProfile.risks.length > 0) issues.push('alteraciones lipídicas')
    if (cvRisk > 10) issues.push('riesgo cardiovascular elevado')

    if (issues.length === 0) return 'Perfil bioquímico normal'
    if (issues.length === 1) return `Se detecta ${issues[0]}`
    return `Se detectan múltiples alteraciones: ${issues.join(', ')}`
  }

  const handleInputChange = (field: keyof BiochemistryData, value: number | string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCholesterolChange = (field: keyof NonNullable<BiochemistryData['cholesterol']>, value: number) => {
    setFormData(prev => ({
      ...prev,
      cholesterol: {
        ...prev.cholesterol,
        [field]: value
      }
    }))
  }

  const handleProteinChange = (field: keyof NonNullable<BiochemistryData['proteins']>, value: number) => {
    setFormData(prev => ({
      ...prev,
      proteins: {
        ...prev.proteins,
        [field]: value
      }
    }))
  }

  const handleElectrolyteChange = (field: keyof NonNullable<BiochemistryData['electrolytes']>, value: number) => {
    setFormData(prev => ({
      ...prev,
      electrolytes: {
        ...prev.electrolytes,
        [field]: value
      }
    }))
  }

  const handleSave = () => {
    const completeData: BiochemistryData = {
      hemoglobin: formData.hemoglobin,
      hematocrit: formData.hematocrit,
      iron: formData.iron,
      ferritin: formData.ferritin,
      vitaminD: formData.vitaminD,
      vitaminB12: formData.vitaminB12,
      folate: formData.folate,
      glucose: formData.glucose,
      cholesterol: formData.cholesterol,
      proteins: formData.proteins,
      electrolytes: formData.electrolytes,
      lastTestDate: formData.lastTestDate || new Date().toISOString().split('T')[0]
    }
    onSave(completeData)
  }

  const getValueColor = (value: number, normal: [number, number]) => {
    if (value < normal[0] || value > normal[1]) return 'text-red-600'
    return 'text-green-600'
  }

  const getRiskColor = (risk: number) => {
    if (risk < 5) return 'text-green-600'
    if (risk < 10) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-green-800">B: Evaluación Bioquímica</h3>
        <div className="text-sm text-gray-500">
          Última prueba: {formData.lastTestDate}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de entrada */}
        <div className="space-y-6">
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-4">Hematología</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hemoglobina (g/dL) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.hemoglobin || ''}
                  onChange={(e) => handleInputChange('hemoglobin', parseFloat(e.target.value) || 0)}
                  placeholder="13.5"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Normal: {gender === 'male' ? '13-17' : '12-16'} g/dL
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hematocrito (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.hematocrit || ''}
                  onChange={(e) => handleInputChange('hematocrit', parseFloat(e.target.value) || 0)}
                  placeholder="42.0"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Normal: {gender === 'male' ? '40-50' : '36-46'}%
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hierro (μg/dL) *
                </label>
                <input
                  type="number"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.iron || ''}
                  onChange={(e) => handleInputChange('iron', parseFloat(e.target.value) || 0)}
                  placeholder="100"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Normal: 70-160 μg/dL
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ferritina (ng/mL) *
                </label>
                <input
                  type="number"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.ferritin || ''}
                  onChange={(e) => handleInputChange('ferritin', parseFloat(e.target.value) || 0)}
                  placeholder="50"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Normal: 15-150 ng/mL
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-4">Vitaminas y Metabolismo</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vitamina D (ng/mL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.vitaminD || ''}
                  onChange={(e) => handleInputChange('vitaminD', parseFloat(e.target.value) || 0)}
                  placeholder="30.0"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Normal: 20-50 ng/mL
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vitamina B12 (pg/mL)
                </label>
                <input
                  type="number"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.vitaminB12 || ''}
                  onChange={(e) => handleInputChange('vitaminB12', parseFloat(e.target.value) || 0)}
                  placeholder="400"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Normal: 200-900 pg/mL
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folato (ng/mL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.folate || ''}
                  onChange={(e) => handleInputChange('folate', parseFloat(e.target.value) || 0)}
                  placeholder="8.0"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Normal: 3-17 ng/mL
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Glucosa (mg/dL)
                </label>
                <input
                  type="number"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.glucose || ''}
                  onChange={(e) => handleInputChange('glucose', parseFloat(e.target.value) || 0)}
                  placeholder="90"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Normal: 70-100 mg/dL
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-4">Perfil Lipídico</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Colesterol Total (mg/dL)
                </label>
                <input
                  type="number"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.cholesterol?.total || ''}
                  onChange={(e) => handleCholesterolChange('total', parseFloat(e.target.value) || 0)}
                  placeholder="180"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Deseable: {'<'}200 mg/dL
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HDL (mg/dL)
                </label>
                <input
                  type="number"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.cholesterol?.hdl || ''}
                  onChange={(e) => handleCholesterolChange('hdl', parseFloat(e.target.value) || 0)}
                  placeholder="50"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Deseable: {'>'}40 mg/dL
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LDL (mg/dL)
                </label>
                <input
                  type="number"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.cholesterol?.ldl || ''}
                  onChange={(e) => handleCholesterolChange('ldl', parseFloat(e.target.value) || 0)}
                  placeholder="100"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Deseable: {'<'}130 mg/dL
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Triglicéridos (mg/dL)
                </label>
                <input
                  type="number"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.cholesterol?.triglycerides || ''}
                  onChange={(e) => handleCholesterolChange('triglycerides', parseFloat(e.target.value) || 0)}
                  placeholder="120"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Deseable: {'<'}150 mg/dL
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="font-semibold text-orange-800 mb-4">Proteínas y Electrolitos</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proteína Total (g/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={formData.proteins?.totalProtein || ''}
                  onChange={(e) => handleProteinChange('totalProtein', parseFloat(e.target.value) || 0)}
                  placeholder="7.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Albúmina (g/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={formData.proteins?.albumin || ''}
                  onChange={(e) => handleProteinChange('albumin', parseFloat(e.target.value) || 0)}
                  placeholder="4.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sodio (mEq/L)
                </label>
                <input
                  type="number"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={formData.electrolytes?.sodium || ''}
                  onChange={(e) => handleElectrolyteChange('sodium', parseFloat(e.target.value) || 0)}
                  placeholder="140"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potasio (mEq/L)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={formData.electrolytes?.potassium || ''}
                  onChange={(e) => handleElectrolyteChange('potassium', parseFloat(e.target.value) || 0)}
                  placeholder="4.0"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Análisis *
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={formData.lastTestDate || ''}
              onChange={(e) => handleInputChange('lastTestDate', e.target.value)}
            />
          </div>
        </div>

        {/* Análisis y resultados */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-4">Análisis Automático</h4>
            
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border-l-4 border-green-500">
                <h5 className="font-medium text-green-800 mb-2">Estado del Hierro</h5>
                <p className="text-sm text-gray-700 mb-2">{analysis.ironStatus.status}</p>
                {analysis.ironStatus.recommendations.length > 0 && (
                  <ul className="text-xs text-gray-600 space-y-1">
                    {analysis.ironStatus.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-600">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                <h5 className="font-medium text-purple-800 mb-2">Perfil Lipídico</h5>
                <p className="text-sm text-gray-700 mb-2">{analysis.lipidProfile.status}</p>
                
                {analysis.lipidProfile.risks.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-red-600 mb-1">Factores de riesgo:</p>
                    <ul className="text-xs text-red-600 space-y-1">
                      {analysis.lipidProfile.risks.map((risk, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span>•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.lipidProfile.recommendations.length > 0 && (
                  <ul className="text-xs text-gray-600 space-y-1">
                    {analysis.lipidProfile.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-purple-600">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="p-4 bg-white rounded-lg border-l-4 border-red-500">
                <h5 className="font-medium text-red-800 mb-2">Riesgo Cardiovascular</h5>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Riesgo estimado a 10 años:</span>
                  <span className={`text-lg font-bold ${getRiskColor(analysis.cardiovascularRisk)}`}>
                    {analysis.cardiovascularRisk.toFixed(1)}%
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {analysis.cardiovascularRisk < 5 ? 'Riesgo bajo' : 
                   analysis.cardiovascularRisk < 10 ? 'Riesgo moderado' : 'Riesgo alto'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-3">Evaluación General</h4>
            <p className="text-sm text-gray-700 mb-3">{analysis.overallAssessment}</p>
            
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-yellow-800">Recomendaciones Generales:</h5>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-600">•</span>
                  <span>Mantener hidratación adecuada antes y después del ejercicio</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-600">•</span>
                  <span>Consumir alimentos ricos en hierro y vitamina C</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-600">•</span>
                  <span>Repetir análisis en 3-6 meses según evolución</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-600">•</span>
                  <span>Consultar con médico deportivo si hay alteraciones</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-3">Alertas</h4>
            <div className="space-y-2 text-sm">
              {formData.hemoglobin && formData.hemoglobin < (gender === 'male' ? 13 : 12) && (
                <div className="flex items-start space-x-2 text-red-600">
                  <span>⚠</span>
                  <span>Hemoglobina por debajo del rango normal</span>
                </div>
              )}
              
              {formData.ferritin && formData.ferritin < 15 && (
                <div className="flex items-start space-x-2 text-red-600">
                  <span>⚠</span>
                  <span>Ferritina baja - riesgo de deficiencia de hierro</span>
                </div>
              )}

              {formData.cholesterol?.total && formData.cholesterol.total > 200 && (
                <div className="flex items-start space-x-2 text-red-600">
                  <span>⚠</span>
                  <span>Colesterol total elevado</span>
                </div>
              )}

              {formData.glucose && (formData.glucose < 70 || formData.glucose > 100) && (
                <div className="flex items-start space-x-2 text-red-600">
                  <span>⚠</span>
                  <span>Glucosa fuera del rango normal</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Guardar Evaluación Bioquímica
        </button>
      </div>
    </div>
  )
}
