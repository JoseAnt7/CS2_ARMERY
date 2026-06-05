import { useState } from 'react';
import { useWhaleWatch } from '../context/WhaleWatchContext';
import { WhaleWatchModal } from './WhaleWatchModal';
import '../styles/whalewatch.css';

export function WhaleWatchWidget() {
  const { active, ready, alerts } = useWhaleWatch();
  const alertCount = alerts?.length ?? 0;
  const [modalOpen, setModalOpen] = useState(false);

  if (!ready || !active) return null;

  return (
    <>
      <button
        type="button"
        className="ww-fab"
        onClick={() => setModalOpen(true)}
        title={`WhaleWatch · ${alertCount} alertas activas`}
        aria-label="Abrir WhaleWatch"
      >
        <span className="ww-fab__icon" aria-hidden>
          🐋
        </span>
        {alertCount > 0 && <span className="ww-fab__badge">{alertCount}</span>}
        <span className="ww-fab__pulse ww-fab__pulse--active" />
      </button>

      <WhaleWatchModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
