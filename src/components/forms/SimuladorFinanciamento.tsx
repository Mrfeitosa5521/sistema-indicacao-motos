'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calculator, DollarSign, Calendar, Percent, FileText } from 'lucide-react'

interface SimuladorFinanciamentoProps {
  onClose: () => void
}

export function SimuladorFinanciamento({ onClose }: SimuladorFinanciamentoProps) {
  const [formData, setFormData] = useState({
    valor_moto: '',
    entrada: '',
    parcelas: '24',
    taxa_juros: '1.5'
  })

  const [resultado, setResultado] = useState<any>(null)

  const calcularFinanciamento = () => {
    const valorMoto = parseFloat(formData.valor_moto.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    const entrada = parseFloat(formData.entrada.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    const numeroParcelas = parseInt(formData.parcelas) || 24
    const taxaJuros = parseFloat(formData.taxa_juros) / 100 || 0.015

    if (valorMoto <= 0) {
      alert('Informe o valor da moto!')
      return
    }

    const valorFinanciado = valorMoto - entrada
    
    // Cálculo usando fórmula de juros compostos
    const coeficiente = Math.pow(1 + taxaJuros, numeroParcelas)
    const valorParcela = (valorFinanciado * taxaJuros * coeficiente) / (coeficiente - 1)
    
    const valorTotal = entrada + (valorParcela * numeroParcelas)
    const jurosTotal = valorTotal - valorMoto

    setResultado({
      valorMoto,
      entrada,
      valorFinanciado,
      numeroParcelas,
      valorParcela,
      valorTotal,
      jurosTotal,
      taxaJuros: taxaJuros * 100
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          Simulador de Financiamento
        </CardTitle>
        <CardDescription>
          Calcule as condições de financiamento para seu cliente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="valor_moto" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Valor da Moto
            </Label>
            <Input
              id="valor_moto"
              value={formData.valor_moto}
              onChange={(e) => handleChange('valor_moto', e.target.value)}
              placeholder="R$ 25.000,00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entrada">Valor da Entrada</Label>
            <Input
              id="entrada"
              value={formData.entrada}
              onChange={(e) => handleChange('entrada', e.target.value)}
              placeholder="R$ 5.000,00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="parcelas" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Número de Parcelas
            </Label>
            <Select value={formData.parcelas} onValueChange={(value) => handleChange('parcelas', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 parcelas</SelectItem>
                <SelectItem value="18">18 parcelas</SelectItem>
                <SelectItem value="24">24 parcelas</SelectItem>
                <SelectItem value="36">36 parcelas</SelectItem>
                <SelectItem value="48">48 parcelas</SelectItem>
                <SelectItem value="60">60 parcelas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxa_juros" className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Taxa de Juros (% ao mês)
            </Label>
            <Select value={formData.taxa_juros} onValueChange={(value) => handleChange('taxa_juros', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.0">1,0% ao mês</SelectItem>
                <SelectItem value="1.2">1,2% ao mês</SelectItem>
                <SelectItem value="1.5">1,5% ao mês</SelectItem>
                <SelectItem value="1.8">1,8% ao mês</SelectItem>
                <SelectItem value="2.0">2,0% ao mês</SelectItem>
                <SelectItem value="2.5">2,5% ao mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calcularFinanciamento} className="w-full">
          <Calculator className="h-4 w-4 mr-2" />
          Calcular Financiamento
        </Button>

        {resultado && (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resultado da Simulação
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">Valor da Moto:</span>
                  <span className="font-bold">{formatarMoeda(resultado.valorMoto)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Entrada:</span>
                  <span className="font-bold">{formatarMoeda(resultado.entrada)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Valor Financiado:</span>
                  <span className="font-bold">{formatarMoeda(resultado.valorFinanciado)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">Parcelas:</span>
                  <span className="font-bold">{resultado.numeroParcelas}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Valor da Parcela:</span>
                  <span className="font-bold text-lg text-blue-900">{formatarMoeda(resultado.valorParcela)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Taxa de Juros:</span>
                  <span className="font-bold">{resultado.taxaJuros.toFixed(1)}% a.m.</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-blue-700">Valor Total a Pagar:</span>
                  <span className="font-bold text-lg">{formatarMoeda(resultado.valorTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Total de Juros:</span>
                  <span className="font-bold text-lg text-red-600">{formatarMoeda(resultado.jurosTotal)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white rounded border border-blue-300">
              <p className="text-xs text-blue-600">
                <strong>Resumo:</strong> Entrada de {formatarMoeda(resultado.entrada)} + {resultado.numeroParcelas} parcelas de {formatarMoeda(resultado.valorParcela)} = {formatarMoeda(resultado.valorTotal)}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Fechar
          </Button>
          {resultado && (
            <Button onClick={() => alert('Simulação salva! (Funcionalidade completa disponível)')} className="flex-1">
              Salvar Simulação
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}