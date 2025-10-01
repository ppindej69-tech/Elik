import { useState } from 'react'
import { Plus, Trash2, Calculator, FileText, Clock, Ruler, Package, Hash } from 'lucide-react'
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
    typVypoctuPrace: 'hodiny',
    typVypoctuMaterial: 'celkova'
  })

  const addItem = () => {
    if (!newItem.nazev || !newItem.nazev.trim()) {
      alert('Zadejte název položky')
      return
    }
    
    const item: CalculationItem = {
      id: Date.now().toString(),
      nazev: newItem.nazev.trim(),
      typ: newItem.typ || 'prace',
      typVypoctuPrace: newItem.typ === 'prace' ? (newItem.typVypoctuPrace || 'hodiny') : undefined,
      typVypoctuMaterial: newItem.typ === 'material' ? (newItem.typVypoctuMaterial || 'celkova') : undefined,
      pocetHodin: newItem.pocetHodin || 0,
      sazbaHodina: newItem.typ === 'prace' && newItem.typVypoctuPrace === 'hodiny' ? settings.standardniSazba : undefined,
      pocetMetru: newItem.pocetMetru || 0,
      sazbaZaMetr: newItem.typ === 'prace' && newItem.typVypoctuPrace === 'metry' ? settings.standardniSazbaMetr : undefined,
      cenaMaterial: newItem.cenaMaterial || 0,
      pocetKusu: newItem.pocetKusu || 0,
      cenaZaKus: newItem.cenaZaKus || 0,
      pocetMetruMaterial: newItem.pocetMetruMaterial || 0,
      cenaZaMetrMaterial: newItem.cenaZaMetrMaterial || 0,
      pausalniCena: newItem.pausalniCena,
      poznamka: newItem.poznamka
    }
    
    onItemsChange([...items, item])
    setNewItem({
      typ: 'prace',
      nazev: '',
      typVypoctuPrace: 'hodiny',
      typVypoctuMaterial: 'celkova'
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
        if (item.typVypoctuPrace === 'hodiny') {
          const hodiny = item.pocetHodin || 0
          const sazba = item.sazbaHodina || settings.standardniSazba
          return hodiny * sazba
        } else if (item.typVypoctuPrace === 'metry') {
          const metry = item.pocetMetru || 0
          const sazba = item.sazbaZaMetr || settings.standardniSazbaMetr
          return metry * sazba
        }
        return 0
      case 'material':
        if (item.typVypoctuMaterial === 'celkova') {
          return item.cenaMaterial || 0
        } else if (item.typVypoctuMaterial === 'kusy') {
          return (item.pocetKusu || 0) * (item.cenaZaKus || 0)
        } else if (item.typVypoctuMaterial === 'metry') {
          return (item.pocetMetruMaterial || 0) * (item.cenaZaMetrMaterial || 0)
        }
        return 0
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sazba za hodinu (Kč/hod)
                  </label>
                  <input
                    type="number"
                    value={settings.standardniSazba}
                    onChange={(e) => onSettingsChange({ ...settings, standardniSazba: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sazba za metr (Kč/m)
                  </label>
                  <input
                    type="number"
                    value={settings.standardniSazbaMetr}
                    onChange={(e) => onSettingsChange({ ...settings, standardniSazbaMetr: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doprava (Kč)
                  </label>
                  <input
                    type="number"
                    value={settings.dopravniNaklady}
                    onChange={(e) => onSettingsChange({ ...settings, dopravniNaklady: Number(e.target.value) || 0 })}
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
                    onChange={(e) => onSettingsChange({ ...settings, nakladyJidlo: Number(e.target.value) || 0 })}
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
                  Název položky *
                </label>
                <input
                  type="text"
                  value={newItem.nazev}
                  onChange={(e) => setNewItem({ ...newItem, nazev: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Název práce/materiálu..."
                  required
                />
              </div>
              
              {/* Typ výpočtu pro práci */}
              {newItem.typ === 'prace' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Typ výpočtu
                  </label>
                  <select
                    value={newItem.typVypoctuPrace || 'hodiny'}
                    onChange={(e) => setNewItem({ ...newItem, typVypoctuPrace: e.target.value as 'hodiny' | 'metry' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="hodiny">Za hodiny</option>
                    <option value="metry">Za metry</option>
                  </select>
                </div>
              )}
              
              {/* Typ výpočtu pro materiál */}
              {newItem.typ === 'material' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Typ výpočtu
                  </label>
                  <select
                    value={newItem.typVypoctuMaterial || 'celkova'}
                    onChange={(e) => setNewItem({ ...newItem, typVypoctuMaterial: e.target.value as 'celkova' | 'kusy' | 'metry' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="celkova">Celková cena</option>
                    <option value="kusy">Podle kusů</option>
                    <option value="metry">Podle metrů</option>
                  </select>
                </div>
              )}
            </div>
            
            {/* Dodatečné pole pro práci */}
            {newItem.typ === 'prace' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newItem.typVypoctuPrace === 'hodiny' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Počet hodin
                    </label>
                    <input
                      type="number"
                      value={newItem.pocetHodin || ''}
                      onChange={(e) => setNewItem({ ...newItem, pocetHodin: Number(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      min="0"
                      step="0.5"
                      placeholder="8"
                    />
                  </div>
                )}
                {newItem.typVypoctuPrace === 'metry' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Počet metrů
                    </label>
                    <input
                      type="number"
                      value={newItem.pocetMetru || ''}
                      onChange={(e) => setNewItem({ ...newItem, pocetMetru: Number(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      min="0"
                      step="0.5"
                      placeholder="10"
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* Dodatečné pole pro materiál */}
            {newItem.typ === 'material' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newItem.typVypoctuMaterial === 'celkova' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Celková cena (Kč)
                    </label>
                    <input
                      type="number"
                      value={newItem.cenaMaterial || ''}
                      onChange={(e) => setNewItem({ ...newItem, cenaMaterial: Number(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      min="0"
                      step="10"
                      placeholder="1500"
                    />
                  </div>
                )}
                {newItem.typVypoctuMaterial === 'kusy' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Počet kusů
                      </label>
                      <input
                        type="number"
                        value={newItem.pocetKusu || ''}
                        onChange={(e) => setNewItem({ ...newItem, pocetKusu: Number(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        min="0"
                        step="1"
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cena za kus (Kč)
                      </label>
                      <input
                        type="number"
                        value={newItem.cenaZaKus || ''}
                        onChange={(e) => setNewItem({ ...newItem, cenaZaKus: Number(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        min="0"
                        step="5"
                        placeholder="50"
                      />
                    </div>
                  </>
                )}
                {newItem.typVypoctuMaterial === 'metry' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Počet metrů
                      </label>
                      <input
                        type="number"
                        value={newItem.pocetMetruMaterial || ''}
                        onChange={(e) => setNewItem({ ...newItem, pocetMetruMaterial: Number(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        min="0"
                        step="0.5"
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cena za metr (Kč)
                      </label>
                      <input
                        type="number"
                        value={newItem.cenaZaMetrMaterial || ''}
                        onChange={(e) => setNewItem({ ...newItem, cenaZaMetrMaterial: Number(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        min="0"
                        step="5"
                        placeholder="80"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
            
            <div className="flex justify-end">
              <Button 
                onClick={addItem} 
                className="bg-green-600 hover:bg-green-700"
                disabled={!newItem.nazev || !newItem.nazev.trim()}
              >
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
              Položky kalkulace ({items.length})
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
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/80 flex items-center gap-1">
                          {item.typ === 'prace' && item.typVypoctuPrace === 'hodiny' && <Clock className="h-3 w-3" />}
                          {item.typ === 'prace' && item.typVypoctuPrace === 'metry' && <Ruler className="h-3 w-3" />}
                          {item.typ === 'material' && item.typVypoctuMaterial === 'kusy' && <Hash className="h-3 w-3" />}
                          {item.typ === 'material' && item.typVypoctuMaterial === 'metry' && <Ruler className="h-3 w-3" />}
                          {item.typ === 'material' && item.typVypoctuMaterial === 'celkova' && <Package className="h-3 w-3" />}
                          {typeLabels[item.typ]}
                          {item.typ === 'prace' && ` - ${item.typVypoctuPrace === 'hodiny' ? 'za hodiny' : 'za metry'}`}
                          {item.typ === 'material' && ` - ${item.typVypoctuMaterial === 'celkova' ? 'celková cena' : item.typVypoctuMaterial === 'kusy' ? 'po kusech' : 'po metrech'}`}
                        </span>
                        <h3 className="font-medium text-gray-900">{item.nazev}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {/* Práce - hodinová sazba */}
                        {item.typ === 'prace' && item.typVypoctuPrace === 'hodiny' && (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Počet hodin
                              </label>
                              <input
                                type="number"
                                value={item.pocetHodin || ''}
                                onChange={(e) => updateItem(item.id, { pocetHodin: Number(e.target.value) || 0 })}
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
                                onChange={(e) => updateItem(item.id, { sazbaHodina: Number(e.target.value) || 0 })}
                                className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                                step="50"
                              />
                            </div>
                          </>
                        )}
                        
                        {/* Práce - metrová sazba */}
                        {item.typ === 'prace' && item.typVypoctuPrace === 'metry' && (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Počet metrů
                              </label>
                              <input
                                type="number"
                                value={item.pocetMetru || ''}
                                onChange={(e) => updateItem(item.id, { pocetMetru: Number(e.target.value) || 0 })}
                                className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                                step="0.5"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Sazba (Kč/m)
                              </label>
                              <input
                                type="number"
                                value={item.sazbaZaMetr || ''}
                                onChange={(e) => updateItem(item.id, { sazbaZaMetr: Number(e.target.value) || 0 })}
                                className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                                step="10"
                              />
                            </div>
                          </>
                        )}
                        
                        {/* Materiál - celková cena */}
                        {item.typ === 'material' && item.typVypoctuMaterial === 'celkova' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Celková cena (Kč)
                            </label>
                            <input
                              type="number"
                              value={item.cenaMaterial || ''}
                              onChange={(e) => updateItem(item.id, { cenaMaterial: Number(e.target.value) || 0 })}
                              className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="0"
                              step="10"
                            />
                          </div>
                        )}
                        
                        {/* Materiál - podle kusů */}
                        {item.typ === 'material' && item.typVypoctuMaterial === 'kusy' && (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Počet kusů
                              </label>
                              <input
                                type="number"
                                value={item.pocetKusu || ''}
                                onChange={(e) => updateItem(item.id, { pocetKusu: Number(e.target.value) || 0 })}
                                className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                                step="1"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Cena za kus (Kč)
                              </label>
                              <input
                                type="number"
                                value={item.cenaZaKus || ''}
                                onChange={(e) => updateItem(item.id, { cenaZaKus: Number(e.target.value) || 0 })}
                                className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                                step="5"
                              />
                            </div>
                          </>
                        )}
                        
                        {/* Materiál - podle metrů */}
                        {item.typ === 'material' && item.typVypoctuMaterial === 'metry' && (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Počet metrů
                              </label>
                              <input
                                type="number"
                                value={item.pocetMetruMaterial || ''}
                                onChange={(e) => updateItem(item.id, { pocetMetruMaterial: Number(e.target.value) || 0 })}
                                className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                                step="0.5"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Cena za metr (Kč)
                              </label>
                              <input
                                type="number"
                                value={item.cenaZaMetrMaterial || ''}
                                onChange={(e) => updateItem(item.id, { cenaZaMetrMaterial: Number(e.target.value) || 0 })}
                                className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                                step="5"
                              />
                            </div>
                          </>
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
                      className="hover:scale-105 transition-transform"
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