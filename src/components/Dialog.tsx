import { useEffect, useRef, type ReactNode } from 'react';
import { lockScroll } from '../lib/scroll';

/* Yerel <dialog>: odak tuzağı, Esc ile kapatma ve arka plan tıklaması tarayıcıdan gelir. */
export function Dialog({ open, onClose, className = '', label, children }: { open: boolean; onClose: () => void; className?: string; label: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      lockScroll(true);
      return () => lockScroll(false);
    }
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-label={label}
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && children}
    </dialog>
  );
}

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="close-btn" onClick={onClick} aria-label="Kapat">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.2" fill="none" /></svg>
    </button>
  );
}
