import { useState } from 'react';
import { CATEGORIES, PRODUCTS, formatPrice, type CategoryId } from '../data/products';
import { useStore } from '../lib/store';

export function Collection() {
  const { setUi } = useStore();
  const [cat, setCat] = useState<CategoryId | 'tum'>('tum');
  const list = PRODUCTS.filter((p) => cat === 'tum' || p.category === cat);

  return (
    <section className="collection" id="koleksiyon" aria-labelledby="col-title">
      <header className="collection__head">
        <p className="eyebrow">Koleksiyon</p>
        <h2 id="col-title">
          Atölyeden <em>çıkanlar</em>
        </h2>
        <p className="collection__lead">
          Aşağıdaki tasarımların her biri EdoraDesign atölyesinde hazırlandı. Beğendiğiniz tasarımı renk, yazı ve not seçenekleriyle kendinize göre uyarlayabilirsiniz.
        </p>
      </header>

      <div className="filters" role="tablist" aria-label="Kategoriler">
        {[{ id: 'tum' as const, label: 'Tümü' }, ...CATEGORIES].map((c) => (
          <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} className={cat === c.id ? 'on' : ''} onClick={() => setCat(c.id)}>
            {c.label}
            <sup>{c.id === 'tum' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c.id).length}</sup>
          </button>
        ))}
      </div>

      <ul className={`grid ${cat !== 'tum' ? 'grid--filtered' : ''}`} key={cat}>
        {list.map((p, i) => (
          <li key={p.id} className={`card card--${(i % 6) + 1}`} style={{ ['--i' as string]: i }}>
            <button type="button" className="card__btn" onClick={() => setUi({ productId: p.id })} data-cursor="İncele" aria-label={`${p.name} — ayrıntıları aç`}>
              <span className="card__media" style={{ aspectRatio: i % 3 === 1 ? '4 / 5' : '3 / 4' }}>
                <img src={`./img/${p.image}-sm.webp`} srcSet={`./img/${p.image}-sm.webp 550w, ./img/${p.image}.webp 1100w`} sizes="(max-width: 700px) 92vw, 34vw" alt={p.alt} loading="lazy" decoding="async" style={{ objectPosition: p.focus }} />
                <span className="card__open" aria-hidden="true">İncele</span>
              </span>
              <span className="card__meta">
                <span className="card__no" aria-hidden="true">N° {String(PRODUCTS.indexOf(p) + 1).padStart(2, '0')}</span>
                <span className="card__name"><span>{p.name}</span></span>
                <span className="card__tag">{p.tagline}</span>
                <span className="card__price">{formatPrice(p.price)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
