"use client"

import { useState, FormEvent, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Si el usuario ya está logueado, redirigir al dashboard
    if (session) {
      router.push("/")
    }

    // Mostrar mensaje de error si viene como parámetro de NextAuth
    const error = searchParams.get("error")
    if (error) {
      setErrorMsg("Credenciales incorrectas. Intenta nuevamente.")
    }
  }, [session, router, searchParams])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    // Validación básica del lado del cliente
    if (!email || !password) {
      setErrorMsg("Por favor completa todos los campos")
      setLoading(false)
      return
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setErrorMsg("Credenciales incorrectas")
        setLoading(false)
      } else {
        // Login exitoso - NextAuth actualizará la sesión automáticamente
        router.push("/")
      }
    } catch (error) {
      setErrorMsg("Error de conexión. Intenta nuevamente.")
      setLoading(false)
    }
  }

  // Si ya está logueado, mostrar mensaje de carga
  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <div className="max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">♥</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat">
            Ergo<span className="text-green-600">Sanitas</span>
          </h1>
          <p className="text-gray-600 mt-2">Plataforma Nutricional Deportiva</p>
        </div>

        {/* Formulario de login */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Iniciar Sesión
          </h2>

          {/* Mensaje de error */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{errorMsg}</p>
            </div>
          )}

          {/* Credenciales de prueba */}
          <div className="mb-6 space-y-4">
            {/* Credenciales del personal */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Personal ErgoSanitas:</h3>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Admin:</strong> doctor@ergosanitas.com / ergosanitas2024</p>
                <p><strong>Nutricionista:</strong> maria.gonzalez@ergosanitas.com / nutricion123</p>
                <p><strong>Asistente:</strong> juan.perez@ergosanitas.com / asistente456</p>
              </div>
            </div>
            
            {/* Credenciales de pacientes */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 mb-2">Acceso para Atletas/Pacientes:</h3>
              <div className="text-xs text-green-700 space-y-1">
                <p><strong>Carlos Rodríguez (12 años):</strong> carlos.rodriguez@atleta.com / carlos123</p>
                <p><strong>María Fernández (15 años):</strong> maria.fernandez@atleta.com / maria123</p>
                <p><strong>Javier López (8 años):</strong> javier.lopez@atleta.com / javier123</p>
                <p><strong>Ana Martínez (17 años):</strong> ana.martinez@atleta.com / ana123</p>
                <p><strong>Pedro Sánchez (10 años):</strong> pedro.sanchez@atleta.com / pedro123</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                placeholder="tu-email@ergosanitas.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          {/* Enlaces adicionales */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Problemas para acceder?{" "}
              <Link href="/contacto" className="text-blue-600 hover:text-blue-700 font-medium">
                Contacta al administrador
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            &copy; 2024 ErgoSanitas. Plataforma especializada en nutrición deportiva.
          </p>
        </div>
      </div>
    </div>
  )
}
