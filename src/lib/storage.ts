import { Athlete, ABCDEvaluation, TreatmentPlan, NutritionalAlert, Report } from './types'
import { generateId } from './utils'

// Sistema de almacenamiento local para la aplicación
export class DataStorage {
  private static readonly STORAGE_KEYS = {
    ATHLETES: 'ergo-sanitas-athletes',
    EVALUATIONS: 'ergo-sanitas-evaluations',
    TREATMENT_PLANS: 'ergo-sanitas-treatment-plans',
    ALERTS: 'ergo-sanitas-alerts',
    REPORTS: 'ergo-sanitas-reports',
    SETTINGS: 'ergo-sanitas-settings'
  }

  // Métodos para Atletas
  static getAthletes(): Athlete[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.ATHLETES)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading athletes:', error)
      return []
    }
  }

  static saveAthlete(athlete: Athlete): void {
    try {
      const athletes = this.getAthletes()
      const existingIndex = athletes.findIndex(a => a.id === athlete.id)
      
      if (existingIndex >= 0) {
        athletes[existingIndex] = athlete
      } else {
        athletes.push(athlete)
      }
      
      localStorage.setItem(this.STORAGE_KEYS.ATHLETES, JSON.stringify(athletes))
    } catch (error) {
      console.error('Error saving athlete:', error)
      throw new Error('No se pudo guardar el deportista')
    }
  }

  static getAthleteById(id: string): Athlete | null {
    const athletes = this.getAthletes()
    return athletes.find(a => a.id === id) || null
  }

  static deleteAthlete(id: string): void {
    try {
      const athletes = this.getAthletes().filter(a => a.id !== id)
      localStorage.setItem(this.STORAGE_KEYS.ATHLETES, JSON.stringify(athletes))
      
      // También eliminar evaluaciones y planes relacionados
      this.deleteEvaluationsByAthleteId(id)
      this.deleteTreatmentPlansByAthleteId(id)
      this.deleteAlertsByAthleteId(id)
    } catch (error) {
      console.error('Error deleting athlete:', error)
      throw new Error('No se pudo eliminar el deportista')
    }
  }

  // Métodos para Evaluaciones ABCD
  static getEvaluations(): ABCDEvaluation[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.EVALUATIONS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading evaluations:', error)
      return []
    }
  }

  static saveEvaluation(evaluation: ABCDEvaluation): void {
    try {
      const evaluations = this.getEvaluations()
      const existingIndex = evaluations.findIndex(e => e.id === evaluation.id)
      
      if (existingIndex >= 0) {
        evaluations[existingIndex] = evaluation
      } else {
        evaluations.push(evaluation)
      }
      
      localStorage.setItem(this.STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluations))
    } catch (error) {
      console.error('Error saving evaluation:', error)
      throw new Error('No se pudo guardar la evaluación')
    }
  }

  static getEvaluationsByAthleteId(athleteId: string): ABCDEvaluation[] {
    return this.getEvaluations().filter(e => e.athleteId === athleteId)
  }

  static deleteEvaluationsByAthleteId(athleteId: string): void {
    try {
      const evaluations = this.getEvaluations().filter(e => e.athleteId !== athleteId)
      localStorage.setItem(this.STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluations))
    } catch (error) {
      console.error('Error deleting evaluations:', error)
    }
  }

  // Métodos para Planes de Tratamiento
  static getTreatmentPlans(): TreatmentPlan[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.TREATMENT_PLANS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading treatment plans:', error)
      return []
    }
  }

  static saveTreatmentPlan(plan: TreatmentPlan): void {
    try {
      const plans = this.getTreatmentPlans()
      const existingIndex = plans.findIndex(p => p.id === plan.id)
      
      if (existingIndex >= 0) {
        plans[existingIndex] = plan
      } else {
        plans.push(plan)
      }
      
      localStorage.setItem(this.STORAGE_KEYS.TREATMENT_PLANS, JSON.stringify(plans))
    } catch (error) {
      console.error('Error saving treatment plan:', error)
      throw new Error('No se pudo guardar el plan de tratamiento')
    }
  }

  static getTreatmentPlansByAthleteId(athleteId: string): TreatmentPlan[] {
    return this.getTreatmentPlans().filter(p => p.athleteId === athleteId)
  }

  static deleteTreatmentPlansByAthleteId(athleteId: string): void {
    try {
      const plans = this.getTreatmentPlans().filter(p => p.athleteId !== athleteId)
      localStorage.setItem(this.STORAGE_KEYS.TREATMENT_PLANS, JSON.stringify(plans))
    } catch (error) {
      console.error('Error deleting treatment plans:', error)
    }
  }

  // Métodos para Alertas
  static getAlerts(): NutritionalAlert[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.ALERTS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading alerts:', error)
      return []
    }
  }

  static saveAlert(alert: NutritionalAlert): void {
    try {
      const alerts = this.getAlerts()
      const existingIndex = alerts.findIndex(a => a.id === alert.id)
      
      if (existingIndex >= 0) {
        alerts[existingIndex] = alert
      } else {
        alerts.push(alert)
      }
      
      localStorage.setItem(this.STORAGE_KEYS.ALERTS, JSON.stringify(alerts))
    } catch (error) {
      console.error('Error saving alert:', error)
      throw new Error('No se pudo guardar la alerta')
    }
  }

  static getActiveAlerts(): NutritionalAlert[] {
    return this.getAlerts().filter(a => !a.resolved)
  }

  static getAlertsByAthleteId(athleteId: string): NutritionalAlert[] {
    return this.getAlerts().filter(a => a.athleteId === athleteId)
  }

  static deleteAlertsByAthleteId(athleteId: string): void {
    try {
      const alerts = this.getAlerts().filter(a => a.athleteId !== athleteId)
      localStorage.setItem(this.STORAGE_KEYS.ALERTS, JSON.stringify(alerts))
    } catch (error) {
      console.error('Error deleting alerts:', error)
    }
  }

  static resolveAlert(alertId: string): void {
    try {
      const alerts = this.getAlerts()
      const alert = alerts.find(a => a.id === alertId)
      
      if (alert) {
        alert.resolved = true
        alert.resolvedDate = new Date().toISOString()
        localStorage.setItem(this.STORAGE_KEYS.ALERTS, JSON.stringify(alerts))
      }
    } catch (error) {
      console.error('Error resolving alert:', error)
      throw new Error('No se pudo resolver la alerta')
    }
  }

  // Métodos para Reportes
  static getReports(): Report[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.REPORTS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading reports:', error)
      return []
    }
  }

  static saveReport(report: Report): void {
    try {
      const reports = this.getReports()
      const existingIndex = reports.findIndex(r => r.id === report.id)
      
      if (existingIndex >= 0) {
        reports[existingIndex] = report
      } else {
        reports.push(report)
      }
      
      localStorage.setItem(this.STORAGE_KEYS.REPORTS, JSON.stringify(reports))
    } catch (error) {
      console.error('Error saving report:', error)
      throw new Error('No se pudo guardar el reporte')
    }
  }

  // Métodos de utilidad
  static exportData(): string {
    try {
      const data = {
        athletes: this.getAthletes(),
        evaluations: this.getEvaluations(),
        treatmentPlans: this.getTreatmentPlans(),
        alerts: this.getAlerts(),
        reports: this.getReports(),
        exportDate: new Date().toISOString()
      }
      
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('Error exporting data:', error)
      throw new Error('No se pudo exportar los datos')
    }
  }

  static importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData)
      
      if (data.athletes) {
        localStorage.setItem(this.STORAGE_KEYS.ATHLETES, JSON.stringify(data.athletes))
      }
      
      if (data.evaluations) {
        localStorage.setItem(this.STORAGE_KEYS.EVALUATIONS, JSON.stringify(data.evaluations))
      }
      
      if (data.treatmentPlans) {
        localStorage.setItem(this.STORAGE_KEYS.TREATMENT_PLANS, JSON.stringify(data.treatmentPlans))
      }
      
      if (data.alerts) {
        localStorage.setItem(this.STORAGE_KEYS.ALERTS, JSON.stringify(data.alerts))
      }
      
      if (data.reports) {
        localStorage.setItem(this.STORAGE_KEYS.REPORTS, JSON.stringify(data.reports))
      }
    } catch (error) {
      console.error('Error importing data:', error)
      throw new Error('No se pudo importar los datos')
    }
  }

  static clearAllData(): void {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Error clearing data:', error)
      throw new Error('No se pudo limpiar los datos')
    }
  }

  // Datos de ejemplo para desarrollo
  static initializeSampleData(): void {
    if (this.getAthletes().length === 0) {
      const sampleAthletes: Athlete[] = [
        {
          id: generateId(),
          fullName: 'Carlos Rodríguez',
          birthDate: '2011-03-15',
          age: 12,
          gender: 'male',
          club: 'Club Deportivo Juvenil',
          position: 'Mediocampista',
          category: '9-13',
          evaluationDate: '2024-01-15',
          nutritionalStatus: 'normal',
          lastEvaluation: '2024-01-15',
          anthropometry: {
            height: 150,
            weight: 45,
            bmi: 20.0,
            bodyFatPercentage: 12,
            percentiles: {
              heightPercentile: 75,
              weightPercentile: 70,
              bmiPercentile: 65
            }
          }
        },
        {
          id: generateId(),
          fullName: 'María Fernández',
          birthDate: '2008-07-22',
          age: 15,
          gender: 'female',
          club: 'Academia Fútbol Femenino',
          position: 'Delantera',
          category: '14-18',
          evaluationDate: '2024-01-10',
          nutritionalStatus: 'warning',
          lastEvaluation: '2024-01-10',
          anthropometry: {
            height: 165,
            weight: 52,
            bmi: 19.1,
            bodyFatPercentage: 18,
            percentiles: {
              heightPercentile: 80,
              weightPercentile: 60,
              bmiPercentile: 45
            }
          }
        },
        {
          id: generateId(),
          fullName: 'Javier López',
          birthDate: '2015-11-08',
          age: 8,
          gender: 'male',
          club: 'Escuela de Fútbol Infantil',
          position: 'Defensa',
          category: '5-8',
          evaluationDate: '2024-01-05',
          nutritionalStatus: 'normal',
          lastEvaluation: '2024-01-05',
          anthropometry: {
            height: 125,
            weight: 28,
            bmi: 17.9,
            bodyFatPercentage: 15,
            percentiles: {
              heightPercentile: 70,
              weightPercentile: 65,
              bmiPercentile: 60
            }
          }
        },
        {
          id: generateId(),
          fullName: 'Ana Martínez',
          birthDate: '2006-12-03',
          age: 17,
          gender: 'female',
          club: 'Club Atlético Femenino',
          position: 'Portera',
          category: '14-18',
          evaluationDate: '2024-01-01',
          nutritionalStatus: 'danger',
          lastEvaluation: '2024-01-01',
          anthropometry: {
            height: 170,
            weight: 48,
            bmi: 16.6,
            bodyFatPercentage: 14,
            percentiles: {
              heightPercentile: 85,
              weightPercentile: 25,
              bmiPercentile: 15
            }
          }
        },
        {
          id: generateId(),
          fullName: 'Pedro Sánchez',
          birthDate: '2013-05-18',
          age: 10,
          gender: 'male',
          club: 'Deportivo Juvenil',
          position: 'Mediocampista',
          category: '9-13',
          evaluationDate: '2023-12-28',
          nutritionalStatus: 'normal',
          lastEvaluation: '2023-12-28',
          anthropometry: {
            height: 140,
            weight: 35,
            bmi: 17.9,
            bodyFatPercentage: 13,
            percentiles: {
              heightPercentile: 65,
              weightPercentile: 60,
              bmiPercentile: 55
            }
          }
        }
      ]

      sampleAthletes.forEach(athlete => this.saveAthlete(athlete))

      // Crear algunas alertas de ejemplo
      const sampleAlerts: NutritionalAlert[] = [
        {
          id: generateId(),
          athleteId: sampleAthletes[3].id, // Ana Martínez
          type: 'anthropometric',
          severity: 'high',
          message: 'IMC por debajo del percentil 20 para la edad',
          recommendations: [
            'Evaluación médica inmediata',
            'Plan de aumento de peso controlado',
            'Seguimiento semanal'
          ],
          createdDate: '2024-01-01',
          resolved: false
        },
        {
          id: generateId(),
          athleteId: sampleAthletes[1].id, // María Fernández
          type: 'dietary',
          severity: 'medium',
          message: 'Ingesta calórica insuficiente para el nivel de actividad',
          recommendations: [
            'Aumentar frecuencia de comidas',
            'Incluir snacks nutritivos',
            'Consulta con nutricionista'
          ],
          createdDate: '2024-01-10',
          resolved: false
        }
      ]

      sampleAlerts.forEach(alert => this.saveAlert(alert))
    }
  }
}

