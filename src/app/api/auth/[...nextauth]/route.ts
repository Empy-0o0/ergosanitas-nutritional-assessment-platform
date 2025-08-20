import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { validateCredentials, updateLastLogin } from "@/data/users"

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

        // Validar credenciales contra la base de datos de usuarios
        const user = validateCredentials(credentials.email, credentials.password)

        if (user) {
          // Actualizar último login
          updateLastLogin(user.id)
          
          // Retornar objeto de usuario para la sesión
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
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
      }
      return token
    },
    
    async session({ session, token }) {
      // Enviar propiedades al cliente
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
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
