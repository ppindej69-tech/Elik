# ELIK - Řešení problémů

## 🚨 Nejčastější problémy a řešení

### 1. Aplikace se nespustí

**Problém**: Chybová hláška při `npm run dev` nebo prázdná stránka

**Řešení**:
```bash
# 1. Zkontrolujte Node.js verzi (musí být 16+)
node --version

# 2. Smažte node_modules a package-lock.json
rm -rf node_modules package-lock.json

# 3. Přeinstalujte závislosti
npm install

# 4. Spusťte vývojový server
npm run dev
```

### 2. Chyby s TypeScript

**Problém**: TypeScript chyby při kompilaci

**Řešení**:
```bash
# Restartujte TypeScript server v VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# Nebo smažte TypeScript cache
rm -rf node_modules/.vite
npm run dev
```

### 3. Tailwind CSS se nenačítá

**Problém**: Styly se neaplikují, stránka vypadá nestyled

**Řešení**:
1. Zkontrolujte, že existuje soubor `src/index.css`
2. Ověřte import v `src/main.tsx`: `import './index.css'`
3. Restartujte dev server: `Ctrl+C` a pak `npm run dev`

### 4. PDF export nefunguje

**Problém**: Tlačítko "Stáhnout PDF" neodpovídá

**Řešení**:
1. Zkontrolujte, že jsou vyplněné všechny položky kalkulace
2. Povolte JavaScript ve vašem prohlížeči
3. Zkuste jiný prohlížeč (Chrome doporučen)
4. Zkontrolujte konzoli pro chyby: F12 -> Console tab

### 5. Port 5173 je obsazený

**Problém**: `Port 5173 is already in use`

**Řešení**:
```bash
# Najděte proces na portu 5173
lsof -ti:5173

# Ukončete proces
kill -9 $(lsof -ti:5173)

# Nebo změňte port v vite.config.ts
# server: { port: 3000 }
```

## ✅ Kontrolní seznam před spuštěním

- [ ] Node.js verze 16 nebo vyšší
- [ ] npm verze 8 nebo vyšší
- [ ] Všechny soubory jsou v správných složkách
- [ ] `npm install` byl spuštěn bez chyb
- [ ] Port 5173 je volný
- [ ] Žádné TypeScript chyby v konzoli

## 🔧 Pokročilé řešení problémů

### Kompletní reset
Pokud nic nefunguje:

```bash
# 1. Smažte vše
rm -rf node_modules package-lock.json .vite

# 2. Vyčistěte npm cache
npm cache clean --force

# 3. Přeinstalujte vše
npm install

# 4. Spusťte
npm run dev
```

### Kontrola závislostí
```bash
# Zkontrolujte nainstalované balíčky
npm list --depth=0

# Aktualizujte balíčky
npm update
```

## 📱 Testování v prohlížeči

1. **Chrome**: Doporučený prohlížeč, nejlepší podpora
2. **Firefox**: Funkční, občas problémy s PDF
3. **Safari**: Základní funkčnost
4. **Edge**: Funkční

## 🆘 Stále nefunguje?

1. Zkontrolujte konzoli prohlížeče (F12)
2. Podívejte se na terminal s `npm run dev`
3. Restartujte počítač
4. Zkuste jiný prohlížeč
5. Zkuste aplikaci na jiném počítači

## 📋 Systémové požadavky

- **OS**: Windows 10+, macOS 10.14+, Ubuntu 18.04+
- **Node.js**: 16.14.0+
- **npm**: 8.0.0+
- **RAM**: 4GB minimum, 8GB doporučeno
- **Prohlížeč**: Chrome 90+, Firefox 88+, Safari 14+

---

**ELIK v2.0** - Pro elektrikáře v České republice 🇨🇿⚡