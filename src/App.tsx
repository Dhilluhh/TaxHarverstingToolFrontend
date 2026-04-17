import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Navbar from './components/Navbar/Navbar';
import CapitalGainsCard from './components/CapitalGainsCard/CapitalGainsCard';
import HoldingsTable from './components/HoldingsTable/HoldingsTable';
import Loader from './components/Loader/Loader';
import styles from './App.module.css';

// ── SVG Chevron icon (rotates via CSS, no text character) ────────────────────
const ChevronIcon: React.FC = () => (
  <svg
    width="16" height="16" viewBox="0 0 16 16"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M3 6l5 5 5-5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Collapsible Important Notes Banner ───────────────────────────────────────
const ImportantNotesBanner: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.notesBanner}>
      <button
        id="important-notes-toggle"
        className={styles.notesHeader}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className={styles.notesHeaderLeft}>
          <span className={styles.notesIcon}>ℹ</span>
          <span className={styles.notesTitle}>Important Notes And Disclaimers</span>
        </span>
        <span className={`${styles.notesChevron} ${open ? styles.notesChevronOpen : ''}`}>
          <ChevronIcon />
        </span>
      </button>
      {open && (
        <div className={styles.notesBody}>
          <ul className={styles.notesList}>
            <li>
              <strong>Price Source Disclaimer</strong>: Please note that the current price of
              your coins may differ from the prices listed on specific exchanges. This is because
              we use <strong>CoinGecko</strong> as our default price source for certain exchanges,
              rather than fetching prices directly from the exchange.
            </li>
            <li>
              <strong>Country-specific Availability</strong>: Tax loss harvesting may{' '}
              <strong>not be supported in all countries</strong>. We strongly recommend consulting
              with your local tax advisor or accountant before performing any related actions on
              your exchange.
            </li>
            <li>
              <strong>Utilization of Losses</strong>: Tax loss harvesting typically allows you to
              offset capital gains. However, if you have{' '}
              <strong>zero or no applicable crypto capital gains</strong>, the usability of these
              harvested losses may be limited. Kindly confirm with your tax advisor how such
              losses can be applied in your situation.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

// ── Inner page that reads from context ───────────────────────────────────────
const TaxLossHarvestingPage: React.FC = () => {
  const { state, afterHarvestGains, savings } = useAppContext();
  const {
    capitalGains,
    loadingGains,
    loadingHoldings,
    errorGains,
    selectedIds,
  } = state;

  const isLoading = loadingGains || loadingHoldings;

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>

          {/* ── Page Header ──────────────────────────────────────────────── */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Tax Optimisation</h1>
            <div className={styles.howItWorksWrap}>
              <a href="#" className={styles.howItWorksLink} id="how-it-works-link">
                How it works?
              </a>
              <div className={styles.tooltip} role="tooltip">
                <ul className={styles.tooltipList}>
                  <li>See your capital gains for FY 2024-25 in the left card</li>
                  <li>Check boxes for assets you plan on selling to reduce your tax liability</li>
                  <li>Instantly see your updated tax liability in the right card</li>
                </ul>
                <p className={styles.tooltipProTip}>
                  <strong>Pro tip:</strong> Experiment with different combinations of your holdings to optimize your tax liability
                </p>
              </div>
            </div>
          </div>

          {/* ── Important Notes Collapsible Banner ───────────────────────── */}
          <ImportantNotesBanner />

          {/* ── Capital Gains Cards ──────────────────────────────────────── */}
          {isLoading ? (
            <Loader />
          ) : errorGains ? (
            <div className={styles.errorBox}>⚠️ {errorGains}</div>
          ) : capitalGains ? (
            <div className={styles.cardsRow}>
              <CapitalGainsCard data={capitalGains} variant="pre" />
              <CapitalGainsCard
                data={afterHarvestGains ?? capitalGains}
                variant="post"
                savings={savings}
              />
            </div>
          ) : null}

          {/* ── Holdings Table ───────────────────────────────────────────── */}
          {isLoading ? null : (
            <>
              {selectedIds.size > 0 && (
                <div className={styles.selectionBanner}>
                  <span className={styles.selectionDot} />
                  <span>
                    <strong>{selectedIds.size}</strong> asset{selectedIds.size > 1 ? 's' : ''} selected for harvesting
                  </span>
                </div>
              )}
              <HoldingsTable />
            </>
          )}

        </div>
      </main>
      <footer className={styles.disclaimer}>
        <p>
          <strong>Assessment Disclaimer:</strong> The KoinX name, logo, and all associated
          icons used in this application are the intellectual property of KoinX and are used
          solely for the purpose of this internship assessment. They are not intended for
          commercial use, redistribution, or any purpose beyond this evaluation.
        </p>
      </footer>
    </>
  );
};

// ── Root App (wraps with Provider) ───────────────────────────────────────────
const App: React.FC = () => (
  <AppProvider>
    <TaxLossHarvestingPage />
  </AppProvider>
);

export default App;
