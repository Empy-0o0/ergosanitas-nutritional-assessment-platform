import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { validateCredentials, updateLastLogin } from "@/data/users"
import { validatePatientCredentials, updatePatientLastLogin, getAthleteByCredentialId, validateInstitutionCredentials, updateInstitutionLastLogin } from "@/data/patientCredentials"

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { 
          label: "Correo Electrónico", 
          type: "email", 
          placeholder: "tu-email@ergosanitas.com" 
        },
        password: { 
          label: "Contraseña", 
          type: "password" 
        },
      },
      async authorize(credentials) {
        // Validar que se proporcionaron las credenciales
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Se requiere email y contraseña")
        }

        // Primero intentar validar como usuario del sistema (admin, nutricionista, asistente)
        const systemUser = validateCredentials(credentials.email, credentials.password)

        if (systemUser) {
          // Actualizar último login
          updateLastLogin(systemUser.id)
          
          // Retornar objeto de usuario para la sesión
          return {
            id: systemUser.id,
            name: systemUser.name,
            email: systemUser.email,
            role: systemUser.role,
          }
        }

        // Si no es usuario del sistema, intentar validar como paciente
        const patient = validatePatientCredentials(credentials.email, credentials.password)

        if (patient) {
          // Obtener datos del atleta
          const athleteData = getAthleteByCredentialId(patient.athleteId)
          
          if (athleteData) {
            // Actualizar último login del paciente
            updatePatientLastLogin(credentials.email)
            
            // Retornar objeto de paciente para la sesión
            return {
              id: patient.athleteId, // Usar el ID del atleta como ID principal
              name: athleteData.fullName,
              email: patient.email,
              role: "patient",
              athleteId: patient.athleteId,
            }
          }
        }

        // Si no es paciente, intentar validar como institución
        const institution = validateInstitutionCredentials(credentials.email, credentials.password)

        if (institution) {
          // Actualizar último login de la institución
          updateInstitutionLastLogin(credentials.email)
          
          // Retornar objeto de institución para la sesión
          return {
            id: institution.institutionId,
            name: institution.name,
            email: institution.email,
            role: "institucion",
            institutionId: institution.institutionId,
          }
        }
        
        // Si las credenciales son incorrectas, lanzar error
        throw new Error("Credenciales incorrectas")
      },
    }),
  ],
  
  // Configuración de sesión y secreto
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  
  // Páginas personalizadas
  pages: {
    signIn: "/login", // Página de login personalizada
    error: "/login", // Redirigir errores a la página de login
  },
  
  // Callbacks para personalizar JWT y sesión
  callbacks: {
    async jwt({ token, user }) {
      // Primera vez que se ejecuta el callback jwt, el objeto user está disponible
      if (user) {
        token.id = user.id
        token.role = user.role
        token.athleteId = user.athleteId // Para pacientes
        token.institutionId = user.institutionId // Para instituciones
      }
      return token
    },
    
    async session({ session, token }) {
      // Enviar propiedades al cliente
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.athleteId = token.athleteId // Para pacientes
        session.user.institutionId = token.institutionId // Para instituciones
      }
      return session
    },
    
    async redirect({ url, baseUrl }) {
      // Redirigir al dashboard después del login exitoso
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  
  // Configuración adicional
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
