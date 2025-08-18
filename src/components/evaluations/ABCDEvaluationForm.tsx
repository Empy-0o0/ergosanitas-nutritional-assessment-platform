"use client"

import { useState, useEffect } from 'react'
import { Athlete, ABCDEvaluation, AnthropometryData, BiochemistryData, ClinicalData, DieteticsData } from '@/lib/types'
import { DataStorage } from '@/lib/storage'
import { ABCDEvaluator } from '@/lib/calculations'
import { generateId } from '@/lib/utils'

import AnthropometryForm from './AnthropometryForm'
import BiochemistryForm from './BiochemistryForm'
import ClinicalForm from './ClinicalForm'
import DieteticsForm from './DieteticsForm'

interface ABCDEvaluationFormProps {
  athlete: Athlete
  onClose: () => void
  onSave: (evaluation: ABCDEvaluation) => void
}

export default function ABCDEvaluationForm({ athlete, onClose, onSave }: ABCDEvaluationFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [evaluationData, setEvaluationData] = useState<Partial<ABCDEvaluation>>({
    id: generateId(),
    athleteId: athlete.id,
    date: new Date().toISOString().split('T')[0],
    evaluator: 'Dr. Nutricionista Deportivo',
    followUpDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 3 meses
  })

  const [completedSections, setCompletedSections] = useState({
    anthropometry: false,
    biochemistry: false,
    clinical: false,
    dietetics: false
  })

  const steps = [
    {
      id: 'anthropometry',
      title: 'A: Antropometría',
      description: 'Mediciones corporales y composición',
      color: 'blue',
      icon: '📏'
    },
    {
      id: 'biochemistry',
      title: 'B: Bioquímica',
      description: 'Análisis de laboratorio',
      color: 'green',
      icon: '🧪'
    },
    {
      id: 'clinical',
      title: 'C: Clínica',
      description: 'Evaluación funcional y signos',
      color: 'orange',
      icon: '🩺'
    },
    {
      id: 'dietetics',
      title: 'D: Dietética',
      description: 'Hábitos alimentarios',
      color: 'purple',
      icon: '🍎'
    }
  ]

  const handleAnthropometryData = (data: AnthropometryData) => {
    setEvaluationData(prev => ({
      ...prev,
      anthropometry: data
    }))
    setCompletedSections(prev => ({ ...prev, anthropometry: true }))
  }

  const handleBiochemistryData = (data: BiochemistryData) => {
    setEvaluationData(prev => ({
      ...prev,
      biochemistry: data
    }))
    setCompletedSections(prev => ({ ...prev, biochemistry: true }))
  }

  const handleClinicalData = (data: ClinicalData) => {
    setEvaluationData(prev => ({
      ...prev,
      clinical: data
    }))
    setCompletedSections(prev => ({ ...prev, clinical: true }))
  }

  const handleDieteticsData = (data: DieteticsData) => {
    setEvaluationData(prev => ({
      ...prev,
      dietetics: data
    }))
    setCompletedSections(prev => ({ ...prev, dietetics: true }))
  }

  const handleFinalSave = () => {
    if (!evaluationData.anthropometry || !evaluationData.biochemistry || 
        !evaluationData.clinical || !evaluationData.dietetics) {
      alert('Por favor complete todas las secciones ABCD antes de guardar')
      return
    }

    // Generar evaluación integral
    const overallAssessment = ABCDEvaluator.evaluateOverallStatus(
      evaluationData.anthropometry,
      evaluationData.biochemistry,
      evaluationData.clinical,
      evaluationData.dietetics,
      athlete.age,
      athlete.gender
    )

    const completeEvaluation: ABCDEvaluation = {
      id: evaluationData.id!,
      athleteId: evaluationData.athleteId!,
      date: evaluationData.date!,
      evaluator: evaluationData.evaluator!,
      anthropometry: evaluationData.anthropometry,
      biochemistry: evaluationData.biochemistry,
      clinical: evaluationData.clinical,
      dietetics: evaluationData.dietetics,
      overallAssessment: {
        nutritionalStatus: overallAssessment.status,
        riskFactors: overallAssessment.riskFactors,
        strengths: overallAssessment.strengths,
        recommendations: overallAssessment.recommendations
      },
      followUpDate: evaluationData.followUpDate!
    }

    // Guardar en storage
    DataStorage.saveEvaluation(completeEvaluation)

    // Actualizar estado nutricional del atleta
    const nutritionalStatus: 'normal' | 'warning' | 'danger' = 
      overallAssessment.status === 'optimal' ? 'normal' : 
      overallAssessment.status === 'adequate' ? 'normal' :
      overallAssessment.status === 'at-risk' ? 'warning' : 'danger'

    const updatedAthlete: Athlete = {
      ...athlete,
      nutritionalStatus,
      lastEvaluation: completeEvaluation.date,
      anthropometry: evaluationData.anthropometry,
      biochemistry: evaluationData.biochemistry,
      clinical: evaluationData.clinical,
      dietetics: evaluationData.dietetics
    }

    DataStorage.saveAthlete(updatedAthlete)

    onSave(completeEvaluation)
  }

  const getStepColor = (stepIndex: number, stepId: string) => {
    if (completedSections[stepId as keyof typeof completedSections]) {
      return 'bg-green-500 text-white'
    }
    if (stepIndex === currentStep) {
      return `bg-${steps[stepIndex].color}-500 text-white`
    }
    if (stepIndex < currentStep) {
      return 'bg-gray-300 text-gray-600'
    }
    return 'bg-gray-100 text-gray-400'
  }

  const canProceedToNext = () => {
    const currentStepId = steps[currentStep].id
    return completedSections[currentStepId as keyof typeof completedSections]
  }

  const allSectionsCompleted = Object.values(completedSections).every(Boolean)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Evaluación ABCD del Estado Nutricional</h2>
              <p className="text-blue-100 mt-1">
                {athlete.fullName} • {athlete.age} años • {athlete.category}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${getStepColor(index, step.id)}`}
                  >
                    {completedSections[step.id as keyof typeof completedSections] ? '✓' : step.icon}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{step.title}</div>
                    <div className="text-sm text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="mx-4 w-8 h-0.5 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          {currentStep === 0 && (
            <AnthropometryForm
              athleteId={athlete.id}
              age={athlete.age}
              gender={athlete.gender}
              initialData={evaluationData.anthropometry}
              onSave={handleAnthropometryData}
            />
          )}

          {currentStep === 1 && (
            <BiochemistryForm
              athleteId={athlete.id}
              age={athlete.age}
              gender={athlete.gender}
              initialData={evaluationData.biochemistry}
              onSave={handleBiochemistryData}
            />
          )}

          {currentStep === 2 && (
            <ClinicalForm
              athleteId={athlete.id}
              age={athlete.age}
              gender={athlete.gender}
              initialData={evaluationData.clinical}
              onSave={handleClinicalData}
            />
          )}

          {currentStep === 3 && (
            <DieteticsForm
              athleteId={athlete.id}
              age={athlete.age}
              gender={athlete.gender}
              weight={athlete.anthropometry?.weight || evaluationData.anthropometry?.weight || 50}
              height={athlete.anthropometry?.height || evaluationData.anthropometry?.height || 160}
              sport="futbol"
              initialData={evaluationData.dietetics}
              onSave={handleDieteticsData}
            />
          )}

          {/* Resumen final */}
          {allSectionsCompleted && (
            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen de la Evaluación ABCD</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      ✓
                    </div>
                    <div>
                      <div className="font-medium">Antropometría Completada</div>
                      <div className="text-sm text-gray-600">
                        IMC: {evaluationData.anthropometry?.bmi?.toFixed(1)} kg/m²
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                      ✓
                    </div>
                    <div>
                      <div className="font-medium">Bioquímica Completada</div>
                      <div className="text-sm text-gray-600">
                        Hemoglobina: {evaluationData.biochemistry?.hemoglobin} g/dL
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
                      ✓
                    </div>
                    <div>
                      <div className="font-medium">Clínica Completada</div>
                      <div className="text-sm text-gray-600">
                        PA: {evaluationData.clinical?.vitalSigns.bloodPressure.systolic}/{evaluationData.clinical?.vitalSigns.bloodPressure.diastolic} mmHg
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
                      ✓
                    </div>
                    <div>
                      <div className="font-medium">Dietética Completada</div>
                      <div className="text-sm text-gray-600">
                        Calorías: {evaluationData.dietetics?.dailyIntake.calories} kcal/día
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Próximos Pasos</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600">•</span>
                      <span>Se generará un reporte completo ABCD</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600">•</span>
                      <span>Se actualizará el estado nutricional del atleta</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600">•</span>
                      <span>Se programará seguimiento en 3 meses</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600">•</span>
                      <span>Se generarán alertas si es necesario</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <div className="flex space-x-3">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Anterior
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={!canProceedToNext()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={handleFinalSave}
                disabled={!allSectionsCompleted}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Guardar Evaluación ABCD Completa
              </button>
            )}
          </div>

          <div className="text-sm text-gray-500">
            Paso {currentStep + 1} de {steps.length} • {Object.values(completedSections).filter(Boolean).length} secciones completadas
          </div>
        </div>
      </div>
    </div>
  )
}
