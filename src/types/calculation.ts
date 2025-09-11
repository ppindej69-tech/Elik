export interface CalculationItem {
  id: string;
  nazev: string;
  typ: 'prace' | 'material' | 'doprava' | 'jidlo' | 'ostatni';
  pocetHodin?: number;
  sazbaHodina?: number;
  metryCtverec?: number;
  cenaMaterial?: number;
  pausalniCena?: number;
  poznamka?: string;
}

export interface CalculationSettings {
  nazevProjektu: string;
  zakaznik: string;
  datum: string;
  standardniSazba: number;
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