import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Aquí puedes agregar lógica adicional de middleware si es necesario
    // Por ejemplo, verificar roles específicos para ciertas rutas
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Rutas públicas que no requieren autenticación
        const publicPaths = ["/login", "/api/auth"]
        const { pathname } = req.nextUrl
        
        // Permitir acceso a rutas públicas
        if (publicPaths.some(path => pathname.startsWith(path))) {
          return true
        }
        
        // Para todas las demás rutas, requerir token válido
        return !!token
      },
    },
  }
)

export const config = {
  // Proteger todas las rutas excepto las especificadas
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
