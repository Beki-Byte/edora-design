import { useState } from 'react';
import { PALETTES } from '../data/products';
import { GiftLayers } from './GiftLayers';
import { scrollToId } from '../lib/scroll';

export function FlowerSwitch() {
  const [i, setI] = useState(0);
  const p = PALETTES[i];

  return (
    <section className="switch" id="renkler" aria-labelledby="switch-title" style={{ ['--accent' as string]: p.accent }}>
      <div className="switch__word" aria-hidden="true" key={p.id}>
        {p.label}
      </div>

      <div className="switch__stage" data-parallax="-0.04">
        <GiftLayers look={{ rose: p.rose, pom: p.pom, ribbon: p.ribbon, bag: 'gumus' }} alt={`Hologram çanta aranjmanı, ${p.label.toLocaleLowerCase('tr')} renk seçeneği önizlemesi`} />
        <div className="switch__petals" key={p.id} aria-hidden="true">
          {Array.from({ length: 9 }, (_, k) => <i key={k} style={{ ['--k' as string]: k }} />)}
        </div>
      </div>

      <div className="switch__panel">
        <p className="eyebrow">Çiçeğini değiştir</p>
        <h2 id="switch-title">Aynı çanta, <em>bambaşka</em> bir his.</h2>
        <div className="switch__options" role="radiogroup" aria-label="Çiçek rengi">
          {PALETTES.map((o, k) => (
            <button key={o.id} type="button" role="radio" aria-checked={k === i} className={k === i ? 'on' : ''} onClick={() => setI(k)} style={{ ['--sw' as string]: o.accent }}>
              <span className="sw" aria-hidden="true" />
              <span className="nm">{o.label}</span>
              <span className="ix" aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
        <p className="switch__note" aria-live="polite">{p.note}</p>
        <p className="fineprint">
          Renkler, gerçek ürün fotoğrafı üzerinde hazırlanmış dijital bir önizlemedir. Her tasarım elde hazırlandığı için tonlar küçük farklılıklar gösterebilir.
        </p>
        <button type="button" className="link-arrow" onClick={() => scrollToId('tasarla')}>
          Tüm ayrıntıları kendin seç
        </button>
      </div>
    </section>
  );
}
