import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilidades para formateo de fechas
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateShort(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// Calcular edad a partir de fecha de nacimiento
export function calculateAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

// Determinar categoría por edad
export function getAgeCategory(age: number): '5-8' | '9-13' | '14-18' {
  if (age >= 5 && age <= 8) return '5-8'
  if (age >= 9 && age <= 13) return '9-13'
  if (age >= 14 && age <= 18) return '14-18'
  return '14-18' // Por defecto
}

// Formatear números con decimales
export function formatNumber(num: number, decimals: number = 1): string {
  return num.toFixed(decimals)
}

// Generar ID único
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Capitalizar primera letra
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Formatear texto para mostrar
export function formatDisplayText(text: string): string {
  return text
    .split('_')
    .map(word => capitalize(word))
    .join(' ')
}

// Obtener iniciales de nombre
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Validar rango numérico
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

// Obtener color para estado nutricional
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'normal':
    case 'optimal':
    case 'adequate':
      return 'text-green-600 bg-green-50'
    case 'warning':
    case 'at-risk':
      return 'text-yellow-600 bg-yellow-50'
    case 'danger':
    case 'critical':
    case 'deficient':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

// Obtener texto en español para estados
export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'normal': 'Normal',
    'warning': 'Riesgo',
    'danger': 'Alerta',
    'optimal': 'Óptimo',
    'adequate': 'Adecuado',
    'deficient': 'Deficiente',
    'at-risk': 'En Riesgo',
    'critical': 'Crítico',
    'active': 'Activo',
    'completed': 'Completado',
    'modified': 'Modificado',
    'discontinued': 'Discontinuado',
    'male': 'Masculino',
    'female': 'Femenino',
    'low': 'Bajo',
    'medium': 'Medio',
    'high': 'Alto',
    'poor': 'Pobre',
    'fair': 'Regular',
    'good': 'Bueno',
    'excellent': 'Excelente'
  }
  
  return statusMap[status.toLowerCase()] || status
}

// Obtener texto para categorías de edad
export function getCategoryText(category: string): string {
  const categoryMap: Record<string, string> = {
    '5-8': '5-8 años (Iniciación)',
    '9-13': '9-13 años (Desarrollo)',
    '14-18': '14-18 años (Rendimiento)'
  }
  
  return categoryMap[category] || category
}

// Validar datos requeridos
export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): string[] {
  const errors: string[] = []
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field] === '' || data[field] === null || data[field] === undefined) {
      errors.push(`El campo ${formatDisplayText(field)} es requerido`)
    }
  })
  
  return errors
}

// Debounce para búsquedas
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Filtrar datos por texto de búsqueda
export function filterBySearch<T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) return items
  
  const term = searchTerm.toLowerCase()
  
  return items.filter(item =>
    searchFields.some(field => {
      const value = item[field]
      if (typeof value === 'string') {
        return value.toLowerCase().includes(term)
      }
      if (typeof value === 'number') {
        return value.toString().includes(term)
      }
      return false
    })
  )
}

// Ordenar array por campo
export function sortBy<T>(
  items: T[],
  field: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[field]
    const bVal = b[field]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

// Agrupar array por campo
export function groupBy<T>(items: T[], field: keyof T): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const key = String(item[field])
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

// Exportar datos a CSV
export function exportToCSV(data: any[], filename: string): void {
  if (!data.length) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header]
        // Escapar comillas y envolver en comillas si contiene comas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Formatear bytes a texto legible
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Obtener contraste de color para texto
export function getTextColor(backgroundColor: string): string {
  // Convertir hex a RGB
  const hex = backgroundColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calcular luminancia
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}
