'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LogOut, User, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react'

interface NavbarProps {
  title?: string
  showRoleSwitch?: boolean
}

export function Navbar({ title, showRoleSwitch = true }: NavbarProps) {
  const { user, profile, signOut, switchRole } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/auth')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleRoleSwitch = async (newRole: 'admin' | 'vendedor' | 'indicador') => {
    if (!profile || newRole === profile.role) return

    setLoading(true)
    setError('')
    setMessage('')

    try {
      await switchRole(newRole)
      setMessage(`Papel alterado para ${newRole} com sucesso!`)
      
      // Redirecionar para a página apropriada após 1.5 segundos
      setTimeout(() => {
        switch (newRole) {
          case 'admin':
            router.push('/admin')
            break
          case 'vendedor':
            router.push('/vendedor')
            break
          case 'indicador':
            router.push('/indicador')
            break
          default:
            router.push('/')
        }
      }, 1500)
    } catch (error) {
      setError('Erro ao trocar papel. Tente novamente.')
      console.error('Erro ao trocar papel:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'vendedor':
        return 'Vendedor'
      case 'indicador':
        return 'Indicador'
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      case 'vendedor':
        return 'bg-green-100 text-green-800'
      case 'indicador':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user || !profile) return null

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://i.imgur.com/7Yg3zoC.png" 
                alt="MotoLeads Logo" 
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-semibold text-gray-900">
                {title || 'MotoLeads'}
              </h1>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(profile.role)}`}>
              {getRoleLabel(profile.role)}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{profile.full_name}</span>
            </div>

            {showRoleSwitch && (
              <div className="flex items-center gap-2">
                <Select
                  value={profile.role}
                  onValueChange={handleRoleSwitch}
                  disabled={loading}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indicador">Indicador</SelectItem>
                    <SelectItem value="vendedor">Vendedor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                {loading && <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />}
              </div>
            )}

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Mensagens de feedback */}
      {message && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <Alert className="border-green-200 bg-transparent">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                {message}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <Alert className="border-red-200 bg-transparent" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </div>
      )}
    </div>
  )
}