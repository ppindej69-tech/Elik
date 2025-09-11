import { useState } from 'react'
import { Plus, Trash2, Calculator, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalculationItem, CalculationSettings } from '@/types/calculation'
import { cn } from '@/lib/utils'

interface CalculationFormProps {
  items: CalculationItem[]
  settings: CalculationSettings
  onItemsChange: (items: CalculationItem[]) => void
  onSettingsChange: (settings: CalculationSettings) => void
}

export default function CalculationForm({ 
  items, 
  settings, 
  onItemsChange, 
  onSettingsChange 
}: CalculationFormProps) {
  const [newItem, setNewItem] = useState<Partial<CalculationItem>>({
    typ: 'prace',
    nazev: '',
    pocetHodin: undefined,
    metryCtverec: undefined
  })

  const addItem = () => {
    if (!newItem.nazev) return
    
    const item: CalculationItem = {
      id: Date.now().toString(),
      nazev: newItem.nazev,
      typ: newItem.typ || 'prace',
      pocetHodin: newItem.pocetHodin,
      sazbaHodina: newItem.typ === 'prace' ? settings.standardniSazba : undefined,
      metryCtverec: newItem.metryCtverec,
      cenaMaterial: newItem.cenaMaterial,
      pausalniCena: newItem.pausalniCena,
      poznamka: newItem.poznamka
    }
    
    onItemsChange([...items, item])
    setNewItem({
      typ: 'prace',
      nazev: '',
      pocetHodin: undefined,
      metryCtverec: undefined
    })
  }

  const removeItem = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id))
  }

  const updateItem = (id: string, updates: Partial<CalculationItem>) => {
    onItemsChange(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }

  const getItemTotal = (item: CalculationItem): number => {
    if (item.pausalniCena) return item.pausalniCena
    
    switch (item.typ) {
      case 'prace':
        const hodiny = item.pocetHodin || 0
        const sazba = item.sazbaHodina || settings.standardniSazba
        return hodiny * sazba
      case 'material':
        return item.cenaMaterial || 0
      case 'doprava':
        return settings.dopravniNaklady
      case 'jidlo':
        return settings.nakladyJidlo
      default:
        return 0
    }
  }

  const typeLabels = {
    prace: 'Práce',
    material: 'Materiál',
    doprava: 'Doprava',
    jidlo: 'Jídlo',
    ostatni: 'Ostatní'
  }

  const typeColors = {
    prace: 'bg-blue-50 border-blue-200',
    material: 'bg-green-50 border-green-200',
    doprava: 'bg-orange-50 border-orange-200',
    jidlo: 'bg-purple-50 border-purple-200',
    ostatni: 'bg-gray-50 border-gray-200'
  }

  return (
    <div className="space-y-8">
      {/* Nastavení projektu */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <FileText className="h-6 w-6" />
            Nastavení projektu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Název projektu
                </label>
                <input
                  type="text"
                  value={settings.nazevProjektu}
                  onChange={(e) => onSettingsChange({ ...settings, nazevProjektu: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Zadejte název projektu..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zákazník
                </label>
                <input
                  type="text"
                  value={settings.zakaznik}
                  onChange={(e) => onSettingsChange({ ...settings, zakaznik: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Jméno zákazníka..."
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Standardní sazba (Kč/hod)
                </label>
                <input
                  type="number"
                  value={settings.standardniSazba}
                  onChange={(e) => onSettingsChange({ ...settings, standardniSazba: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doprava (Kč)
                  </label>
                  <input
                    type="number"
                    value={settings.dopravniNaklady}
                    onChange={(e) => onSettingsChange({ ...settings, dopravniNaklady: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jídlo (Kč)
                  </label>
                  <input
                    type="number"
                    value={settings.nakladyJidlo}
                    onChange={(e) => onSettingsChange({ ...settings, nakladyJidlo: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="50"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Přidání nové položky */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Plus className="h-6 w-6" />
            Přidat novou položku
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Typ položky
                </label>
                <select
                  value={newItem.typ}
                  onChange={(e) => setNewItem({ ...newItem, typ: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Název položky
                </label>
                <input
                  type="text"
                  value={newItem.nazev}
                  onChange={(e) => setNewItem({ ...newItem, nazev: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Název práce/materiálu..."
                />
              </div>
              {newItem.typ === 'prace' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Počet hodin
                  </label>
                  <input
                    type="number"
                    value={newItem.pocetHodin || ''}
                    onChange={(e) => setNewItem({ ...newItem, pocetHodin: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    step="0.5"
                    placeholder="8"
                  />
                </div>
              )}
              {newItem.typ === 'material' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cena materiálu (Kč)
                  </label>
                  <input
                    type="number"
                    value={newItem.cenaMaterial || ''}
                    onChange={(e) => setNewItem({ ...newItem, cenaMaterial: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    step="10"
                    placeholder="1500"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button onClick={addItem} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Přidat položku
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seznam položek */}
      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              Položky kalkulace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "p-4 border rounded-lg transition-all hover:shadow-md",
                    typeColors[item.typ]
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/80">
                          {typeLabels[item.typ]}
                        </span>
                        <h3 className="font-medium text-gray-900">{item.nazev}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {item.typ === 'prace' && (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Počet hodin
                              </label>
                              <input
                                type="number"
                                value={item.pocetHodin || ''}
                                onChange={(e) => updateItem(item.id, { pocetHodin: Number(e.target.value) })}
                                className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                                step="0.5"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Sazba (Kč/hod)
                              </label>
                              <input
                                type="number"
                                value={item.sazbaHodina || ''}
                                onChange={(e) => updateItem(item.id, { sazbaHodina: Number(e.target.value) })}
                                className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                                step="50"
                              />
                            </div>
                          </>
                        )}
                        {item.typ === 'material' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Cena materiálu (Kč)
                            </label>
                            <input
                              type="number"
                              value={item.cenaMaterial || ''}
                              onChange={(e) => updateItem(item.id, { cenaMaterial: Number(e.target.value) })}
                              className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="0"
                              step="10"
                            />
                          </div>
                        )}
                        <div className="flex items-end">
                          <div className="text-right">
                            <div className="text-xs font-medium text-gray-600 mb-1">Celkem</div>
                            <div className="text-lg font-bold text-gray-900">
                              {getItemTotal(item).toLocaleString('cs-CZ')} Kč
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}