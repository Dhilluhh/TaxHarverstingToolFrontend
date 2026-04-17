import React from 'react';
import styles from './CapitalGainsCard.module.css';
import { formatCurrency, netGain, realisedGain } from '../../utils/formatters';
import type { CapitalGainsData } from '../../api/mockData';

interface Props {
  data: CapitalGainsData;
  variant: 'pre' | 'post';
  savings?: number;
}

interface GainRowProps {
  label: string;
  value: number;
  variant: 'pre' | 'post';
}

const GainRow: React.FC<GainRowProps> = ({ label, value, variant }) => {
  const isNegative = value < 0;
  return (
    <div className={styles.gainRow}>
      <span className={styles.gainLabel}>{label}</span>
      <span
        className={`${styles.gainValue} ${
          isNegative
            ? styles.negative
            : variant === 'post'
            ? styles.positivePost
            : styles.positivePost
        }`}
      >
        {isNegative ? '-' : ''}{formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
};

const CapitalGainsCard: React.FC<Props> = ({ data, variant, savings = 0 }) => {
  const { stcg, ltcg } = data.capitalGains;

  const stcgNet = netGain(stcg.profits, stcg.losses);
  const ltcgNet = netGain(ltcg.profits, ltcg.losses);
  const realised = realisedGain(stcg.profits, stcg.losses, ltcg.profits, ltcg.losses);

  const isPre = variant === 'pre';

  return (
    <div className={`${styles.card} ${isPre ? styles.preBg : styles.postBg}`}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          {isPre ? 'Pre-Harvesting' : 'After Harvesting'}
        </h2>
        {!isPre && savings > 0 && (
          <div className={styles.savingsBadge}>
            <span className={styles.savingsIcon}>🎉</span>
            <span>
              You're going to save{' '}
              <strong>{formatCurrency(savings)}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className={styles.sections}>
        {/* Short-Term */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Short-Term</h3>
          <div className={styles.rows}>
            <GainRow label="Profits" value={stcg.profits} variant={variant} />
            <GainRow label="Losses" value={-stcg.losses} variant={variant} />
            <div className={styles.divider} />
            <GainRow label="Net Capital Gains" value={stcgNet} variant={variant} />
          </div>
        </div>

        <div className={styles.separator} />

        {/* Long-Term */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Long-Term</h3>
          <div className={styles.rows}>
            <GainRow label="Profits" value={ltcg.profits} variant={variant} />
            <GainRow label="Losses" value={-ltcg.losses} variant={variant} />
            <div className={styles.divider} />
            <GainRow label="Net Capital Gains" value={ltcgNet} variant={variant} />
          </div>
        </div>
      </div>

      {/* Footer – Realised */}
      <div className={styles.footer}>
        <span className={styles.realisedLabel}>Realised Capital Gains</span>
        <span
          className={`${styles.realisedValue} ${
            realised < 0 ? styles.negative : styles.positivePost
          }`}
        >
          {realised < 0 ? '-' : ''}{formatCurrency(Math.abs(realised))}
        </span>
      </div>
    </div>
  );
};

export default CapitalGainsCard;
