import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      athleteId?: string // Para pacientes, referencia al ID del atleta
      institutionId?: string // Para instituciones, referencia al ID de la institución
    }
  }

  interface User {
    id: string
    name: string
    email: string
    role: string
    athleteId?: string // Para pacientes, referencia al ID del atleta
    institutionId?: string // Para instituciones, referencia al ID de la institución
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    athleteId?: string // Para pacientes, referencia al ID del atleta
    institutionId?: string // Para instituciones, referencia al ID de la institución
  }
}
