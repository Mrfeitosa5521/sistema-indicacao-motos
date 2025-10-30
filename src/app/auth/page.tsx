'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Zap, Mail, Lock, User, AlertTriangle, CheckCircle } from 'lucide-react'

export default function AuthPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const isConfigured = isSupabaseConfigured()

  useEffect(() => {
    // Processar tokens do hash fragment (quando vem do signup sem confirmação)
    const processHashTokens = async () => {
      if (!supabase) return

      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        try {
          const { data, error } = await supabase.auth.getSession()
          if (data.session && !error) {
            // Limpar o hash da URL
            window.history.replaceState(null, '', window.location.pathname)
            // Redirecionar para dashboard
            router.push('/')
            return
          }
        } catch (error) {
          console.error('Erro ao processar tokens:', error)
        }
      }
    }

    processHashTokens()

    // Verificar se há parâmetros de erro ou confirmação na URL
    const errorParam = searchParams.get('error')
    const confirmedParam = searchParams.get('confirmed')

    if (errorParam === 'confirmation_failed') {
      setError('Erro na confirmação do email. Tente fazer login novamente.')
    } else if (confirmedParam === 'true') {
      setMessage('Email confirmado com sucesso! Você já pode fazer login.')
    }
  }, [searchParams, router])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!supabase) {
      setError('Supabase não está configurado')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      setMessage('Login realizado com sucesso!')
      router.push('/')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!supabase) {
      setError('Supabase não está configurado')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const role = formData.get('role') as string

    try {
      // Signup sem confirmação de email
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
          // Não definir emailRedirectTo para evitar confirmação
        }
      })

      if (error) throw error

      if (data.user) {
        // Criar perfil do usuário
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            role: role as 'admin' | 'vendedor' | 'indicador'
          })

        if (profileError) throw profileError

        // Se o usuário foi criado e confirmado automaticamente, redirecionar
        if (data.session) {
          setMessage('Conta criada com sucesso! Redirecionando...')
          setTimeout(() => router.push('/'), 1500)
        } else {
          setMessage('Conta criada com sucesso! Você já pode fazer login.')
        }
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-500 p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Configuração Necessária</CardTitle>
            <CardDescription>
              O Supabase precisa ser configurado para usar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Para usar o sistema de autenticação, você precisa configurar o Supabase.
              </AlertDescription>
            </Alert>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Opção 1:</strong> Vá em Configurações do Projeto → Integrações → Conectar Supabase</p>
              <p><strong>Opção 2:</strong> Se aparecer um banner laranja, clique em "Configurar"</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">MotoLeads</CardTitle>
          <CardDescription>
            Sistema de Indicação para Loja de Motos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Seu nome completo"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Tipo de Usuário</Label>
                  <Select name="role" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indicador">Indicador</SelectItem>
                      <SelectItem value="vendedor">Vendedor</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {message && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-600">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}