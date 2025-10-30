'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, DollarSign, User, Calendar, FileText } from 'lucide-react'

interface RegistroVendaFormProps {
  onSubmit: (vendaData: any) => void
  onCancel: () => void
}

export function RegistroVendaForm({ onSubmit, onCancel }: RegistroVendaFormProps) {
  const [formData, setFormData] = useState({
    cliente_nome: '',
    moto_modelo: '',
    valor_venda: '',
    forma_pagamento: '',
    data_venda: new Date().toISOString().split('T')[0],
    indicador_nome: '',
    comissao_indicador: '',
    observacoes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.cliente_nome || !formData.moto_modelo || !formData.valor_venda) {
      alert('Cliente, modelo da moto e valor são obrigatórios!')
      return
    }

    // Calcular comissão automaticamente (5% do valor da venda)
    const valorVenda = parseFloat(formData.valor_venda.replace(/[^\d,]/g, '').replace(',', '.'))
    const comissaoCalculada = valorVenda * 0.05

    // Simular salvamento (aqui você conectaria ao Supabase)
    const vendaCompleta = {
      ...formData,
      id: Date.now(), // ID temporário
      valor_venda: valorVenda,
      comissao_indicador: comissaoCalculada,
      status: 'concluida',
      vendedor_id: 'current_user', // Seria o ID do usuário logado
      data_registro: new Date().toISOString()
    }

    onSubmit(vendaCompleta)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Calcular comissão automaticamente quando valor da venda mudar
    if (field === 'valor_venda') {
      const valorLimpo = value.replace(/[^\d,]/g, '').replace(',', '.')
      const valorNumerico = parseFloat(valorLimpo) || 0
      const comissao = valorNumerico * 0.05
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        comissao_indicador: comissao.toFixed(2)
      }))
    }
  }

  const formatarMoeda = (valor: string) => {
    const numero = valor.replace(/\D/g, '')
    const valorFormatado = (parseInt(numero) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    return valorFormatado
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Registrar Nova Venda
        </CardTitle>
        <CardDescription>
          Registre uma venda realizada e calcule as comissões automaticamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente_nome" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome do Cliente *
              </Label>
              <Input
                id="cliente_nome"
                value={formData.cliente_nome}
                onChange={(e) => handleChange('cliente_nome', e.target.value)}
                placeholder="Ex: Maria Santos"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moto_modelo">Modelo da Moto *</Label>
              <Input
                id="moto_modelo"
                value={formData.moto_modelo}
                onChange={(e) => handleChange('moto_modelo', e.target.value)}
                placeholder="Ex: Honda CB 600F"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor_venda" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Valor da Venda *
              </Label>
              <Input
                id="valor_venda"
                value={formData.valor_venda}
                onChange={(e) => handleChange('valor_venda', e.target.value)}
                placeholder="R$ 25.000,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="forma_pagamento">Forma de Pagamento</Label>
              <Select onValueChange={(value) => handleChange('forma_pagamento', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a-vista">À Vista</SelectItem>
                  <SelectItem value="financiamento">Financiamento</SelectItem>
                  <SelectItem value="consorcio">Consórcio</SelectItem>
                  <SelectItem value="parcelado">Parcelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_venda" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data da Venda
              </Label>
              <Input
                id="data_venda"
                type="date"
                value={formData.data_venda}
                onChange={(e) => handleChange('data_venda', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="indicador_nome">Nome do Indicador</Label>
              <Input
                id="indicador_nome"
                value={formData.indicador_nome}
                onChange={(e) => handleChange('indicador_nome', e.target.value)}
                placeholder="Quem indicou este cliente?"
              />
            </div>
          </div>

          {formData.valor_venda && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Cálculo de Comissão</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-green-700">Valor da Venda:</p>
                  <p className="font-bold text-green-900">R$ {formData.valor_venda}</p>
                </div>
                <div>
                  <p className="text-green-700">Comissão do Indicador (5%):</p>
                  <p className="font-bold text-green-900">R$ {formData.comissao_indicador}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="observacoes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Observações
            </Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              placeholder="Detalhes adicionais sobre a venda, condições especiais, etc."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Registrar Venda
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}