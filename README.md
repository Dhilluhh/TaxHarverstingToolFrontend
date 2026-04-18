# Tax Loss Harvesting Tool

A responsive Tax Loss Harvesting interface built with React + TypeScript + Vite, matching the KoinX design system.


---

## 📸 Screenshots

### 🌙 Dark Mode

<details>
<summary><b>1. Dashboard Overview (Pre-Harvesting)</b></summary>

Shows the initial load state with Pre-Harvesting and empty After-Harvesting calculations.
<img width="1920" height="1020" alt="Dashboard Overview" src="https://github.com/user-attachments/assets/c033a076-1a54-4c9c-9c9b-25ed3b90da13" />
</details>

<details>
<summary><b>2. How it works Tooltip</b></summary>

Demonstrated the working of the How it works tooltip.
<img width="1920" height="1020" alt="Holdings Table" src="https://github.com/user-attachments/assets/973db1f9-3daf-4e96-a88f-c4b990287f03" />
</details>

<details>
<summary><b>3. Important Notes and Disclaimers Dropdown</b></summary>

Shows the working of the Important Notes and Disclaimers Dropdown.
<img width="1920" height="1020" alt="Post-Harvesting" src="https://github.com/user-attachments/assets/c1331c50-bf4f-4fc8-aaa6-1e1d5cec1ad2" />
</details>

<details>
<summary><b>4. Tooltip for prices</b></summary>

Showed the working of the tooltip for prices.
<img width="1920" height="1020" alt="Tax Savings" src="https://github.com/user-attachments/assets/660d116c-ff23-4fca-9bf3-092982b2c5ee" />
</details>

<details>
<summary><b>5. Holdings table basic view </b></summary>

Shows the basic holdings table initally with 5 assets which expands on clicking the show all as demonstrated below.
<img width="1920" height="1020" alt="Expanded View" src="https://github.com/user-attachments/assets/2faf5944-8e33-4a61-8bfc-512db892026a" />
</details>

<details>
<summary><b>6.Expanded Table View(Show All)</b></summary>

Full list of assets with scrolling and comprehensive data view.
<img width="1920" height="1020" alt="Multi-Selection" src="https://github.com/user-attachments/assets/c7bf4139-f7bc-40aa-87bb-de2697678f45" />
</details>

<details>
<summary><b>7. Selection of assets to sell and the gain calculation</b></summary>

Demonstrates the ability to sort by columns and select all assets, Application also handles the gain or saving.
<img width="1920" height="1020" alt="Edge Cases" src="https://github.com/user-attachments/assets/09cd0cb9-84a3-4f64-9403-5c646b845318" />
</details>

<br/>

### ☀️ Light Mode

<details>
<summary><b>1. Dashboard Overview (Pre-Harvesting)</b></summary>

Initial load state with bright, easily readable text and clean layout.
<img width="1920" height="1020" alt="Overview Light Mode" src="https://github.com/user-attachments/assets/8e335ca1-fc31-4828-a970-e217cd9bff09" />
</details>

<details>
<summary><b>2. How it works Tooltip</b></summary>

Demonstrated the working of the How it works tooltip.
<img width="1920" height="1020" alt="Table Light Mode" src="https://github.com/user-attachments/assets/9864fe4a-fefd-44a8-ba46-3d35a6e3f53e" />
</details>

<details>
<summary><b>3. Important Notes and Disclaimers Dropdown</b></summary>

Shows the working of the Important Notes and Disclaimers Dropdown.
<img width="1920" height="1020" alt="Post-Harvesting Light Mode" src="https://github.com/user-attachments/assets/affb3f15-4776-4725-8717-c2bc0f8b7d2b" />
</details>

<details>
<summary><b>4. Holdings table basic view Active</b></summary>

Shows the basic holdings table initally with 5 assets which expands on clicking the show all as demonstrated below.
<img width="1920" height="1020" alt="Tax Savings Light Mode" src="https://github.com/user-attachments/assets/fa2f2a25-72f6-4736-b1bd-6fbb050cc3f6" />
</details>

<details>
<summary><b>5. Expanded Table View (Show All)</b></summary>

Testing the display limit with multiple assets expanded.
<img width="1920" height="1020" alt="Expanded List Light Mode" src="https://github.com/user-attachments/assets/24b665ed-59ef-435a-8f7b-4018469ef7fb" />
</details>

<details>
<summary><b>7. Selection of assets to sell and the gain calculation and Tooltip for prices</b></summary>

Demonstrates the ability to sort by columns and select all assets,display the prices on a tooltip, Application also handles the gain or saving.
<img width="1920" height="1020" alt="State Handling Light Mode" src="https://github.com/user-attachments/assets/6f21b3b0-f11f-4793-a1c5-1b7a1a456b88" />
</details>

--- 


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
