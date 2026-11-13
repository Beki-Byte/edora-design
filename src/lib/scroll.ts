import Lenis from 'lenis';

/* Lenis yalnızca fare/tekerlek kullanılan masaüstünde devreye girer;
   dokunmatik kaydırma tarayıcının doğal davranışında bırakılır. */
let lenis: Lenis | null = null;

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion() || !isFinePointer()) return () => {};
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, smoothWheel: true });
  let id = 0;
  const raf = (t: number) => {
    lenis?.raf(t);
    id = requestAnimationFrame(raf);
  };
  id = requestAnimationFrame(raf);
  return () => {
    cancelAnimationFrame(id);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', `#${id}`);
}

let locks = 0;
export function lockScroll(on: boolean) {
  locks = Math.max(0, locks + (on ? 1 : -1));
  if (locks > 0) {
    lenis?.stop();
    document.documentElement.classList.add('is-locked');
  } else {
    lenis?.start();
    document.documentElement.classList.remove('is-locked');
  }
}

/** Ürün görselini sepet simgesine doğru uçurur. */
export function flyToCart(source: HTMLElement | null) {
  const target = document.querySelector<HTMLElement>('[data-cart-target]');
  if (!source || !target || prefersReducedMotion()) {
    target?.classList.remove('bump');
    void target?.offsetWidth;
    target?.classList.add('bump');
    return;
  }
  const a = source.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const ghost = source.cloneNode(true) as HTMLElement;
  ghost.removeAttribute('id');
  const size = Math.min(a.width, 220);
  const h = size * (a.height / a.width);
  Object.assign(ghost.style, {
    position: 'fixed', left: `${a.left + (a.width - size) / 2}px`, top: `${a.top + (a.height - h) / 2}px`,
    width: `${size}px`, height: `${h}px`, objectFit: 'cover', zIndex: '2147483000', pointerEvents: 'none',
    borderRadius: '999px 999px 6px 6px', margin: '0', willChange: 'transform, opacity',
  } as CSSStyleDeclaration);
  // <dialog> açıkken üst katmanda görünmesi için açık diyaloğun içine eklenir
  (document.querySelector('dialog[open]') ?? document.body).appendChild(ghost);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = ghost.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.35}px, ${dy * 0.55 - 60}px) scale(.62) rotate(-6deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(.08) rotate(8deg)`, opacity: 0.4 },
    ],
    { duration: 820, easing: 'cubic-bezier(.5,0,.2,1)' },
  );
  anim.onfinish = () => {
    ghost.remove();
    target.classList.remove('bump');
    void target.offsetWidth;
    target.classList.add('bump');
  };
}
