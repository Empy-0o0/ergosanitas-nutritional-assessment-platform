// Archivo de usuarios de muestra para el sistema de autenticación
// NOTA: En producción, las contraseñas deben estar hasheadas

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // En producción, usar contraseñas hasheadas con bcrypt
  role: 'admin' | 'nutricionista' | 'asistente';
  createdAt: string;
  lastLogin?: string;
}

export const users: User[] = [
  {
    id: "1",
    name: "Dr. Nutriólogo Principal",
    email: "doctor@ergosanitas.com",
    password: "ergosanitas2024", // En producción: hashear con bcrypt
    role: "admin",
    createdAt: "2024-01-01T00:00:00.000Z",
    lastLogin: "2024-12-20T10:30:00.000Z"
  },
  {
    id: "2",
    name: "Lic. María González",
    email: "maria.gonzalez@ergosanitas.com",
    password: "nutricion123", // En producción: hashear con bcrypt
    role: "nutricionista",
    createdAt: "2024-01-15T00:00:00.000Z",
    lastLogin: "2024-12-19T14:20:00.000Z"
  },
  {
    id: "3",
    name: "Juan Pérez Asistente",
    email: "juan.perez@ergosanitas.com",
    password: "asistente456", // En producción: hashear con bcrypt
    role: "asistente",
    createdAt: "2024-02-01T00:00:00.000Z",
    lastLogin: "2024-12-18T09:15:00.000Z"
  },
  {
    id: "4",
    name: "Dra. Ana Rodríguez",
    email: "ana.rodriguez@ergosanitas.com",
    password: "deportiva789", // En producción: hashear con bcrypt
    role: "nutricionista",
    createdAt: "2024-03-01T00:00:00.000Z"
  }
];

// Función para buscar usuario por email
export function findUserByEmail(email: string): User | undefined {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Función para validar credenciales
export function validateCredentials(email: string, password: string): User | null {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
}

// Función para actualizar último login
export function updateLastLogin(userId: string): void {
  const user = users.find(u => u.id === userId);
  if (user) {
    user.lastLogin = new Date().toISOString();
  }
}
