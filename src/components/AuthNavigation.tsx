"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export function AuthNavigation() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-4">
        <div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-medium text-white">{session.user.name}</p>
          <p className="text-blue-200 text-sm capitalize">{session.user.role}</p>
        </div>
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {session.user.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/login"
        className="bg-white text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg font-medium transition-colors"
      >
        Iniciar Sesión
      </Link>
    </div>
  )
}
