'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserPlus, Phone, Mail, User, MapPin, DollarSign } from 'lucide-react'

interface CadastroLeadFormProps {
  onSubmit: (leadData: any) => void
  onCancel: () => void
}

export function CadastroLeadForm({ onSubmit, onCancel }: CadastroLeadFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    cidade: '',
    interesse: '',
    orcamento: '',
    observacoes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.nome || !formData.telefone) {
      alert('Nome e telefone são obrigatórios!')
      return
    }

    // Simular salvamento (aqui você conectaria ao Supabase)
    const leadCompleto = {
      ...formData,
      id: Date.now(), // ID temporário
      status: 'novo',
      data_cadastro: new Date().toISOString(),
      indicador_id: 'current_user' // Seria o ID do usuário logado
    }

    onSubmit(leadCompleto)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-blue-600" />
          Cadastrar Novo Lead
        </CardTitle>
        <CardDescription>
          Preencha as informações do cliente interessado em comprar uma moto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome Completo *
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder="Ex: João Silva"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone *
              </Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="joao@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Cidade
              </Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => handleChange('cidade', e.target.value)}
                placeholder="São Paulo - SP"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interesse">Tipo de Moto de Interesse</Label>
              <Select onValueChange={(value) => handleChange('interesse', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scooter">Scooter</SelectItem>
                  <SelectItem value="street">Street</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                  <SelectItem value="naked">Naked</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orcamento" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Orçamento Aproximado
              </Label>
              <Select onValueChange={(value) => handleChange('orcamento', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Faixa de preço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ate-10k">Até R$ 10.000</SelectItem>
                  <SelectItem value="10k-20k">R$ 10.000 - R$ 20.000</SelectItem>
                  <SelectItem value="20k-30k">R$ 20.000 - R$ 30.000</SelectItem>
                  <SelectItem value="30k-50k">R$ 30.000 - R$ 50.000</SelectItem>
                  <SelectItem value="acima-50k">Acima de R$ 50.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações Adicionais</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              placeholder="Informações adicionais sobre o cliente, preferências, urgência, etc."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <UserPlus className="h-4 w-4 mr-2" />
              Cadastrar Lead
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