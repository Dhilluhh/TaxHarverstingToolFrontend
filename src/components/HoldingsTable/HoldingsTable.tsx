import React, { useState } from 'react';
import styles from './HoldingsTable.module.css';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency, formatCurrencyFull, formatHolding, formatHoldingFull, formatPrice } from '../../utils/formatters';
import type { Holding } from '../../api/mockData';

const INITIAL_VISIBLE = 5;

// ── Fallback image on broken logos ───────────────────────────────────────────
const DEFAULT_LOGO = 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';

function CoinLogo({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = React.useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={styles.logo}
      onError={() => setImgSrc(DEFAULT_LOGO)}
    />
  );
}
// ── Value tooltip wrapper ──────────────────────────────────────────────────────
function ValueTooltip({
  compact,
  full,
  className,
}: {
  compact: string;
  full: string;
  className?: string;
}) {
  // Only show tooltip when the compact form differs from the full form
  const needsTooltip = compact !== full;
  return (
    <span className={styles.valWrap}>
      <span className={className}>{compact}</span>
      {needsTooltip && (
        <span className={styles.valTooltip}>{full}</span>
      )}
    </span>
  );
}


// ── Gain Cell with color ──────────────────────────────────────────────────────
function GainCell({ gain, balance, coin }: { gain: number; balance: number; coin: string }) {
  const isNeg = gain < 0;
  const isZero = gain === 0 && balance === 0;
  const compactGain = `${isNeg ? '-' : ''}${formatCurrency(Math.abs(gain))}`;
  const fullGain    = `${isNeg ? '-' : ''}${formatCurrencyFull(Math.abs(gain))}`;
  const compactBal  = isZero ? `0 ${coin}` : `${formatHolding(balance)} ${coin}`;
  const fullBal     = isZero ? `0 ${coin}` : `${formatHoldingFull(balance)} ${coin}`;
  return (
    <div className={styles.gainCell}>
      <ValueTooltip
        compact={compactGain}
        full={fullGain}
        className={`${styles.gainAmount} ${isNeg ? styles.neg : isZero ? styles.zero : styles.pos}`}
      />
      <ValueTooltip
        compact={compactBal}
        full={fullBal}
        className={styles.gainBalance}
      />
    </div>
  );
}

// ── Sort logic ────────────────────────────────────────────────────────────────
type SortKey = 'coin' | 'stcgGain' | 'ltcgGain' | 'currentPrice';
type SortDir = 'asc' | 'desc';

function sortHoldings(holdings: Holding[], key: SortKey, dir: SortDir): Holding[] {
  return [...holdings].sort((a, b) => {
    let aVal: number | string;
    let bVal: number | string;
    switch (key) {
      case 'coin': aVal = a.coin; bVal = b.coin; break;
      case 'stcgGain': aVal = a.stcg.gain; bVal = b.stcg.gain; break;
      case 'ltcgGain': aVal = a.ltcg.gain; bVal = b.ltcg.gain; break;
      case 'currentPrice': aVal = a.currentPrice; bVal = b.currentPrice; break;
      default: aVal = 0; bVal = 0;
    }
    if (typeof aVal === 'string') {
      return dir === 'asc'
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal);
    }
    return dir === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
  });
}

// ─────────────────────────────────────────────────────────────────────────────

