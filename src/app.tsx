import { useState } from 'react'
import { Zap, FileSpreadsheet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CalculationForm from '@/components/calculation-form'
import CalculationSummary from '@/components/calculation-summary'
import { CalculationItem, CalculationSettings } from '@/types/calculation'

export default function App() {
  const [items, setItems] = useState<CalculationItem[]>([])
  const [settings, setSettings] = useState<CalculationSettings>({
    nazevProjektu: '',
    zakaznik: '',
    datum: new Date().toISOString().split('T')[0],
    standardniSazba: 800,
    dopravniNaklady: 500,
    nakladyJidlo: 300
  })

  const handleExport = () => {
    // Zde by byla implementace exportu do PDF/Excel
    alert('Export funkce bude implementována v další verzi')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ELIK
                </h1>
                <p className="text-gray-600 font-medium">Elektroinstalační kalkulace</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Verze 1.0</div>
                <div className="text-sm font-medium text-gray-700">Pro elektrikáře</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Úvodní informace */}
        <Card className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8" />
              Profesionální kalkulace elektroinstalací
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-100 text-lg leading-relaxed">
              Jednoduše spočítejte celkovou cenu vašich projektů. Zadejte hodinové sazby, 
              náklady na materiál, dopravu a ostatní položky. Aplikace automaticky vypočítá 
              celkovou cenu nabídky včetně DPH.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">{items.length}</div>
                <div className="text-indigo-100 text-sm">Položek v kalkulaci</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">
                  {items.filter(item => item.typ === 'prace').reduce((sum, item) => sum + (item.pocetHodin || 0), 0)}h
                </div>
                <div className="text-indigo-100 text-sm">Celkem hodin práce</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">
                  {items.length > 0 ? 
                    Math.round(items.reduce((sum, item) => {
                      if (item.typ === 'prace') {
                        return sum + (item.pocetHodin || 0) * (item.sazbaHodina || settings.standardniSazba)
                      } else if (item.typ === 'material') {
                        return sum + (item.cenaMaterial || 0)
                      } else if (item.typ === 'doprava') {
                        return sum + settings.dopravniNaklady
                      } else if (item.typ === 'jidlo') {
                        return sum + settings.nakladyJidlo
                      }
                      return sum + (item.pausalniCena || 0)
                    }, 0) * 1.21).toLocaleString('cs-CZ')
                    : '0'
                  } Kč
                </div>
                <div className="text-indigo-100 text-sm">Celkem s DPH</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Formulář - 2/3 šířky */}
          <div className="xl:col-span-2">
            <CalculationForm 
              items={items}
              settings={settings}
              onItemsChange={setItems}
              onSettingsChange={setSettings}
            />
          </div>
          
          {/* Souhrn - 1/3 šířky */}
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <CalculationSummary 
                items={items}
                settings={settings}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-200 bg-white/50 backdrop-blur-sm rounded-lg">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              ELIK - Elektroinstalační kalkulace pro profesionály
            </p>
            <p className="text-sm text-gray-500">
              Vytvořeno pro jednoduché a přesné kalkulace elektroinstalačních prací
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}