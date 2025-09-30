import { Receipt, TrendingUp, Clock, Ruler, Package, Hash } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalculationItem, CalculationSettings, CalculationSummary } from '@/types/calculation'

interface CalculationSummaryProps {
  items: CalculationItem[]
  settings: CalculationSettings
}

export default function CalculationSummaryComponent({ items, settings }: CalculationSummaryProps) {
  const calculateSummary = (): CalculationSummary => {
    const summary = {
      celkemPrace: 0,
      celkemMaterial: 0,
      celkemDoprava: 0,
      celkemJidlo: 0,
      celkemOstatni: 0,
      celkemBezDph: 0,
      dph: 0,
      celkemSDph: 0
    }

    items.forEach(item => {
      let itemTotal = 0
      
      if (item.pausalniCena) {
        itemTotal = item.pausalniCena
      } else {
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
          default:
            itemTotal = 0
        }
      }

      switch (item.typ) {
        case 'prace':
          summary.celkemPrace += itemTotal
          break
        case 'material':
          summary.celkemMaterial += itemTotal
          break
        case 'doprava':
          summary.celkemDoprava += itemTotal
          break
        case 'jidlo':
          summary.celkemJidlo += itemTotal
          break
        default:
          summary.celkemOstatni += itemTotal
      }
    })

    summary.celkemBezDph = summary.celkemPrace + summary.celkemMaterial + 
                           summary.celkemDoprava + summary.celkemJidlo + summary.celkemOstatni
    summary.dph = summary.celkemBezDph * 0.21
    summary.celkemSDph = summary.celkemBezDph + summary.dph

    return summary
  }

  const summary = calculateSummary()
  const totalHours = items
    .filter(item => item.typ === 'prace' && item.typVypoctuPrace === 'hodiny')
    .reduce((total, item) => total + (item.pocetHodin || 0), 0)

  const totalMeters = items
    .filter(item => item.typ === 'prace' && item.typVypoctuPrace === 'metry')
    .reduce((total, item) => total + (item.pocetMetru || 0), 0)

  const totalPieces = items
    .filter(item => item.typ === 'material' && item.typVypoctuMaterial === 'kusy')
    .reduce((total, item) => total + (item.pocetKusu || 0), 0)

  const totalMaterialMeters = items
    .filter(item => item.typ === 'material' && item.typVypoctuMaterial === 'metry')
    .reduce((total, item) => total + (item.pocetMetruMaterial || 0), 0)

  const summaryItems = [
    { label: 'Práce', amount: summary.celkemPrace, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Materiál', amount: summary.celkemMaterial, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Doprava', amount: summary.celkemDoprava, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { label: 'Jídlo', amount: summary.celkemJidlo, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Ostatní', amount: summary.celkemOstatni, color: 'text-gray-600', bgColor: 'bg-gray-50' }
  ].filter(item => item.amount > 0)

  return (
    <div className="space-y-6">
      {/* Hlavní souhrn */}
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <Receipt className="h-6 w-6" />
            Celkový souhrn nabídky
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Statistiky projektu */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div className="text-sm font-medium text-gray-600">Práce hodin</div>
                </div>
                <div className="text-2xl font-bold text-indigo-900">{totalHours}h</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Ruler className="h-4 w-4 text-blue-600" />
                  <div className="text-sm font-medium text-gray-600">Práce metrů</div>
                </div>
                <div className="text-2xl font-bold text-indigo-900">{totalMeters}m</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4 text-green-600" />
                  <div className="text-sm font-medium text-gray-600">Kusy materiálu</div>
                </div>
                <div className="text-2xl font-bold text-indigo-900">{totalPieces} ks</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-green-600" />
                  <div className="text-sm font-medium text-gray-600">Metry materiálu</div>
                </div>
                <div className="text-2xl font-bold text-indigo-900">{totalMaterialMeters}m</div>
              </div>
            </div>

            {/* Dodatečné statistiky */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-sm font-medium text-gray-600 mb-1">Počet položek</div>
                <div className="text-2xl font-bold text-indigo-900">{items.length}</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-sm font-medium text-gray-600 mb-1">Průměrná hodinová sazba</div>
                <div className="text-2xl font-bold text-indigo-900">
                  {totalHours > 0 ? Math.round((summary.celkemPrace * (totalHours / (totalHours + totalMeters * (settings.standardniSazbaMetr / settings.standardniSazba)))) / totalHours).toLocaleString('cs-CZ') : 0} Kč/h
                </div>
              </div>
            </div>

            {/* Rozpis nákladů */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rozpis nákladů</h3>
              {summaryItems.map((item) => (
                <div key={item.label} className={`flex justify-between items-center py-3 px-4 rounded-lg ${item.bgColor} border border-gray-200`}>
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className={`text-lg font-bold ${item.color}`}>
                    {item.amount.toLocaleString('cs-CZ')} Kč
                  </span>
                </div>
              ))}
            </div>

            {/* Finální výpočet */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-lg font-medium text-gray-700">Celkem bez DPH</span>
                <span className="text-lg font-bold text-gray-900">
                  {summary.celkemBezDph.toLocaleString('cs-CZ')} Kč
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-lg font-medium text-gray-700">DPH 21%</span>
                <span className="text-lg font-bold text-gray-900">
                  {summary.dph.toLocaleString('cs-CZ')} Kč
                </span>
              </div>
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg p-4 flex justify-between items-center">
                <span className="text-xl font-bold">Celkem s DPH</span>
                <span className="text-3xl font-bold">
                  {summary.celkemSDph.toLocaleString('cs-CZ')} Kč
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informace o projektu */}
      {(settings.nazevProjektu || settings.zakaznik) && (
        <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <TrendingUp className="h-6 w-6" />
              Informace o projektu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings.nazevProjektu && (
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-sm font-medium text-gray-600 mb-1">Název projektu</div>
                  <div className="text-lg font-semibold text-gray-900">{settings.nazevProjektu}</div>
                </div>
              )}
              {settings.zakaznik && (
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-sm font-medium text-gray-600 mb-1">Zákazník</div>
                  <div className="text-lg font-semibold text-gray-900">{settings.zakaznik}</div>
                </div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-sm font-medium text-gray-600 mb-1">Datum vytvoření</div>
                <div className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString('cs-CZ', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-sm font-medium text-gray-600 mb-1">Standardní sazby</div>
                <div className="text-sm font-semibold text-gray-900">
                  {settings.standardniSazba} Kč/hod • {settings.standardniSazbaMetr} Kč/m
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}