import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import { lockScroll, scrollToId } from '../lib/scroll';

export const NAV = [
  { id: 'ana-sayfa', label: 'Ana Sayfa' },
  { id: 'koleksiyon', label: 'Koleksiyon' },
  { id: 'tasarla', label: 'Tasarımını Oluştur' },
  { id: 'hakkimizda', label: 'Hakkımızda' },
  { id: 'iletisim', label: 'İletişim' },
];

export function Header() {
  const { count, setUi } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        setHidden(y > 500 && y > last + 4 ? true : y < last - 4 ? false : (h) => h);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sepete ürün eklendiğinde üst menü geri gelir: sepet düğmesi her zaman erişilebilir kalır
  useEffect(() => {
    setHidden(false);
  }, [count]);

  useEffect(() => {
    if (!menu) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [menu]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenu(false);
    // menü kapanıp kaydırma kilidi kalktıktan sonra
    setTimeout(() => scrollToId(id), menu ? 60 : 0);
  };

  return (
    <>
      <a className="skip" href="#koleksiyon">İçeriğe geç</a>
      <header className={`header ${scrolled ? 'is-scrolled' : ''} ${hidden && !menu ? 'is-hidden' : ''} ${menu ? 'is-menu' : ''}`}>
        <a href="#ana-sayfa" className="header__logo" onClick={go('ana-sayfa')} aria-label="EdoraDesign — Ana Sayfa">
          <img src="./img/logo.png" alt="EdoraDesign" width="571" height="214" />
        </a>
        <nav className="header__nav" aria-label="Ana menü">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={go(n.id)}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="header__actions">
          <button type="button" className="cart-btn" data-cart-target onClick={() => setUi({ cart: true })} aria-label={`Sepeti aç, ${count} ürün`}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M5 8.5h14l-1.2 11H6.2L5 8.5z" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8.5 8.5V7a3.5 3.5 0 017 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span className="cart-btn__label">Sepet</span>
            <span className={`cart-btn__count ${count ? 'has' : ''}`} aria-hidden="true">{count}</span>
          </button>
          <button type="button" className="burger" aria-expanded={menu} aria-controls="mobil-menu" aria-label={menu ? 'Menüyü kapat' : 'Menüyü aç'} onClick={() => setMenu((m) => !m)}>
            <span /><span />
          </button>
        </div>
      </header>
      <div id="mobil-menu" className={`mmenu ${menu ? 'is-open' : ''}`} aria-hidden={!menu} inert={!menu ? true : undefined}>
        <nav aria-label="Mobil menü">
          {NAV.map((n, i) => (
            <a key={n.id} href={`#${n.id}`} onClick={go(n.id)} style={{ transitionDelay: `${menu ? 80 + i * 55 : 0}ms` }}>
              <small>{String(i + 1).padStart(2, '0')}</small>
              {n.label}
            </a>
          ))}
        </nav>
        <p className="mmenu__foot">Giresun · Tüm illere kargo</p>
      </div>
    </>
  );
}
