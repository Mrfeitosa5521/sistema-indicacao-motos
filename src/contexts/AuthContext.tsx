'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

type Profile = {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'vendedor' | 'indicador'
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  switchRole: (newRole: 'admin' | 'vendedor' | 'indicador') => Promise<void>
  isConfigured: boolean
  isHydrated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  const [configured, setConfigured] = useState(false)

  // Verificar configuração apenas no cliente
  useEffect(() => {
    setConfigured(isSupabaseConfigured())
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated || !configured || !supabase) {
      if (isHydrated) {
        setLoading(false)
      }
      return
    }

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [configured, isHydrated])

  const fetchProfile = async (userId: string) => {
    if (!supabase) return
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
    }
  }

  const switchRole = async (newRole: 'admin' | 'vendedor' | 'indicador') => {
    if (!supabase || !user || !profile) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id)

      if (error) throw error

      // Atualizar o estado local
      setProfile({ ...profile, role: newRole })
    } catch (error) {
      console.error('Erro ao trocar papel:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signOut, 
      switchRole,
      isConfigured: configured,
      isHydrated
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}