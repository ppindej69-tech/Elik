export interface CalculationItem {
  id: string;
  nazev: string;
  typ: 'prace' | 'material' | 'doprava' | 'jidlo' | 'ostatni';
  
  // Práce - hodinová sazba
  pocetHodin?: number;
  sazbaHodina?: number;
  
  // Práce - metrová sazba
  pocetMetru?: number;
  sazbaZaMetr?: number;
  
  // Typ výpočtu práce
  typVypoctuPrace?: 'hodiny' | 'metry';
  
  // Materiál - cena celková nebo podle množství
  cenaMaterial?: number;
  pocetKusu?: number;
  cenaZaKus?: number;
  pocetMetruMaterial?: number;
  cenaZaMetrMaterial?: number;
  
  // Typ výpočtu materiálu
  typVypoctuMaterial?: 'celkova' | 'kusy' | 'metry';
  
  // Ostatní
  metryCtverec?: number;
  pausalniCena?: number;
  poznamka?: string;
}

export interface CalculationSettings {
  nazevProjektu: string;
  zakaznik: string;
  datum: string;
  standardniSazba: number;
  standardniSazbaMetr: number;
  dopravniNaklady: number;
  nakladyJidlo: number;
}

export interface CalculationSummary {
  celkemPrace: number;
  celkemMaterial: number;
  celkemDoprava: number;
  celkemJidlo: number;
  celkemOstatni: number;
  celkemBezDph: number;
  dph: number;
  celkemSDph: number;
}