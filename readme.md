# ELIK - Elektroinstalační kalkulace

🔧 **Profesionální kalkulační systém pro elektrikáře v České republice**

## 🚀 Rychlé spuštění

1. **Instalace závislostí:**
   ```bash
   npm install
   ```

2. **Spuštění aplikace:**
   ```bash
   npm run dev
   ```

3. **Otevření v prohlížeči:**
   - Aplikace běží na: `http://localhost:5173`

## ✨ Hlavní funkce

### ⚡ Kalkulace práce
- **Hodinová sazba**: Počet hodin × sazba za hodinu
- **Metrová sazba**: Počet metrů × sazba za metr
- **Individuální sazby**: Vlastní sazba pro každou položku

### 📦 Kalkulace materiálu
- **Celková cena**: Paušální částka
- **Podle kusů**: Počet × cena za kus
- **Podle metrů**: Počet metrů × cena za metr

### 🚗 Dodatečné náklady
- **Doprava**: Fixní dopravní náklady
- **Jídlo**: Náklady na stravu
- **Ostatní**: Další náklady

### 📊 Automatické výpočty
- **DPH 21%**: Automatické připočítání
- **Souhrny**: Rozpis podle kategorií
- **Statistiky**: Celkové hodiny/metry/kusy

### 📄 PDF Export
- **Profesionální kalkulace**: Kompletní PDF dokument
- **Přehledný layout**: Všechny informace přehledně
- **Automatické pojmenování**: Podle názvu projektu

## 🔧 Technické informace

### Technologie
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** komponenty
- **Lucide React** ikony
- **jsPDF** pro export PDF

### Požadavky
- **Node.js**: 16.14.0+ (doporučeno 18 LTS)
- **npm**: 8.0.0+
- **Moderní prohlížeč**: Chrome 90+, Firefox 88+, Safari 14+

### Skripty
```bash
npm run dev      # Vývojový server
npm run build    # Sestavení pro produkci
npm run preview  # Náhled produkční verze
npm run lint     # Kontrola kódu
```

## 💡 Jak používat

### 1. Nastavení projektu
- Vyplňte **název projektu** a **zákazníka**
- Nastavte **standardní sazby** (Kč/hod, Kč/m)
- Upravte **dopravní náklady** a **náklady na jídlo**

### 2. Přidávání položek
- Zvolte **typ** (Práce/Materiál/Doprava/Jídlo/Ostatní)
- Zadejte **název položky**
- Vyplňte **hodnoty** podle typu výpočtu
- Klikněte **"Přidat položku"**

### 3. Kontrola a úpravy
- Ve **středním sloupci** vidíte všechny položky
- Každou položku lze **upravovat** nebo **mazat**
- V **pravém panelu** sledujte celkový souhrn

### 4. Export do PDF
- Klikněte **"Stáhnout PDF"** (vpravo nahoře nebo v bočním panelu)
- PDF se automaticky stáhne s názvem projektu

## 💰 Příklad použití

1. **Nastavte projekt**: "Rekonstrukce bytu" pro "Jan Novák"
2. **Přidejte práci**: "Výměna instalace" - 8h × 800 Kč/h = 6,400 Kč
3. **Přidejte materiál**: "Kabely" - 50m × 80 Kč/m = 4,000 Kč
4. **Přidejte dopravu**: Automaticky 500 Kč
5. **Celkem**: 10,900 Kč + DPH = 13,189 Kč
6. **Exportujte PDF**: Profesionální kalkulace ke stažení

## 🎯 Pro koho je ELIK

- **🔌 Elektrikáři** - hlavní cílová skupina
- **🏗️ Elektroinstalační firmy** - pro snadné kalkulace
- **🏠 OSVČ** - profesionální nabídky pro klienty
- **📊 Projektanti** - rychlé odhady nákladů

## 📁 Struktura projektu

```
src/
├── components/
│   ├── ui/              # shadcn/ui komponenty
│   ├── calculation-form.tsx
│   └── calculation-summary.tsx
├── types/               # TypeScript typy
├── utils/               # Pomocné funkce
├── lib/                 # Knihovny a konfigurace
└── app.tsx             # Hlavní komponenta
```

## 🚨 Řešení problémů

### Aplikace se nespustí
1. Zkontrolujte Node.js verzi: `node --version`
2. Smažte cache: `rm -rf node_modules package-lock.json`
3. Reinstalujte: `npm install`
4. Spusťte: `npm run dev`

### PDF export nefunguje
1. Zkontrolujte, že máte přidané položky
2. Zkuste jiný prohlížeč (doporučen Chrome)
3. Zkontrolujte konzoli (F12) pro chyby

### Port 5173 obsazený
```bash
# Najděte proces
lsof -ti:5173
# Ukončete proces
kill -9 $(lsof -ti:5173)
```

---

**ELIK v2.0** - Vytvořeno s ❤️ pro české elektrikáře 🇨🇿⚡

*Pro více informací navštivte dokumentaci nebo kontaktujte podporu.*