// Credenciales de login para pacientes/atletas
// En producción, estas contraseñas deben estar hasheadas

export interface PatientCredentials {
  athleteId: string;
  email: string;
  password: string;
  role: 'patient';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export const patientCredentials: PatientCredentials[] = [
  {
    athleteId: "athlete-carlos-rodriguez-001", // Carlos Rodríguez
    email: "carlos.rodriguez@atleta.com",
    password: "carlos123",
    role: "patient",
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    lastLogin: "2024-12-20T08:30:00.000Z"
  },
  {
    athleteId: "athlete-maria-fernandez-002", // María Fernández
    email: "maria.fernandez@atleta.com",
    password: "maria123",
    role: "patient",
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    lastLogin: "2024-12-19T16:45:00.000Z"
  },
  {
    athleteId: "athlete-javier-lopez-003", // Javier López
    email: "javier.lopez@atleta.com",
    password: "javier123",
    role: "patient",
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    athleteId: "athlete-ana-martinez-004", // Ana Martínez
    email: "ana.martinez@atleta.com",
    password: "ana123",
    role: "patient",
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    lastLogin: "2024-12-18T12:20:00.000Z"
  },
  {
    athleteId: "athlete-pedro-sanchez-005", // Pedro Sánchez
    email: "pedro.sanchez@atleta.com",
    password: "pedro123",
    role: "patient",
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    lastLogin: "2024-12-17T14:10:00.000Z"
  }
];

// Credenciales para instituciones/escuelas
export interface InstitutionCredentials {
  email: string;
  password: string;
  name: string;
  role: 'institucion';
  institutionId: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export const institutions: InstitutionCredentials[] = [
  {
    email: "admin@clubdeportivoj uvenil.com",
    password: "club123",
    name: "Club Deportivo Juvenil",
    role: "institucion",
    institutionId: "club-deportivo-juvenil",
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    email: "admin@academiafutbol.com",
    password: "academia123", 
    name: "Academia Fútbol Femenino",
    role: "institucion",
    institutionId: "academia-futbol-femenino",
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    email: "admin@escuelafutbol.com",
    password: "escuela123",
    name: "Escuela de Fútbol Infantil", 
    role: "institucion",
    institutionId: "escuela-futbol-infantil",
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    email: "admin@clubatletico.com",
    password: "atletico123",
    name: "Club Atlético Femenino",
    role: "institucion", 
    institutionId: "club-atletico-femenino",
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z"
  }
]

// Función para buscar credenciales de paciente por email
export function findPatientByEmail(email: string): PatientCredentials | undefined {
  return patientCredentials.find(patient => patient.email.toLowerCase() === email.toLowerCase());
}

// Función para validar credenciales de paciente
export function validatePatientCredentials(email: string, password: string): PatientCredentials | null {
  const patient = findPatientByEmail(email);
  if (patient && patient.password === password && patient.isActive) {
    return patient;
  }
  return null;
}

// Función para buscar institución por email
export function findInstitutionByEmail(email: string): InstitutionCredentials | undefined {
  return institutions.find(institution => institution.email.toLowerCase() === email.toLowerCase());
}

// Función para validar credenciales de institución
export function validateInstitutionCredentials(email: string, password: string): InstitutionCredentials | null {
  const institution = findInstitutionByEmail(email);
  if (institution && institution.password === password && institution.isActive) {
    return institution;
  }
  return null;
}

// Función para obtener atletas por institución
export function getAthletesByInstitution(institutionName: string) {
  const { SAMPLE_ATHLETES_ABCD } = require('./sampleData');
  try {
    return SAMPLE_ATHLETES_ABCD.filter((athlete: any) => athlete.club === institutionName);
  } catch (error) {
    console.error('Error loading athletes by institution:', error);
    return [];
  }
}

// Función para obtener datos del atleta por ID de credenciales
export function getAthleteByCredentialId(athleteId: string) {
  // Importar los datos directamente desde sampleData para evitar problemas con localStorage en el servidor
  const { SAMPLE_ATHLETES_ABCD } = require('./sampleData');
  try {
    return SAMPLE_ATHLETES_ABCD.find((athlete: any) => athlete.id === athleteId);
  } catch (error) {
    console.error('Error loading athlete data:', error);
    return null;
  }
}

// Función para actualizar último login del paciente
export function updatePatientLastLogin(email: string): void {
  const patient = findPatientByEmail(email);
  if (patient) {
    patient.lastLogin = new Date().toISOString();
  }
}

// Función para actualizar último login de la institución
export function updateInstitutionLastLogin(email: string): void {
  const institution = findInstitutionByEmail(email);
  if (institution) {
    institution.lastLogin = new Date().toISOString();
  }
}
