import { useState } from 'react';

import { useWhaleWatch } from '../context/WhaleWatchContext';

import '../styles/whalewatch.css';

const FILTER_OPTIONS = [
  { id: 'all', label: 'Todas' },
  { id: 'accumulation', label: 'Acumulación' },
  { id: 'mass_dump', label: 'Dump' },
  { id: 'pump_dump', label: 'Pump & dump' },
];

function alertTypeClass(type) {
  if (type === 'accumulation') return 'ww-alert__type--accumulation';
  if (type === 'mass_dump') return 'ww-alert__type--mass_dump';
  if (type === 'pump_dump') return 'ww-alert__type--pump_dump';
  return '';
}

function formatScanTime(iso) {
  if (!iso) return 'Aún no ha escaneado';
  try {
    return new Date(iso).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function WhaleWatchModal({ open, onClose }) {
  const { plan, radar, alerts, error, loading, loadAlerts } = useWhaleWatch();
  const [filter, setFilter] = useState('all');

  if (!open) return null;

  const visible = filter === 'all' ? alerts : alerts.filter((a) => a.type === filter);

  return (
    <div className="ww-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="ww-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="ww-modal-title"
      >
        <header className="ww-modal__header">
          <h2 id="ww-modal-title" className="ww-modal__title">
            WhaleWatch · {plan?.name || 'Radar'}
          </h2>
          <button type="button" className="ww-modal__close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>

        <div className="ww-modal__body">
          <div className="ww-radar-bar">
            <p>
              <strong>Radar activo</strong> — vigilando todo el catálogo CS2 en segundo plano.
            </p>
            <p className="ww-radar-bar__meta">
              {radar?.catalog_total?.toLocaleString('es-ES') ?? '—'} artículos ·{' '}
              {radar?.tracked_items?.toLocaleString('es-ES') ?? '—'} con histórico ·{' '}
              {radar?.active_alerts ?? 0} alertas · último lote:{' '}
              {formatScanTime(radar?.last_scan_at)}
            </p>
          </div>

          <div className="ww-chips">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`ww-chip ${filter === opt.id ? 'ww-chip--on' : ''}`}
                onClick={() => setFilter(opt.id)}
              >
                {opt.label}
              </button>
            ))}
            <button
              type="button"
              className="ww-btn ww-btn--ghost"
              onClick={loadAlerts}
              disabled={loading}
              style={{ marginLeft: 'auto' }}
            >
              {loading ? 'Actualizando…' : 'Actualizar'}
            </button>
          </div>

          {error && <p className="ww-error">{error}</p>}
          {radar?.disclaimer && <p className="ww-disclaimer">{radar.disclaimer}</p>}

          <div className="ww-results">
            {visible.length > 0 ? (
              visible.map((alert) => (
                <article key={`${alert.market_hash_name}-${alert.type}`} className="ww-alert">
                  {alert.image && (
                    <img src={alert.image} alt="" className="ww-alert__img" loading="lazy" />
                  )}
                  <div>
                    <div className={`ww-alert__type ${alertTypeClass(alert.type)}`}>
                      {alert.label}
                    </div>
                    <h3 className="ww-alert__name">{alert.display_name}</h3>
                    <p className="ww-alert__summary">{alert.summary}</p>
                    {alert.steam_url && (
                      <a
                        href={alert.steam_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.75rem', color: '#38bdf8' }}
                      >
                        Ver en Steam
                      </a>
                    )}
                  </div>
                  <div className="ww-severity">{alert.severity}</div>
                </article>
              ))
            ) : (
              <p className="ww-empty">
                {radar?.last_scan_at
                  ? 'Sin alertas por encima del umbral. El radar sigue escaneando…'
                  : 'El radar está arrancando. Las primeras alertas aparecerán cuando haya histórico suficiente.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
