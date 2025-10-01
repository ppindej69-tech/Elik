# ELIK - Elektroinstalační kalkulace

Profesionální kalkulační systém pro elektrikáře v České republice.

## 🚀 Rychlé spuštění

### 1. Instalace závislostí
```bash
npm install
```

### 2. Spuštění vývojového serveru
```bash
npm run dev
```

Aplikace se spustí na adrese: **http://localhost:5173**

### 3. Sestavení pro produkci
```bash
npm run build
```

### 4. Preview produkční verze
```bash
npm run preview
```

## 📋 Systémové požadavky

- **Node.js**: verze 16 nebo vyšší
- **npm**: verze 8 nebo vyšší
- Moderní webový prohlížeč (Chrome, Firefox, Safari, Edge)

## 🔧 Funkce aplikace

### ⚡ Kalkulace práce
- **Hodinová sazba**: Zadejte počet hodin × sazba za hodinu
- **Metrová sazba**: Zadejte počet metrů × sazba za metr
- **Individuální sazby**: Pro každou položku můžete nastavit vlastní sazbu

### 📦 Kalkulace materiálu
- **Celková cena**: Zadejte celkovou částku za materiál
- **Podle kusů**: Počet kusů × cena za kus
- **Podle metrů**: Počet metrů × cena za metr

### 🚗 Dodatečné náklady
- **Doprava**: Automatické přičítání dopravních nákladů
- **Jídlo**: Náklady na stravu během práce
- **Ostatní**: Jakékoli další náklady

### 📊 Automatické výpočty
- **DPH 21%**: Automatické připočítání daně
- **Souhrny**: Rozpis podle kategorií (práce, materiál, doprava, jídlo)
- **Statistiky**: Celkové hodiny, metry, kusy materiálu

### 📄 PDF Export
- **Profesionální kalkulace**: Kompletní rozpis všech položek
- **Přehledný souhrn**: Celková částka s DPH
- **Informace o projektu**: Název, zákazník, datum
- **Standardní sazby**: Přehled používaných sazeb

## 💡 Jak používat aplikaci

### 1. Nastavení projektu
- Zadejte **název projektu** a **jméno zákazníka**
- Nastavte **standardní sazby** pro hodiny a metry
- Upravte **dopravní náklady** a **náklady na jídlo**

### 2. Přidávání položek
- Vyberte **typ položky** (Práce, Materiál, Doprava, Jídlo, Ostatní)
- Zadejte **název položky**
- Podle typu vyberte způsob výpočtu:
  - **Práce**: za hodiny nebo za metry
  - **Materiál**: celková cena, podle kusů nebo podle metrů
- Vyplňte potřebné hodnoty (počet, sazby, ceny)

### 3. Kontrola a úpravy
- Ve **sloupu kalkulace** vidíte všechny přidané položky
- Každou položku můžete **upravit** nebo **odstranit**
- V **bočním panelu** sledujte průběžný souhrn

### 4. Export kalkulace
- Klikněte na tlačítko **"Stáhnout PDF"**
- Aplikace vytvoří profesionální kalkulaci ve formátu PDF
- Soubor se automaticky stáhne do složky Downloads

## 🎨 Rozložení aplikace

- **Hlavní panel (vlevo)**: Nastavení projektu a přidávání položek
- **Boční panel (vpravo)**: Souhrn kalkulace a export do PDF
- **Horní panel**: Přehled statistik a rychlé akce

## 💰 Příklad použití

1. **Nastavte projekt**: "Rekonstrukce bytu" pro zákazníka "Jan Novák"
2. **Přidejte práci**: "Výměna elektrické instalace" - 8 hodin × 800 Kč/hod
3. **Přidejte materiál**: "Elektrické kabely" - 50 metrů × 80 Kč/metr
4. **Přidejte dopravu**: Automaticky se přičte podle nastavení (500 Kč)
5. **Exportujte PDF**: Získáte kompletní kalkulaci s DPH

## ⚙️ Technické informace

### Použité technologie
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui komponenty
- **Ikony**: Lucide React
- **PDF**: jsPDF
- **Build tool**: Vite

### Struktura projektu
```
src/
├── components/          # React komponenty
│   ├── ui/             # Základní UI komponenty (Button, Card)
│   ├── calculation-form.tsx
│   └── calculation-summary.tsx
├── types/              # TypeScript typy
├── utils/              # Pomocné funkce
├── lib/                # Knihovny a konfigurace
└── app.tsx             # Hlavní komponenta
```

## 🔍 Řešení problémů

### Aplikace se nespustí
1. Zkontrolujte, zda máte nainstalovaný Node.js (verze 16+)
2. Smažte složku `node_modules` a soubor `package-lock.json`
3. Spusťte znovu `npm install`
4. Spusťte `npm run dev`

### PDF se nestahuje
1. Zkontrolujte, zda prohlížeč neblokuje stahování
2. Zkuste jiný prohlížeč (Chrome, Firefox)
3. Povolte JavaScript v prohlížeči

### Chybí data v kalkulaci
1. Zkontrolujte, zda jsou vyplněny všechny povinné údaje
2. Ověřte, že položky mají správně zadané hodnoty
3. Zkuste obnovit stránku (F5)

## 📞 Podpora

Aplikace je navržena pro jednoduché používání. Všechna data se ukládají pouze lokálně ve vašem prohlížeči.

**Tip**: Pro nejlepší výsledky používejte nejnovější verzi moderního prohlížeče.

---

**ELIK v2.0** - Vytvořeno pro česko-slovenské elektrikáře 🇨🇿⚡