# Tax Loss Harvesting Tool

A responsive Tax Loss Harvesting interface built with React + TypeScript + Vite, matching the KoinX design system.


---

##Screenshots

#Dark mode

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/13d0a9a4-0d72-47b1-9b38-4981ee4469c5" />


## ✨ Features

- **Pre-Harvesting Card** — Displays capital gains (STCG & LTCG) from the Capital Gains API: profits, losses, net gains, and realised capital gains.
- **After Harvesting Card** — Mirrors the pre-harvesting data; updates in real-time as you select/deselect holdings.
- **Savings Banner** — Shows "🎉 You're going to save ₹X" only when post-harvest realised gains are lower than pre-harvest.
- **Holdings Table** — Full table of 25 assets with:
  - Asset logo, coin symbol, full coin name
  - Total holdings & average buy price
  - Current price
  - Short-term & long-term gain with balance
  - Amount to Sell (populated on selection)
  - Sortable columns (click headers)
  - Per-row checkbox + Select All / Deselect All
  - "View All / Show Less" toggle (5 rows initially)
- **Mock APIs** — Both APIs simulated as Promise-based async calls with artificial delay (mimics real network).
- **State Management** — `useContext` + `useReducer` (no external state library needed).
- **Loader / Error States** — Spinner while data loads, error messages if fetch fails.
- **Dark Theme** — Rich dark UI with glassmorphism navbar, animated gradient background, and blue/dark card variants.
- **Mobile Responsive** — Cards stack vertically, table scrolls horizontally on small screens.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd koinx-tax-loss-harvesting

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

---

## 📁 Folder Structure

```
src/
├── api/
│   └── mockData.ts          # Mock API responses (Holdings + Capital Gains)
│                             # with TypeScript interfaces
├── components/
│   ├── CapitalGainsCard/
│   │   ├── CapitalGainsCard.tsx     # Pre/Post harvesting card
│   │   └── CapitalGainsCard.module.css
│   ├── HoldingsTable/
│   │   ├── HoldingsTable.tsx        # Table with sort, select, view-all
│   │   └── HoldingsTable.module.css
│   ├── Loader/
│   │   ├── Loader.tsx               # Loading spinner
│   │   └── Loader.module.css
│   └── Navbar/
│       ├── Navbar.tsx               # Sticky glassmorphism navbar
│       └── Navbar.module.css
├── context/
│   └── AppContext.tsx        # useContext + useReducer state management
├── utils/
│   └── formatters.ts         # Currency, number, and gain formatters
├── App.tsx                   # Page layout and context wiring
├── App.module.css
├── index.css                 # Global CSS with design tokens
└── main.tsx                  # React root
```

---

## 🧠 Business Logic

### Pre-Harvesting Calculation
Directly from Capital Gains API:
```
Net STCG = stcg.profits - stcg.losses
Net LTCG = ltcg.profits - ltcg.losses
Realised Capital Gains = Net STCG + Net LTCG
```

### After-Harvesting Calculation
For each **selected** holding:
- If `stcg.gain > 0` → add to STCG profits
- If `stcg.gain < 0` → add absolute value to STCG losses
- Same logic for `ltcg.gain`

Recalculate net and realised gains from the updated values.

### Savings
```
savings = preRealisedGain - postRealisedGain   (shown only if > 0)
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| CSS Modules | Scoped component styles |
| useContext + useReducer | Global state management |
| Promise-based mocks | API simulation |

---

## 🎨 Design Decisions / Assumptions

1. **Mock API format** — APIs are implemented as async Promise functions in `src/api/mockData.ts` with 600–800ms simulated delay.
2. **Row identity** — Holdings are identified by their array index (not just `coin` symbol) since the API contains duplicate coin names (e.g., two USDC entries).
3. **Sort default** — Holdings are initially sorted by Short-Term Gain (descending) to surface the most impactful harvesting candidates first.
4. **Amount to Sell** — Populated with `totalHolding` when a row is selected (per spec).
5. **Negative losses display** — In the gains card, `losses` from the API are always positive numbers representing a negative direction; they're displayed as `-₹X` for clarity.
6. **Zero-gain assets** — Assets with both STCG and LTCG gain of 0 are shown in the table but their contribution to the "After Harvesting" card is neutral.
7. **Very small values** — Dust token amounts (e.g., TITAN, SPHERE) are displayed in exponential notation for readability.

---

## 🚢 Deployment

The app was deployed on Vercel
