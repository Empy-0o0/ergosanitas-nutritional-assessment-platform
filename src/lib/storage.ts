import { Athlete, ABCDEvaluation, TreatmentPlan, NutritionalAlert, Report, MealPlan, MealReminder, DailyTracking, NutritionalAnalysis } from './types'
import { generateId } from './utils'

// Sistema de almacenamiento local para la aplicación
export class DataStorage {
  private static readonly STORAGE_KEYS = {
    ATHLETES: 'ergo-sanitas-athletes',
    EVALUATIONS: 'ergo-sanitas-evaluations',
    TREATMENT_PLANS: 'ergo-sanitas-treatment-plans',
    ALERTS: 'ergo-sanitas-alerts',
    REPORTS: 'ergo-sanitas-reports',
    SETTINGS: 'ergo-sanitas-settings',
    MEAL_PLANS: 'ergo-sanitas-meal-plans',
    MEAL_REMINDERS: 'ergo-sanitas-meal-reminders',
    DAILY_TRACKING: 'ergo-sanitas-daily-tracking',
    NUTRITIONAL_ANALYSIS: 'ergo-sanitas-nutritional-analysis'
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
      
      // También eliminar evaluaciones, planes y datos relacionados
      this.deleteEvaluationsByAthleteId(id)
      this.deleteTreatmentPlansByAthleteId(id)
      this.deleteAlertsByAthleteId(id)
      this.deleteMealPlansByAthleteId(id)
      this.deleteMealRemindersByAthleteId(id)
      this.deleteDailyTrackingByAthleteId(id)
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

  // ==================== MÉTODOS PARA PLANES ALIMENTICIOS ====================

  // Métodos para Planes Alimenticios
  static getMealPlans(): MealPlan[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.MEAL_PLANS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading meal plans:', error)
      return []
    }
  }

  static saveMealPlan(mealPlan: MealPlan): void {
    try {
      const mealPlans = this.getMealPlans()
      const existingIndex = mealPlans.findIndex(mp => mp.id === mealPlan.id)
      
      if (existingIndex >= 0) {
        mealPlans[existingIndex] = mealPlan
      } else {
        mealPlans.push(mealPlan)
      }
      
      localStorage.setItem(this.STORAGE_KEYS.MEAL_PLANS, JSON.stringify(mealPlans))
    } catch (error) {
      console.error('Error saving meal plan:', error)
      throw new Error('No se pudo guardar el plan alimenticio')
    }
  }

  static getMealPlanById(id: string): MealPlan | null {
    const mealPlans = this.getMealPlans()
    return mealPlans.find(mp => mp.id === id) || null
  }

  static getMealPlansByAthleteId(athleteId: string): MealPlan[] {
    return this.getMealPlans().filter(mp => mp.athleteId === athleteId)
  }

  static getActiveMealPlanByAthleteId(athleteId: string): MealPlan | null {
    const mealPlans = this.getMealPlansByAthleteId(athleteId)
    return mealPlans.find(mp => mp.status === 'active') || null
  }

  static deleteMealPlan(id: string): void {
    try {
      const mealPlans = this.getMealPlans().filter(mp => mp.id !== id)
      localStorage.setItem(this.STORAGE_KEYS.MEAL_PLANS, JSON.stringify(mealPlans))
      
      // También eliminar recordatorios y seguimiento relacionados
      this.deleteMealRemindersByMealPlanId(id)
      this.deleteDailyTrackingByMealPlanId(id)
    } catch (error) {
      console.error('Error deleting meal plan:', error)
      throw new Error('No se pudo eliminar el plan alimenticio')
    }
  }

  static deleteMealPlansByAthleteId(athleteId: string): void {
    try {
      const mealPlans = this.getMealPlans().filter(mp => mp.athleteId !== athleteId)
      localStorage.setItem(this.STORAGE_KEYS.MEAL_PLANS, JSON.stringify(mealPlans))
    } catch (error) {
      console.error('Error deleting meal plans:', error)
    }
  }

