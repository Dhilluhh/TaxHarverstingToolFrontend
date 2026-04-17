import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from 'react';
import { fetchHoldings, fetchCapitalGains } from '../api/mockData';
import type { Holding, CapitalGainsData } from '../api/mockData';

// ─── State Shape ──────────────────────────────────────────────────────────────
interface AppState {
  holdings: Holding[];
  capitalGains: CapitalGainsData | null;
  selectedIds: Set<number>; // index-based since holdings can have duplicate coin names
  loadingHoldings: boolean;
  loadingGains: boolean;
  errorHoldings: string | null;
  errorGains: string | null;
  showAll: boolean;
}

// ─── Action Types ─────────────────────────────────────────────────────────────
type Action =
  | { type: 'SET_HOLDINGS'; payload: Holding[] }
  | { type: 'SET_CAPITAL_GAINS'; payload: CapitalGainsData }
  | { type: 'SET_LOADING_HOLDINGS'; payload: boolean }
  | { type: 'SET_LOADING_GAINS'; payload: boolean }
  | { type: 'SET_ERROR_HOLDINGS'; payload: string }
  | { type: 'SET_ERROR_GAINS'; payload: string }
  | { type: 'TOGGLE_HOLDING'; payload: number }
  | { type: 'SELECT_ALL' }
  | { type: 'DESELECT_ALL' }
  | { type: 'TOGGLE_SHOW_ALL' };

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_HOLDINGS':
      return { ...state, holdings: action.payload, loadingHoldings: false };
    case 'SET_CAPITAL_GAINS':
      return { ...state, capitalGains: action.payload, loadingGains: false };
    case 'SET_LOADING_HOLDINGS':
      return { ...state, loadingHoldings: action.payload };
    case 'SET_LOADING_GAINS':
      return { ...state, loadingGains: action.payload };
    case 'SET_ERROR_HOLDINGS':
      return { ...state, errorHoldings: action.payload, loadingHoldings: false };
    case 'SET_ERROR_GAINS':
      return { ...state, errorGains: action.payload, loadingGains: false };
    case 'TOGGLE_HOLDING': {
      const next = new Set(state.selectedIds);
      if (next.has(action.payload)) {
        next.delete(action.payload);
      } else {
        next.add(action.payload);
      }
      return { ...state, selectedIds: next };
    }
    case 'SELECT_ALL': {
      const all = new Set(state.holdings.map((_, i) => i));
      return { ...state, selectedIds: all };
    }
    case 'DESELECT_ALL':
      return { ...state, selectedIds: new Set() };
    case 'TOGGLE_SHOW_ALL':
      return { ...state, showAll: !state.showAll };
    default:
      return state;
  }
}

const initialState: AppState = {
  holdings: [],
  capitalGains: null,
  selectedIds: new Set(),
  loadingHoldings: true,
  loadingGains: true,
  errorHoldings: null,
  errorGains: null,
  showAll: false,
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  afterHarvestGains: CapitalGainsData | null;
  savings: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch data on mount
  useEffect(() => {
    dispatch({ type: 'SET_LOADING_HOLDINGS', payload: true });
    fetchHoldings()
      .then((data) => dispatch({ type: 'SET_HOLDINGS', payload: data }))
      .catch(() =>
        dispatch({ type: 'SET_ERROR_HOLDINGS', payload: 'Failed to load holdings.' })
      );

    dispatch({ type: 'SET_LOADING_GAINS', payload: true });
    fetchCapitalGains()
      .then((data) => dispatch({ type: 'SET_CAPITAL_GAINS', payload: data }))
      .catch(() =>
        dispatch({ type: 'SET_ERROR_GAINS', payload: 'Failed to load capital gains.' })
      );
  }, []);

  // ── Derived "After Harvesting" gains ──────────────────────────────────────
  const afterHarvestGains: CapitalGainsData | null = React.useMemo(() => {
    if (!state.capitalGains) return null;

    let stcgProfits = state.capitalGains.capitalGains.stcg.profits;
    let stcgLosses = state.capitalGains.capitalGains.stcg.losses;
    let ltcgProfits = state.capitalGains.capitalGains.ltcg.profits;
    let ltcgLosses = state.capitalGains.capitalGains.ltcg.losses;

    state.selectedIds.forEach((idx) => {
      const holding = state.holdings[idx];
      if (!holding) return;

      const stcgGain = holding.stcg.gain;
      const ltcgGain = holding.ltcg.gain;

      // STCG: positive gain → add to profits, negative → add to losses (as absolute)
      if (stcgGain > 0) {
        stcgProfits += stcgGain;
      } else if (stcgGain < 0) {
        stcgLosses += Math.abs(stcgGain);
      }

      // LTCG
      if (ltcgGain > 0) {
        ltcgProfits += ltcgGain;
      } else if (ltcgGain < 0) {
        ltcgLosses += Math.abs(ltcgGain);
      }
    });

    return {
      capitalGains: {
        stcg: { profits: stcgProfits, losses: stcgLosses },
        ltcg: { profits: ltcgProfits, losses: ltcgLosses },
      },
    };
  }, [state.capitalGains, state.selectedIds, state.holdings]);

  // ── Savings calculation ───────────────────────────────────────────────────
  const savings = React.useMemo(() => {
    if (!state.capitalGains || !afterHarvestGains) return 0;

    const preNet =
      (state.capitalGains.capitalGains.stcg.profits -
        state.capitalGains.capitalGains.stcg.losses) +
      (state.capitalGains.capitalGains.ltcg.profits -
        state.capitalGains.capitalGains.ltcg.losses);

    const postNet =
      (afterHarvestGains.capitalGains.stcg.profits -
        afterHarvestGains.capitalGains.stcg.losses) +
      (afterHarvestGains.capitalGains.ltcg.profits -
        afterHarvestGains.capitalGains.ltcg.losses);

    return preNet > postNet ? preNet - postNet : 0;
  }, [state.capitalGains, afterHarvestGains]);

  return (
    <AppContext.Provider value={{ state, dispatch, afterHarvestGains, savings }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
