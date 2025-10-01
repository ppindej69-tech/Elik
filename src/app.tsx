import { useState } from 'react'
import { Zap, FileSpreadsheet, Download, Calculator, Clock, Ruler, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import CalculationForm from '@/components/calculation-form'
import CalculationSummary from '@/components/calculation-summary'
import { CalculationItem, CalculationSettings } from '@/types/calculation'
import { generatePDF } from '@/utils/pdf-generator'

export default function App() {
  const [items, setItems] = useState<CalculationItem[]>([])
  const [settings, setSettings] = useState<CalculationSettings>({
    nazevProjektu: '',
    zakaznik: '',
    datum: new Date().toISOString().split('T')[0],
    standardniSazba: 800,
    standardniSazbaMetr: 150,
    dopravniNaklady: 500,
    nakladyJidlo: 300
  })

  const handleExportPDF = () => {
    if (items.length === 0) {
      alert('Přidejte alespoň jednu položku do kalkulace před exportem.')
      return
    }
    
    try {
      generatePDF({ items, settings })
    } catch (error) {
      console.error('Chyba při exportu PDF:', error)
      alert('Došlo k chybě při exportu PDF. Zkuste to prosím znovu.')
    }
  }

  const calculateTotalHours = () => {
    return items
      .filter(item => item.typ === 'prace' && item.typVypoctuPrace === 'hodiny')
      .reduce((sum, item) => sum + (item.pocetHodin || 0), 0)
  }

  const calculateTotalMeters = () => {
    return items
      .filter(item => item.typ === 'prace' && item.typVypoctuPrace === 'metry')
      .reduce((sum, item) => sum + (item.pocetMetru || 0), 0)
  }

  const calculateTotalPrice = () => {
    return items.reduce((sum, item) => {
      let itemTotal = 0
      
      if (item.pausalniCena) {
        return sum + item.pausalniCena
      }
      
      switch (item.typ) {
        case 'prace':
          if (item.typVypoctuPrace === 'hodiny') {
            itemTotal = (item.pocetHodin || 0) * (item.sazbaHodina || settings.standardniSazba)
          } else if (item.typVypoctuPrace === 'metry') {
            itemTotal = (item.pocetMetru || 0) * (item.sazbaZaMetr || settings.standardniSazbaMetr)
          }
          break
        case 'material':
          if (item.typVypoctuMaterial === 'celkova') {
            itemTotal = item.cenaMaterial || 0
          } else if (item.typVypoctuMaterial === 'kusy') {
            itemTotal = (item.pocetKusu || 0) * (item.cenaZaKus || 0)
          } else if (item.typVypoctuMaterial === 'metry') {
            itemTotal = (item.pocetMetruMaterial || 0) * (item.cenaZaMetrMaterial || 0)
          }
          break
        case 'doprava':
          itemTotal = settings.dopravniNaklady
          break
        case 'jidlo':
          itemTotal = settings.nakladyJidlo
          break
      }
      
      return sum + itemTotal
    }, 0)
  }

  const totalPrice = calculateTotalPrice()

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
            <div className="flex items-center space-x-4">
              {/* Export PDF tlačítko */}
              {items.length > 0 && (
                <Button
                  onClick={handleExportPDF}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Stáhnout PDF
                </Button>
              )}
              <div className="hidden md:flex text-right">
                <div>
                  <div className="text-sm text-gray-500">Verze 2.0</div>
                  <div className="text-sm font-medium text-gray-700">Pro elektrikáře</div>
                </div>
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
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calculator className="h-8 w-8" />
                Profesionální kalkulace elektroinstalací
              </div>
              {items.length > 0 && (
                <Button
                  onClick={handleExportPDF}
                  variant="outline"
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 hover:text-white transition-all duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-indigo-100 text-lg leading-relaxed">
                🔧 <strong>Kompletní kalkulační systém pro elektrikáře:</strong><br/>
                ⚡ <strong>Práce:</strong> Zadávejte hodiny nebo metry s individuálními sazbami<br/>
                📦 <strong>Materiál:</strong> Počítejte podle kusů, metrů nebo celkové ceny<br/>
                🚗 <strong>Doprava a jídlo:</strong> Automatické přičítání fixních nákladů<br/>
                📊 <strong>PDF export:</strong> Profesionální kalkulace ke stažení<br/>
                💰 <strong>DPH:</strong> Automatický výpočet včetně 21% DPH
              </p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white mb-1">{items.length}</div>
                  <div className="text-indigo-100 text-sm">Položek v kalkulaci</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white mb-1">{calculateTotalHours()}h</div>
                  <div className="text-indigo-100 text-sm">Celkem hodin práce</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white mb-1">{calculateTotalMeters()}m</div>
                  <div className="text-indigo-100 text-sm">Celkem metrů práce</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-white mb-1">
                    {Math.round(totalPrice * 1.21).toLocaleString('cs-CZ')} Kč
                  </div>
                  <div className="text-indigo-100 text-sm">Celkem s DPH</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rychlý přehled funkcí */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Hodinová práce</h3>
                  <p className="text-blue-700 text-sm">Zadejte hodiny × sazba/hod</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <Ruler className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Metrová práce</h3>
                  <p className="text-green-700 text-sm">Zadejte metry × sazba/metr</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900">Materiál</h3>
                  <p className="text-purple-700 text-sm">Kusy, metry nebo celkem</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <FileSpreadsheet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-900">PDF Export</h3>
                  <p className="text-orange-700 text-sm">Profesionální kalkulace</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
            <div className="sticky top-24 space-y-6">
              <CalculationSummary 
                items={items}
                settings={settings}
              />
              
              {/* PDF Export v bočním panelu */}
              {items.length > 0 && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-green-900">
                      <Download className="h-6 w-6" />
                      Export do PDF
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 text-sm mb-4">
                      Stáhněte si kompletní kalkulaci jako profesionální PDF dokument s rozpisy všech položek a celkovým souhrnem včetně DPH.
                    </p>
                    <Button
                      onClick={handleExportPDF}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Stáhnout PDF kalkulaci
                    </Button>
                  </CardContent>
                </Card>
              )}
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
              ✅ Hodinová a metrová práce • ✅ Materiál podle kusů/metrů • ✅ Doprava a jídlo • ✅ PDF export • ✅ DPH kalkulace
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}