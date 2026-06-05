import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { fetchWhaleWatchAlerts, fetchWhaleWatchStatus } from '../api/client';

const WhaleWatchContext = createContext(null);

const POLL_INTERVAL_MS = 90000;

function getToken() {
  return localStorage.getItem('access_token');
}

export function WhaleWatchProvider({ children }) {
  const [active, setActive] = useState(false);
  const [plan, setPlan] = useState(null);
  const [radar, setRadar] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const pollRef = useRef(null);

  const loadAlerts = useCallback(async () => {
    if (!getToken()) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchWhaleWatchAlerts();
      setAlerts(data.alerts || []);
      if (data.radar) setRadar(data.radar);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setActive(false);
      setPlan(null);
      setRadar(null);
      setAlerts([]);
      setReady(true);
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }

    try {
      const status = await fetchWhaleWatchStatus();
      setActive(status.active);
      setPlan(status.plan);
      setRadar(status.radar || null);

      if (status.active) {
        await loadAlerts();
        if (!pollRef.current) {
          pollRef.current = setInterval(loadAlerts, POLL_INTERVAL_MS);
        }
      } else {
        setAlerts([]);
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      }
    } catch {
      setActive(false);
    } finally {
      setReady(true);
    }
  }, [loadAlerts]);

  useEffect(() => {
    refresh();
    const onAuth = () => {
      setReady(false);
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      refresh();
    };
    window.addEventListener('auth-changed', onAuth);
    window.addEventListener('storage', onAuth);
    return () => {
      window.removeEventListener('auth-changed', onAuth);
      window.removeEventListener('storage', onAuth);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [refresh]);

  return (
    <WhaleWatchContext.Provider
      value={{
        active,
        plan,
        radar,
        alerts,
        ready,
        error,
        loading,
        refresh,
        loadAlerts,
      }}
    >
      {children}
    </WhaleWatchContext.Provider>
  );
}

export function useWhaleWatch() {
  const ctx = useContext(WhaleWatchContext);
  if (!ctx) throw new Error('useWhaleWatch debe usarse dentro de WhaleWatchProvider');
  return ctx;
}