const HoldingsTable: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { holdings, selectedIds, showAll, loadingHoldings, errorHoldings } = state;

  const [sortKey, setSortKey] = useState<SortKey>('stcgGain');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const sorted = React.useMemo(
    () => sortHoldings(holdings, sortKey, sortDir),
    [holdings, sortKey, sortDir]
  );

  // Map original index (for selectedIds) after sorting
  const indexedHoldings = React.useMemo(
    () =>
      sorted.map((h) => ({
        holding: h,
        originalIdx: holdings.indexOf(h),
      })),
    [sorted, holdings]
  );

  const visible = showAll ? indexedHoldings : indexedHoldings.slice(0, INITIAL_VISIBLE);

  const allSelected =
    holdings.length > 0 && holdings.every((_, i) => selectedIds.has(i));
  const someSelected = selectedIds.size > 0 && !allSelected;

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className={styles.sortNeutral}>↕</span>;
    return <span className={styles.sortActive}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  if (loadingHoldings) return null; // Loader handled above
  if (errorHoldings)
    return (
      <div className={styles.error}>
        <span>⚠️ {errorHoldings}</span>
      </div>
    );

  return (
    <section className={styles.section}>
      <div className={styles.tableHeader}>
        <h2 className={styles.tableTitle}>Your Holdings</h2>
        <span className={styles.holdingsCount}>{holdings.length} assets</span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {/* Checkbox */}
              <th className={styles.th}>
                <label className={styles.checkboxLabel} aria-label="Select all">
                  <input
                    id="select-all-checkbox"
                    type="checkbox"
                    className={styles.checkbox}
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                    onChange={() => {
                      if (allSelected) dispatch({ type: 'DESELECT_ALL' });
                      else dispatch({ type: 'SELECT_ALL' });
                    }}
                  />
                  <span className={styles.checkmark} />
                </label>
              </th>
              <th className={`${styles.th} ${styles.sortable}`} onClick={() => handleSort('coin')}>
                Asset <SortIcon col="coin" />
              </th>
              <th className={styles.th}>
                <div className={styles.thStack}>
                  <span>Holdings</span>
                  <span className={styles.thSub}>Avg Buy Price</span>
                </div>
              </th>
              <th className={`${styles.th} ${styles.sortable}`} onClick={() => handleSort('currentPrice')}>
                Current Price <SortIcon col="currentPrice" />
              </th>
              <th className={`${styles.th} ${styles.sortable}`} onClick={() => handleSort('stcgGain')}>
                <div className={styles.thStack}>
                  <span>Short-Term <SortIcon col="stcgGain" /></span>
                  <span className={styles.thSub}>Gain</span>
                </div>
              </th>
              <th className={`${styles.th} ${styles.sortable}`} onClick={() => handleSort('ltcgGain')}>
                <div className={styles.thStack}>
                  <span>Long-Term <SortIcon col="ltcgGain" /></span>
                  <span className={styles.thSub}>Gain</span>
                </div>
              </th>
              <th className={styles.th}>Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(({ holding: h, originalIdx }) => {
              const isSelected = selectedIds.has(originalIdx);
              return (
                <tr
                  key={`${h.coin}-${originalIdx}`}
                  className={`${styles.row} ${isSelected ? styles.rowSelected : ''}`}
                  onClick={() => dispatch({ type: 'TOGGLE_HOLDING', payload: originalIdx })}
                >
                  {/* Checkbox */}
                  <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                    <label className={styles.checkboxLabel}>
                      <input
                        id={`holding-checkbox-${originalIdx}`}
                        type="checkbox"
                        className={styles.checkbox}
                        checked={isSelected}
                        onChange={() =>
                          dispatch({ type: 'TOGGLE_HOLDING', payload: originalIdx })
                        }
                      />
                      <span className={styles.checkmark} />
                    </label>
                  </td>

                  {/* Asset */}
                  <td className={styles.td}>
                    <div className={styles.assetCell}>
                      <CoinLogo src={h.logo} alt={h.coin} />
                      <div className={styles.assetInfo}>
                        <span className={styles.coinSymbol}>{h.coin}</span>
                        <span className={styles.coinName}>{h.coinName}</span>
                      </div>
                    </div>
                  </td>

                  {/* Holdings */}
                  <td className={styles.td}>
                    <div className={styles.holdingCell}>
                      <ValueTooltip
                        compact={`${formatHolding(h.totalHolding)} ${h.coin}`}
                        full={`${formatHoldingFull(h.totalHolding)} ${h.coin}`}
                        className={styles.holdingAmount}
                      />
                      <ValueTooltip
                        compact={`${formatPrice(h.averageBuyPrice)}/${h.coin}`}
                        full={`${formatCurrencyFull(h.averageBuyPrice)}/${h.coin}`}
                        className={styles.holdingAvg}
                      />
                    </div>
                  </td>

                  {/* Current Price */}
                  <td className={styles.td}>
                    <ValueTooltip
                      compact={formatPrice(h.currentPrice)}
                      full={formatCurrencyFull(h.currentPrice)}
                      className={styles.price}
                    />
                  </td>

                  {/* Short-Term Gain */}
                  <td className={styles.td}>
                    <GainCell gain={h.stcg.gain} balance={h.stcg.balance} coin={h.coin} />
                  </td>

                  {/* Long-Term Gain */}
                  <td className={styles.td}>
                    <GainCell gain={h.ltcg.gain} balance={h.ltcg.balance} coin={h.coin} />
                  </td>

                  {/* Amount to Sell */}
                  <td className={styles.td}>
                    {isSelected ? (
                      <span className={styles.amountToSell}>
                        {formatHolding(h.totalHolding)}
                      </span>
                    ) : (
                      <span className={styles.amountEmpty}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View All / Show Less */}
      {holdings.length > INITIAL_VISIBLE && (
        <button
          id="view-all-button"
          className={styles.viewAllBtn}
          onClick={() => dispatch({ type: 'TOGGLE_SHOW_ALL' })}
        >
          {showAll
            ? `Show less ↑`
            : `View all ${holdings.length} assets ↓`}
        </button>
      )}
    </section>
  );
};

export default HoldingsTable;
