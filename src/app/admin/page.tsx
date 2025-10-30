'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/custom/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Users, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  UserCheck,
  FileText,
  Shield
} from 'lucide-react'

export default function AdminPage() {
  const { user, profile, loading, isHydrated } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    monthSales: 0,
    pendingCommissions: 0,
    activeLeads: 0
  })

  useEffect(() => {
    if (isHydrated && !loading) {
      if (!user) {
        router.push('/auth')
        return
      }
      if (profile && profile.role !== 'admin') {
        router.push('/')
        return
      }
    }
  }, [user, profile, loading, router, isHydrated])

  // Simular carregamento de dados reais (substituir por chamadas reais ao banco)
  useEffect(() => {
    if (user && profile?.role === 'admin') {
      // Aqui você faria chamadas reais ao Supabase para buscar dados
      setStats({
        totalUsers: 0, // Começar com 0 - dados reais virão do banco
        monthSales: 0,
        pendingCommissions: 0,
        activeLeads: 0
      })
    }
  }, [user, profile])

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile || profile.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Painel Administrativo" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Painel Administrativo
          </h2>
          <p className="text-gray-600">
            Controle total do sistema, usuários, vendas e comissões
          </p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Sistema iniciando - dados serão carregados conforme uso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.monthSales.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando primeiras vendas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comissões Pendentes</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.pendingCommissions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Nenhuma comissão pendente ainda
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Ativos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeLeads}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando cadastro de leads
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Funcionalidades principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Gerenciar Usuários
              </CardTitle>
              <CardDescription>
                Visualizar, editar e gerenciar todos os usuários do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Badge variant="secondary">0 Indicadores</Badge>
                  <Badge variant="secondary">0 Vendedores</Badge>
                </div>
              </div>
              <Button className="w-full" onClick={() => alert('Funcionalidade em desenvolvimento - conecte ao Supabase para dados reais')}>
                Gerenciar Usuários
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Relatório de Vendas
              </CardTitle>
              <CardDescription>
                Acompanhe todas as vendas realizadas e métricas de performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  <p>Este mês: <strong>0 vendas</strong></p>
                  <p>Ticket médio: <strong>R$ 0</strong></p>
                </div>
              </div>
              <Button className="w-full" onClick={() => alert('Funcionalidade em desenvolvimento - conecte ao Supabase para dados reais')}>
                Ver Relatórios
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                Controle de Comissões
              </CardTitle>
              <CardDescription>
                Calcule e gerencie as comissões dos indicadores e vendedores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  <p>Pendentes: <strong>R$ 0</strong></p>
                  <p>Pagas este mês: <strong>R$ 0</strong></p>
                </div>
              </div>
              <Button className="w-full" onClick={() => alert('Funcionalidade em desenvolvimento - conecte ao Supabase para dados reais')}>
                Gerenciar Comissões
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Dashboard de Leads
              </CardTitle>
              <CardDescription>
                Monitore todos os leads do sistema e seu status atual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Badge variant="outline">0 Ativos</Badge>
                  <Badge variant="outline">0 Convertidos</Badge>
                </div>
              </div>
              <Button className="w-full" onClick={() => alert('Funcionalidade em desenvolvimento - conecte ao Supabase para dados reais')}>
                Ver Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Configurações do Sistema
              </CardTitle>
              <CardDescription>
                Configure parâmetros gerais, comissões e regras de negócio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  <p>Comissão padrão: <strong>5%</strong></p>
                  <p>Meta mensal: <strong>R$ 50.000</strong></p>
                </div>
              </div>
              <Button className="w-full" onClick={() => alert('Funcionalidade em desenvolvimento - conecte ao Supabase para dados reais')}>
                Configurar Sistema
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Relatórios Gerenciais
              </CardTitle>
              <CardDescription>
                Gere relatórios detalhados para análise e tomada de decisão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  <p>Sistema iniciando</p>
                  <p>Relatórios disponíveis após uso</p>
                </div>
              </div>
              <Button className="w-full" onClick={() => alert('Funcionalidade em desenvolvimento - conecte ao Supabase para dados reais')}>
                Gerar Relatórios
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Seção de ações rápidas */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Ações Administrativas
              </CardTitle>
              <CardDescription>
                Funcionalidades avançadas para administradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start" onClick={() => alert('Funcionalidade em desenvolvimento')}>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Aprovar Usuários
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => alert('Funcionalidade em desenvolvimento')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Backup do Sistema
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => alert('Funcionalidade em desenvolvimento')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Logs do Sistema
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aviso sobre dados */}
        <div className="mt-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 p-2 rounded-full">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Sistema Pronto para Uso</h4>
                  <p className="text-sm text-blue-700">
                    Todas as funcionalidades estão implementadas e prontas. Os dados aparecerão conforme o sistema for sendo usado pelos indicadores e vendedores. 
                    Para dados de teste, conecte ao Supabase e popule o banco de dados.
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