  // Métodos para Recordatorios de Comidas
  static getMealReminders(): MealReminder[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.MEAL_REMINDERS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading meal reminders:', error)
      return []
    }
  }

  static saveMealReminder(reminder: MealReminder): void {
    try {
      const reminders = this.getMealReminders()
      const existingIndex = reminders.findIndex(r => r.id === reminder.id)
      
      if (existingIndex >= 0) {
        reminders[existingIndex] = reminder
      } else {
        reminders.push(reminder)
      }
      
      localStorage.setItem(this.STORAGE_KEYS.MEAL_REMINDERS, JSON.stringify(reminders))
    } catch (error) {
      console.error('Error saving meal reminder:', error)
      throw new Error('No se pudo guardar el recordatorio')
    }
  }

  static getMealRemindersByAthleteId(athleteId: string): MealReminder[] {
    return this.getMealReminders().filter(r => r.athleteId === athleteId)
  }

  static getMealRemindersByMealPlanId(mealPlanId: string): MealReminder[] {
    return this.getMealReminders().filter(r => r.mealPlanId === mealPlanId)
  }

  static getActiveMealReminders(): MealReminder[] {
    return this.getMealReminders().filter(r => r.isActive)
  }

  static deleteMealReminder(id: string): void {
    try {
      const reminders = this.getMealReminders().filter(r => r.id !== id)
      localStorage.setItem(this.STORAGE_KEYS.MEAL_REMINDERS, JSON.stringify(reminders))
    } catch (error) {
      console.error('Error deleting meal reminder:', error)
      throw new Error('No se pudo eliminar el recordatorio')
    }
  }

  static deleteMealRemindersByMealPlanId(mealPlanId: string): void {
    try {
      const reminders = this.getMealReminders().filter(r => r.mealPlanId !== mealPlanId)
      localStorage.setItem(this.STORAGE_KEYS.MEAL_REMINDERS, JSON.stringify(reminders))
    } catch (error) {
      console.error('Error deleting meal reminders:', error)
    }
  }

  static deleteMealRemindersByAthleteId(athleteId: string): void {
    try {
      const reminders = this.getMealReminders().filter(r => r.athleteId !== athleteId)
      localStorage.setItem(this.STORAGE_KEYS.MEAL_REMINDERS, JSON.stringify(reminders))
    } catch (error) {
      console.error('Error deleting meal reminders:', error)
    }
  }

  // Métodos para Seguimiento Diario
  static getDailyTracking(): DailyTracking[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.DAILY_TRACKING)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading daily tracking:', error)
      return []
    }
  }

  static saveDailyTracking(tracking: DailyTracking): void {
    try {
      const trackings = this.getDailyTracking()
      const existingIndex = trackings.findIndex(t => t.id === tracking.id)
      
      if (existingIndex >= 0) {
        trackings[existingIndex] = tracking
      } else {
        trackings.push(tracking)
      }
      
      localStorage.setItem(this.STORAGE_KEYS.DAILY_TRACKING, JSON.stringify(trackings))
    } catch (error) {
      console.error('Error saving daily tracking:', error)
      throw new Error('No se pudo guardar el seguimiento diario')
    }
  }

  static getDailyTrackingByAthleteId(athleteId: string): DailyTracking[] {
    return this.getDailyTracking().filter(t => t.athleteId === athleteId)
  }

  static getDailyTrackingByMealPlanId(mealPlanId: string): DailyTracking[] {
    return this.getDailyTracking().filter(t => t.mealPlanId === mealPlanId)
  }

  static getDailyTrackingByDate(athleteId: string, date: string): DailyTracking | null {
    const trackings = this.getDailyTrackingByAthleteId(athleteId)
    return trackings.find(t => t.date === date) || null
  }

  static deleteDailyTracking(id: string): void {
    try {
      const trackings = this.getDailyTracking().filter(t => t.id !== id)
      localStorage.setItem(this.STORAGE_KEYS.DAILY_TRACKING, JSON.stringify(trackings))
    } catch (error) {
      console.error('Error deleting daily tracking:', error)
      throw new Error('No se pudo eliminar el seguimiento diario')
    }
  }

  static deleteDailyTrackingByMealPlanId(mealPlanId: string): void {
    try {
      const trackings = this.getDailyTracking().filter(t => t.mealPlanId !== mealPlanId)
      localStorage.setItem(this.STORAGE_KEYS.DAILY_TRACKING, JSON.stringify(trackings))
    } catch (error) {
      console.error('Error deleting daily tracking:', error)
    }
  }

  static deleteDailyTrackingByAthleteId(athleteId: string): void {
    try {
      const trackings = this.getDailyTracking().filter(t => t.athleteId !== athleteId)
      localStorage.setItem(this.STORAGE_KEYS.DAILY_TRACKING, JSON.stringify(trackings))
    } catch (error) {
      console.error('Error deleting daily tracking:', error)
    }
  }

  // Métodos para Análisis Nutricional
  static getNutritionalAnalyses(): NutritionalAnalysis[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.NUTRITIONAL_ANALYSIS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading nutritional analyses:', error)
      return []
    }
  }

  static saveNutritionalAnalysis(analysis: NutritionalAnalysis): void {
    try {
      const analyses = this.getNutritionalAnalyses()
      const existingIndex = analyses.findIndex(a => a.id === analysis.id)
      
      if (existingIndex >= 0) {
        analyses[existingIndex] = analysis
      } else {
        analyses.push(analysis)
      }
      
      localStorage.setItem(this.STORAGE_KEYS.NUTRITIONAL_ANALYSIS, JSON.stringify(analyses))
    } catch (error) {
      console.error('Error saving nutritional analysis:', error)
      throw new Error('No se pudo guardar el análisis nutricional')
    }
  }

  static getNutritionalAnalysisByMealPlanId(mealPlanId: string): NutritionalAnalysis[] {
    return this.getNutritionalAnalyses().filter(a => a.mealPlanId === mealPlanId)
  }

  static getLatestNutritionalAnalysis(mealPlanId: string): NutritionalAnalysis | null {
    const analyses = this.getNutritionalAnalysisByMealPlanId(mealPlanId)
    if (analyses.length === 0) return null
    
    return analyses.sort((a, b) => new Date(b.analysisDate).getTime() - new Date(a.analysisDate).getTime())[0]
  }

  static deleteNutritionalAnalysis(id: string): void {
    try {
      const analyses = this.getNutritionalAnalyses().filter(a => a.id !== id)
      localStorage.setItem(this.STORAGE_KEYS.NUTRITIONAL_ANALYSIS, JSON.stringify(analyses))
    } catch (error) {
      console.error('Error deleting nutritional analysis:', error)
      throw new Error('No se pudo eliminar el análisis nutricional')
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
        mealPlans: this.getMealPlans(),
        mealReminders: this.getMealReminders(),
        dailyTracking: this.getDailyTracking(),
        nutritionalAnalyses: this.getNutritionalAnalyses(),
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

      if (data.mealPlans) {
        localStorage.setItem(this.STORAGE_KEYS.MEAL_PLANS, JSON.stringify(data.mealPlans))
      }

      if (data.mealReminders) {
        localStorage.setItem(this.STORAGE_KEYS.MEAL_REMINDERS, JSON.stringify(data.mealReminders))
      }

      if (data.dailyTracking) {
        localStorage.setItem(this.STORAGE_KEYS.DAILY_TRACKING, JSON.stringify(data.dailyTracking))
      }

      if (data.nutritionalAnalyses) {
        localStorage.setItem(this.STORAGE_KEYS.NUTRITIONAL_ANALYSIS, JSON.stringify(data.nutritionalAnalyses))
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

      // Crear algunos planes alimenticios de ejemplo
      const sampleMealPlans: MealPlan[] = [
        {
          id: generateId(),
          athleteId: sampleAthletes[0].id, // Carlos Rodríguez
          name: 'Plan Nutricional - Temporada Competitiva',
          description: 'Plan alimenticio diseñado para mejorar rendimiento durante la temporada de competencias',
          createdDate: '2024-01-15',
          startDate: '2024-01-20',
          status: 'active',
          createdBy: 'Dra. Ana Nutricionista',
          nutritionalGoals: {
            dailyCalories: 2200,
            proteinPercentage: 20,
            carbsPercentage: 55,
            fatsPercentage: 25,
            fiberGoal: 25,
            hydrationGoal: 2.5
          },
          weeklyPlan: {
            monday: {
              meals: [
                {
                  id: generateId(),
                  name: 'Desayuno Energético',
                  type: 'desayuno',
                  foods: [],
                  scheduledTime: '07:00',
                  instructions: 'Consumir 30 minutos antes del entrenamiento',
                  nutritionalSummary: {
                    totalCalories: 450,
                    totalProtein: 18,
                    totalCarbs: 65,
                    totalFats: 12,
                    totalFiber: 8
                  }
                }
              ],
              notes: 'Día de entrenamiento intenso'
            }
          },
          restrictions: {
            allergies: [],
            intolerances: [],
            dietaryPreferences: [],
            medicalRestrictions: []
          }
        }
      ]

      sampleMealPlans.forEach(plan => this.saveMealPlan(plan))
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
    
    // Planes alimenticios
    getMealPlans: DataStorage.getMealPlans,
    saveMealPlan: DataStorage.saveMealPlan,
    getMealPlanById: DataStorage.getMealPlanById,
    getMealPlansByAthleteId: DataStorage.getMealPlansByAthleteId,
    getActiveMealPlanByAthleteId: DataStorage.getActiveMealPlanByAthleteId,
    deleteMealPlan: DataStorage.deleteMealPlan,
    
    // Recordatorios
    getMealReminders: DataStorage.getMealReminders,
    saveMealReminder: DataStorage.saveMealReminder,
    getMealRemindersByAthleteId: DataStorage.getMealRemindersByAthleteId,
    getMealRemindersByMealPlanId: DataStorage.getMealRemindersByMealPlanId,
    getActiveMealReminders: DataStorage.getActiveMealReminders,
    deleteMealReminder: DataStorage.deleteMealReminder,
    
    // Seguimiento diario
    getDailyTracking: DataStorage.getDailyTracking,
    saveDailyTracking: DataStorage.saveDailyTracking,
    getDailyTrackingByAthleteId: DataStorage.getDailyTrackingByAthleteId,
    getDailyTrackingByMealPlanId: DataStorage.getDailyTrackingByMealPlanId,
    getDailyTrackingByDate: DataStorage.getDailyTrackingByDate,
    deleteDailyTracking: DataStorage.deleteDailyTracking,
    
    // Análisis nutricional
    getNutritionalAnalyses: DataStorage.getNutritionalAnalyses,
    saveNutritionalAnalysis: DataStorage.saveNutritionalAnalysis,
    getNutritionalAnalysisByMealPlanId: DataStorage.getNutritionalAnalysisByMealPlanId,
    getLatestNutritionalAnalysis: DataStorage.getLatestNutritionalAnalysis,
    deleteNutritionalAnalysis: DataStorage.deleteNutritionalAnalysis,
    
    // Utilidades
    exportData: DataStorage.exportData,
    importData: DataStorage.importData,
    clearAllData: DataStorage.clearAllData,
    initializeSampleData: DataStorage.initializeSampleData
  }
}
