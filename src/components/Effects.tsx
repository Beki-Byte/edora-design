import { useEffect, useRef } from 'react';
import { isFinePointer, prefersReducedMotion } from '../lib/scroll';
import { useStore } from '../lib/store';

/* Masaüstü için özel imleç. Dokunmatik cihazlarda ve azaltılmış harekette devre dışıdır;
   gerçek imleç gizlenmez, böylece tıklama ve erişilebilirlik etkilenmez. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const el = ref.current!;
    const label = el.querySelector('span')!;
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0, on = false;
    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.2 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (!on) (on = true, cx = x, cy = y, el.classList.add('is-on'));
      const t = (e.target as Element | null)?.closest?.('[data-cursor], a, button, label, input, select, textarea, summary');
      const text = t?.getAttribute('data-cursor') ?? '';
      el.classList.toggle('is-link', !!t && !text);
      el.classList.toggle('is-label', !!text);
      if (text && label.textContent !== text) label.textContent = text;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => (on = false, el.classList.remove('is-on'));
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <span />
    </div>
  );
}

/* Seçili öğelerde ölçülü paralaks ve bölüm girişleri — tek bir rAF döngüsü, yalnızca görünür öğeler. */
export function useAmbientMotion() {
  useEffect(() => {
    const reduce = prefersReducedMotion();
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const rio = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), rio.unobserve(e.target))),
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
    );
    reveals.forEach((r) => rio.observe(r));
    if (reduce) return () => rio.disconnect();

    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax], [data-parallax-img]'));
    const active = new Set<HTMLElement>();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? active.add(e.target as HTMLElement) : active.delete(e.target as HTMLElement)));
      if (active.size && !raf) raf = requestAnimationFrame(loop);
    }, { rootMargin: '20% 0px' });
    els.forEach((e) => io.observe(e));
    let raf = 0;
    let lastY = -1;
    const loop = () => {
      raf = 0;
      if (!active.size) return;
      const y = window.scrollY;
      if (y !== lastY) {
        lastY = y;
        const vh = window.innerHeight;
        active.forEach((el) => {
          const r = (el.parentElement ?? el).getBoundingClientRect();
          const mid = r.top + r.height / 2 - vh / 2;
          if (el.hasAttribute('data-parallax-img')) el.style.transform = `translate3d(0, ${(mid * -0.05).toFixed(1)}px, 0) scale(1.1)`;
          else el.style.transform = `translate3d(0, ${(mid * Number(el.dataset.parallax)).toFixed(1)}px, 0)`;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    return () => {
      rio.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);
}

export function Toast() {
  const { toast } = useStore();
  return (
    <div className={`toast ${toast ? 'is-on' : ''}`} role="status" aria-live="polite">
      {toast}
    </div>
  );
}
