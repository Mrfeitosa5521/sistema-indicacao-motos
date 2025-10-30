'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Users, Calculator, Settings, AlertTriangle } from 'lucide-react'

export default function HomePage() {
  const { user, profile, loading, isConfigured, isHydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isHydrated && !loading && !user && isConfigured) {
      router.push('/auth')
    }
  }, [user, loading, router, isConfigured, isHydrated])

  useEffect(() => {
    if (isHydrated && profile && user) {
      // Redirecionar baseado no role do usuário
      switch (profile.role) {
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
          break
      }
    }
  }, [profile, user, router, isHydrated])

  // Aguardar hidratação para evitar mismatch
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Inicializando...</p>
        </div>
      </div>
    )
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="https://i.imgur.com/7Yg3zoC.png" 
                alt="MotoLeads Logo" 
                className="h-16 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold">Sistema MotoLeads</CardTitle>
            <CardDescription>
              Configuração do Supabase necessária para funcionar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Para usar o sistema completo de indicação, você precisa configurar o Supabase.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Como configurar:</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                  <p><strong>Opção Automática:</strong> Vá em Configurações do Projeto → Integrações → Conectar Supabase</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                  <p><strong>Banner Laranja:</strong> Se aparecer um banner laranja na tela, clique em "Configurar"</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">O que o sistema oferece:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Autenticação completa com login e cadastro</li>
                <li>• Painel para Indicadores cadastrarem leads</li>
                <li>• Painel para Vendedores gerenciarem leads e simulações</li>
                <li>• Painel Administrativo para controle de vendas e comissões</li>
                <li>• Banco de dados completo com todas as funcionalidades</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Será redirecionado para /auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center mb-8">
          <div className="flex items-center gap-3">
            <img 
              src="https://i.imgur.com/7Yg3zoC.png" 
              alt="MotoLeads Logo" 
              className="h-12 w-auto"
            />
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">MotoLeads</h1>
              <p className="text-gray-600">Sistema de Indicação para Loja de Motos</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Bem-vindo, {profile?.full_name}!</CardTitle>
              <CardDescription>
                Você está logado como: <strong>{profile?.role}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Você será redirecionado automaticamente para seu painel...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/indicador')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Painel do Indicador
              </CardTitle>
              <CardDescription>
                Cadastre novos leads e acompanhe suas indicações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant={profile?.role === 'indicador' ? 'default' : 'outline'}>
                Acessar Painel
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/vendedor')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-600" />
                Painel do Vendedor
              </CardTitle>
              <CardDescription>
                Gerencie leads e faça simulações de financiamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant={profile?.role === 'vendedor' ? 'default' : 'outline'}>
                Acessar Painel
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                Painel Administrativo
              </CardTitle>
              <CardDescription>
                Controle total do sistema e comissões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant={profile?.role === 'admin' ? 'default' : 'outline'}>
                Acessar Painel
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Como Funciona o Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Indicação</h3>
                  <p className="text-sm text-gray-600">
                    Indicadores cadastram leads interessados em comprar motos
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Calculator className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">2. Atendimento</h3>
                  <p className="text-sm text-gray-600">
                    Vendedores assumem leads e fazem simulações de financiamento
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Comissão</h3>
                  <p className="text-sm text-gray-600">
                    Administradores controlam vendas e calculam comissões
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}