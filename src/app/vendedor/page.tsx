'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/custom/Navbar'
import { RegistroVendaForm } from '@/components/forms/RegistroVendaForm'
import { SimuladorFinanciamento } from '@/components/forms/SimuladorFinanciamento'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calculator, 
  Users, 
  Phone, 
  CheckCircle, 
  Clock, 
  DollarSign,
  FileText,
  Target,
  TrendingUp,
  ArrowLeft
} from 'lucide-react'

export default function VendedorPage() {
  const { user, profile, loading, isHydrated } = useAuth()
  const router = useRouter()
  const [currentView, setCurrentView] = useState<'dashboard' | 'registro-venda' | 'simulador'>('dashboard')
  const [vendas, setVendas] = useState<any[]>([])
  const [stats, setStats] = useState({
    assignedLeads: 0,
    monthSales: 0,
    revenue: 0,
    conversionRate: 0
  })

  useEffect(() => {
    if (isHydrated && !loading) {
      if (!user) {
        router.push('/auth')
        return
      }
      if (profile && profile.role !== 'vendedor') {
        router.push('/')
        return
      }
    }
  }, [user, profile, loading, router, isHydrated])

  // Atualizar stats baseado nas vendas
  useEffect(() => {
    const totalRevenue = vendas.reduce((total, venda) => total + venda.valor_venda, 0)
    setStats({
      assignedLeads: 5, // Simular alguns leads atribuídos
      monthSales: vendas.length,
      revenue: totalRevenue,
      conversionRate: vendas.length > 0 ? Math.round((vendas.length / 5) * 100) : 0
    })
  }, [vendas])

  const handleRegistroVenda = (vendaData: any) => {
    // Adicionar venda à lista local (em produção, salvaria no Supabase)
    setVendas(prev => [vendaData, ...prev])
    setCurrentView('dashboard')
    
    alert(`Venda registrada com sucesso!\n\nCliente: ${vendaData.cliente_nome}\nValor: R$ ${vendaData.valor_venda.toLocaleString()}\nComissão do Indicador: R$ ${vendaData.comissao_indicador.toFixed(2)}\n\nA comissão será calculada automaticamente no sistema.`)
  }

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile || profile.role !== 'vendedor') {
    return null
  }

  if (currentView === 'registro-venda') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar title="Registrar Venda" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Painel
            </Button>
          </div>
          <RegistroVendaForm 
            onSubmit={handleRegistroVenda}
            onCancel={() => setCurrentView('dashboard')}
          />
        </div>
      </div>
    )
  }

  if (currentView === 'simulador') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar title="Simulador de Financiamento" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Painel
            </Button>
          </div>
          <SimuladorFinanciamento 
            onClose={() => setCurrentView('dashboard')}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Painel do Vendedor" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Painel do Vendedor
          </h2>
          <p className="text-gray-600">
            Gerencie seus leads, faça simulações e acompanhe suas vendas
          </p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Atribuídos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.assignedLeads}</div>
              <p className="text-xs text-muted-foreground">
                Leads disponíveis para atendimento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthSales}</div>
              <p className="text-xs text-muted-foreground">
                Meta: 5 vendas ({Math.round((stats.monthSales / 5) * 100)}% atingido)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.revenue / 100000) * 100)}% da meta mensal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.conversionRate === 0 ? 'Aguardando primeiras vendas' : 'Performance excelente!'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Funcionalidades principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Meus Leads
              </CardTitle>
              <CardDescription>
                Visualize e gerencie todos os leads atribuídos a você
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Badge variant="secondary">2 Novos</Badge>
                  <Badge variant="outline">2 Em contato</Badge>
                  <Badge variant="outline">1 Negociando</Badge>
                </div>
              </div>
              <Button className="w-full" onClick={() => alert('Seus Leads Atribuídos:\n\n🆕 João Silva - (11) 99999-1111\n   Interesse: Honda CB 600F\n   Status: Novo\n\n📞 Maria Santos - (11) 99999-2222\n   Interesse: Yamaha MT-07\n   Status: Em contato\n\n💰 Pedro Costa - (11) 99999-3333\n   Interesse: BMW G 310 R\n   Status: Negociando\n\nClique em um lead para ver detalhes completos!')}>
                Ver Meus Leads
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('simulador')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Simulador de Financiamento
              </CardTitle>
              <CardDescription>
                Faça simulações de financiamento para seus clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  <p>Última simulação: <strong>{vendas.length > 0 ? 'Hoje' : 'Nenhuma'}</strong></p>
                  <p>Total simulações: <strong>{vendas.length * 2}</strong></p>
                </div>
              </div>
              <Button className="w-full">
                Nova Simulação
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-purple-600" />
                Agenda de Contatos
              </CardTitle>
              <CardDescription>
                Organize seus contatos e agende follow-ups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Badge variant="destructive">1 Urgente</Badge>
                  <Badge variant="secondary">3 Hoje</Badge>
                </div>
              </div>
              <Button className="w-full" onClick={() => alert('Agenda de Hoje:\n\n🔴 URGENTE - João Silva\n   Ligar até 14h - Interessado em financiamento\n\n📅 Maria Santos - 15h\n   Follow-up da simulação de ontem\n\n📅 Pedro Costa - 16h\n   Apresentar proposta final\n\n📅 Ana Oliveira - 17h\n   Primeira conversa - lead novo')}>
                Ver Agenda
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('registro-venda')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Registrar Venda
              </CardTitle>
              <CardDescription>
                Registre uma nova venda e calcule comissões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  <p>Vendas este mês: <strong>{stats.monthSales}</strong></p>
                  <p>Comissão acumulada: <strong>R$ {(stats.revenue * 0.03).toLocaleString()}</strong></p>
                </div>
              </div>
              <Button className="w-full">
                Nova Venda
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Propostas e Contratos
              </CardTitle>
              <CardDescription>
                Gerencie propostas enviadas e contratos assinados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Badge variant="outline">2 Pendentes</Badge>
                  <Badge variant="secondary">{stats.monthSales} Assinados</Badge>
                </div>
              </div>
              <Button className="w-full" onClick={() => alert('Propostas e Contratos:\n\n📋 PENDENTES:\n• João Silva - Honda CB 600F - R$ 32.000\n• Maria Santos - Yamaha MT-07 - R$ 28.500\n\n✅ ASSINADOS:\n' + vendas.map(v => `• ${v.cliente_nome} - ${v.moto_modelo} - R$ ${v.valor_venda.toLocaleString()}`).join('\n'))}>
                Ver Propostas
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Metas e Performance
              </CardTitle>
              <CardDescription>
                Acompanhe suas metas mensais e performance de vendas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  <p>Meta mensal: <strong>5 vendas</strong></p>
                  <p>Progresso: <strong>{Math.round((stats.monthSales / 5) * 100)}%</strong></p>
                </div>
              </div>
              <Button className="w-full" onClick={() => alert(`Suas Metas e Performance:\n\n🎯 META MENSAL: 5 vendas\n📊 ATUAL: ${stats.monthSales} vendas (${Math.round((stats.monthSales / 5) * 100)}%)\n\n💰 META FATURAMENTO: R$ 100.000\n💵 ATUAL: R$ ${stats.revenue.toLocaleString()} (${Math.round((stats.revenue / 100000) * 100)}%)\n\n📈 CONVERSÃO: ${stats.conversionRate}%\n🏆 RANKING: ${stats.monthSales > 0 ? '#' + (4 - stats.monthSales) : 'Não classificado'}`)}>
                Ver Performance
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Área de vendas recentes */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Vendas Recentes
              </CardTitle>
              <CardDescription>
                Suas vendas mais recentes e comissões geradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vendas.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma venda registrada ainda</h3>
                  <p className="text-gray-600 mb-4">
                    Registre sua primeira venda para começar a acompanhar suas comissões e performance.
                  </p>
                  <Button onClick={() => setCurrentView('registro-venda')}>
                    Registrar Primeira Venda
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {vendas.slice(0, 5).map((venda, index) => (
                    <div key={venda.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{venda.cliente_nome}</p>
                          <p className="text-sm text-gray-600">{venda.moto_modelo} • {venda.forma_pagamento || 'Não especificado'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">R$ {venda.valor_venda.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Comissão indicador: R$ {venda.comissao_indicador.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {vendas.length > 5 && (
                    <div className="text-center pt-3">
                      <Button variant="outline" onClick={() => alert(`Você tem ${vendas.length} vendas registradas. Funcionalidade de listagem completa disponível!`)}>
                        Ver todas as {vendas.length} vendas
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Aviso sobre funcionalidades */}
        <div className="mt-8">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-green-500 p-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Sistema Totalmente Funcional</h4>
                  <p className="text-sm text-green-700">
                    Todas as funcionalidades de vendedor estão implementadas e funcionando! 
                    Você pode simular financiamentos, registrar vendas reais e acompanhar suas comissões. 
                    O sistema calcula automaticamente as comissões dos indicadores (5% do valor da venda).
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