// Hook personalizado para usar el almacenamiento de datos
export function useDataStorage() {
  return {
    // Atletas
    getAthletes: DataStorage.getAthletes,
    saveAthlete: DataStorage.saveAthlete,
    getAthleteById: DataStorage.getAthleteById,
    deleteAthlete: DataStorage.deleteAthlete,
    
    // Evaluaciones
    getEvaluations: DataStorage.getEvaluations,
    saveEvaluation: DataStorage.saveEvaluation,
    getEvaluationsByAthleteId: DataStorage.getEvaluationsByAthleteId,
    
    // Planes de tratamiento
    getTreatmentPlans: DataStorage.getTreatmentPlans,
    saveTreatmentPlan: DataStorage.saveTreatmentPlan,
    getTreatmentPlansByAthleteId: DataStorage.getTreatmentPlansByAthleteId,
    
    // Alertas
    getAlerts: DataStorage.getAlerts,
    saveAlert: DataStorage.saveAlert,
    getActiveAlerts: DataStorage.getActiveAlerts,
    getAlertsByAthleteId: DataStorage.getAlertsByAthleteId,
    resolveAlert: DataStorage.resolveAlert,
    
    // Reportes
    getReports: DataStorage.getReports,
    saveReport: DataStorage.saveReport,
    
    // Utilidades
    exportData: DataStorage.exportData,
    importData: DataStorage.importData,
    clearAllData: DataStorage.clearAllData,
    initializeSampleData: DataStorage.initializeSampleData
  }
}
