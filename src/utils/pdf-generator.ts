import jsPDF from 'jspdf'
import { CalculationItem, CalculationSettings } from '@/types/calculation'

export interface PDFExportData {
  items: CalculationItem[]
  settings: CalculationSettings
}

function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('cs-CZ')} Kč`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('cs-CZ', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  })
}

export function generatePDF(data: PDFExportData): void {
  const { items, settings } = data
  const doc = new jsPDF('p', 'mm', 'a4')
  
  let yPos = 20
  
  // Hlavička
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('ELIK - Kalkulace elektroinstalace', 20, yPos)
  yPos += 15
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Datum vytvoření: ${formatDate(new Date().toISOString())}`, 20, yPos)
  yPos += 10
  
  // Informace o projektu
  if (settings.nazevProjektu || settings.zakaznik) {
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Informace o projektu', 20, yPos)
    yPos += 8
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    
    if (settings.nazevProjektu) {
      doc.text(`Název projektu: ${settings.nazevProjektu}`, 20, yPos)
      yPos += 6
    }
    
    if (settings.zakaznik) {
      doc.text(`Zákazník: ${settings.zakaznik}`, 20, yPos)
      yPos += 6
    }
    
    yPos += 5
  }
  
  // Standardní sazby
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Standardní sazby', 20, yPos)
  yPos += 8
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Hodinová sazba: ${formatCurrency(settings.standardniSazba)}/hod`, 20, yPos)
  yPos += 5
  doc.text(`Metrová sazba: ${formatCurrency(settings.standardniSazbaMetr)}/m`, 20, yPos)
  yPos += 5
  doc.text(`Dopravní náklady: ${formatCurrency(settings.dopravniNaklady)}`, 20, yPos)
  yPos += 5
  doc.text(`Náklady na jídlo: ${formatCurrency(settings.nakladyJidlo)}`, 20, yPos)
  yPos += 15
  
  // Kontrola prostoru na stránce
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }
  
  // Seznam položek - jednoduché zobrazení bez autotable
  if (items.length > 0) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Rozpis položek', 20, yPos)
    yPos += 10
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    items.forEach((item, index) => {
      // Kontrola prostoru
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      
      const getItemTotal = (): number => {
        if (item.pausalniCena) return item.pausalniCena
        
        switch (item.typ) {
          case 'prace':
            if (item.typVypoctuPrace === 'hodiny') {
              return (item.pocetHodin || 0) * (item.sazbaHodina || settings.standardniSazba)
            } else if (item.typVypoctuPrace === 'metry') {
              return (item.pocetMetru || 0) * (item.sazbaZaMetr || settings.standardniSazbaMetr)
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
      
      const getItemDetails = (): string => {
        if (item.pausalniCena) return 'Paušální cena'
        
        switch (item.typ) {
          case 'prace':
            if (item.typVypoctuPrace === 'hodiny') {
              return `${item.pocetHodin || 0}h × ${formatCurrency(item.sazbaHodina || settings.standardniSazba)}/hod`
            } else if (item.typVypoctuPrace === 'metry') {
              return `${item.pocetMetru || 0}m × ${formatCurrency(item.sazbaZaMetr || settings.standardniSazbaMetr)}/m`
            }
            return ''
          case 'material':
            if (item.typVypoctuMaterial === 'celkova') {
              return 'Celková cena'
            } else if (item.typVypoctuMaterial === 'kusy') {
              return `${item.pocetKusu || 0} ks × ${formatCurrency(item.cenaZaKus || 0)}/ks`
            } else if (item.typVypoctuMaterial === 'metry') {
              return `${item.pocetMetruMaterial || 0}m × ${formatCurrency(item.cenaZaMetrMaterial || 0)}/m`
            }
            return ''
          case 'doprava':
            return 'Dopravní náklady'
          case 'jidlo':
            return 'Náklady na jídlo'
          default:
            return ''
        }
      }
      
      const typeLabels: { [key: string]: string } = {
        prace: 'Práce',
        material: 'Materiál',
        doprava: 'Doprava',
        jidlo: 'Jídlo',
        ostatni: 'Ostatní'
      }
      
      // Hlavička položky
      doc.setFont('helvetica', 'bold')
      doc.text(`${index + 1}. ${typeLabels[item.typ]}: ${item.nazev}`, 20, yPos)
      yPos += 5
      
      // Detaily
      doc.setFont('helvetica', 'normal')
      const details = getItemDetails()
      if (details) {
        doc.text(`   ${details}`, 20, yPos)
        yPos += 4
      }
      
      // Cena
      doc.setFont('helvetica', 'bold')
      doc.text(`   Celkem: ${formatCurrency(getItemTotal())}`, 20, yPos)
      yPos += 8
    })
  }
  
  // Kontrola prostoru pro souhrn
  if (yPos > 230) {
    doc.addPage()
    yPos = 20
  }
  
  // Výpočet součtů
  const calculateSummary = () => {
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
    
    summary.celkemBezDph = summary.celkemPrace + summary.celkemMaterial + summary.celkemDoprava + summary.celkemJidlo + summary.celkemOstatni
    summary.dph = Math.round(summary.celkemBezDph * 0.21)
    summary.celkemSDph = summary.celkemBezDph + summary.dph
    
    return summary
  }
  
  const summary = calculateSummary()
  
  // Souhrn
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Celkový souhrn', 20, yPos)
  yPos += 12
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  
  // Rozpis podle kategorií (jen pokud má hodnotu > 0)
  const summaryItems = [
    { label: 'Práce:', amount: summary.celkemPrace },
    { label: 'Materiál:', amount: summary.celkemMaterial },
    { label: 'Doprava:', amount: summary.celkemDoprava },
    { label: 'Jídlo:', amount: summary.celkemJidlo },
    { label: 'Ostatní:', amount: summary.celkemOstatni }
  ].filter(item => item.amount > 0)
  
  summaryItems.forEach(item => {
    doc.text(item.label, 20, yPos)
    doc.text(formatCurrency(item.amount), 150, yPos, { align: 'right' })
    yPos += 6
  })
  
  yPos += 5
  
  // Celková částka
  doc.setFont('helvetica', 'bold')
  doc.text('Celkem bez DPH:', 20, yPos)
  doc.text(formatCurrency(summary.celkemBezDph), 150, yPos, { align: 'right' })
  yPos += 8
  
  doc.text('DPH 21%:', 20, yPos)
  doc.text(formatCurrency(summary.dph), 150, yPos, { align: 'right' })
  yPos += 8
  
  doc.setFontSize(14)
  doc.text('CELKEM S DPH:', 20, yPos)
  doc.text(formatCurrency(summary.celkemSDph), 150, yPos, { align: 'right' })
  
  // Uložení PDF
  const fileName = settings.nazevProjektu 
    ? `ELIK_${settings.nazevProjektu.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    : `ELIK_kalkulace_${new Date().toISOString().split('T')[0]}.pdf`
    
  doc.save(fileName)
}