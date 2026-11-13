import { useRef, useState } from 'react';
import { BAG_LOOKS, CUSTOM_PRODUCT_ID, EXTRAS, POM_LOOKS, RIBBON_LOOKS, ROSE_LOOKS, type Look } from '../data/products';
import { useStore } from '../lib/store';
import { flyToCart } from '../lib/scroll';
import { GiftLayers } from './GiftLayers';

const DEFAULTS = { bag: 'gumus', pom: 'krem', rose: 'mavi', ribbon: 'mavi' };
const lbl = (list: Look[], id: string) => list.find((l) => l.id === id)!.label;

function Swatches({ title, list, value, onChange }: { title: string; list: Look[]; value: string; onChange: (id: string) => void }) {
  return (
    <fieldset className="swatches">
      <legend>
        {title} <b>{lbl(list, value)}</b>
      </legend>
      <div>
        {list.map((l) => (
          <label key={l.id} className={value === l.id ? 'on' : ''} title={l.label}>
            <input type="radio" name={title} checked={value === l.id} onChange={() => onChange(l.id)} />
            <span className="sw" style={{ background: l.swatch }} aria-hidden="true" />
            <span className="sr-only">{l.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Configurator() {
  const { add, notify, setUi } = useStore();
  const [look, setLook] = useState(DEFAULTS);
  const [extras, setExtras] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const set = (k: keyof typeof DEFAULTS) => (id: string) => setLook((s) => ({ ...s, [k]: id }));

  const dirty = JSON.stringify(look) !== JSON.stringify(DEFAULTS) || extras.length > 0 || !!name || !!message;
  const reset = () => {
    setLook(DEFAULTS);
    setExtras([]);
    setName('');
    setMessage('');
  };

  const summary = [
    ['Ambalaj', lbl(BAG_LOOKS, look.bag)],
    ['Çiçek rengi', lbl(POM_LOOKS, look.pom)],
    ['Gül rengi', lbl(ROSE_LOOKS, look.rose)],
    ['Kurdele', lbl(RIBBON_LOOKS, look.ribbon)],
    ['Süslemeler', extras.length ? extras.join(', ') : '—'],
    ['Çanta yazısı', name.trim() || '—'],
    ['Kart mesajı', message.trim() || '—'],
  ];

  const addToCart = () => {
    add({
      productId: CUSTOM_PRODUCT_ID,
      name: 'Özel Tasarım Çanta Aranjmanı',
      image: './layers/base.webp',
      price: null,
      options: { ambalaj: lbl(BAG_LOOKS, look.bag), cicek: lbl(POM_LOOKS, look.pom), gul: lbl(ROSE_LOOKS, look.rose), kurdele: lbl(RIBBON_LOOKS, look.ribbon) },
      extras,
      text: [name.trim() && `Çanta yazısı: ${name.trim()}`, message.trim() && `Kart: ${message.trim()}`].filter(Boolean).join(' · '),
      textLabel: 'Kişiselleştirme',
      qty: 1,
    });
    flyToCart(previewRef.current?.querySelector('.gift__base') as HTMLElement);
    notify('Tasarımınız sepete eklendi');
  };

  return (
    <section className="config" id="tasarla" aria-labelledby="cfg-title">
      <header className="config__head">
        <p className="eyebrow">Tasarımını oluştur</p>
        <h2 id="cfg-title">
          Hediyenizi <em>siz</em> tasarlayın.
        </h2>
      </header>

      <div className="config__preview" ref={previewRef}>
        <div className="config__frame">
          <GiftLayers look={look} alt="Seçimlerinize göre güncellenen hediye çantası önizlemesi" />
          {extras.length > 0 && (
            <ul className="config__extras" aria-label="Eklenen süslemeler">
              {extras.map((e) => <li key={e}>+ {e}</li>)}
            </ul>
          )}
        </div>
        <div className={`config__card ${name || message ? 'is-filled' : ''}`} aria-hidden="true">
          <small>Sizin için</small>
          <strong>{name.trim() || 'İsim ya da yazı'}</strong>
          <p>{message.trim() || 'Kartınıza yazılacak mesaj burada görünür.'}</p>
        </div>
        <p className="fineprint">Önizleme, gerçek ürün fotoğrafı üzerinde dijital olarak renklendirilir; çanta yazısı ve süslemeler elde uygulanır.</p>
      </div>

      <form className="config__panel" onSubmit={(e) => (e.preventDefault(), addToCart())}>
        <Swatches title="Ambalaj" list={BAG_LOOKS} value={look.bag} onChange={set('bag')} />
        <Swatches title="Çiçek rengi" list={POM_LOOKS} value={look.pom} onChange={set('pom')} />
        <Swatches title="Gül rengi" list={ROSE_LOOKS} value={look.rose} onChange={set('rose')} />
        <Swatches title="Kurdele" list={RIBBON_LOOKS} value={look.ribbon} onChange={set('ribbon')} />

        <fieldset className="chips chips--dark">
          <legend>Süslemeler <small>(isteğe bağlı)</small></legend>
          {EXTRAS.map((e) => (
            <label key={e} className={extras.includes(e) ? 'on' : ''}>
              <input type="checkbox" checked={extras.includes(e)} onChange={() => setExtras((s) => (s.includes(e) ? s.filter((x) => x !== e) : [...s, e]))} />
              {e}
            </label>
          ))}
        </fieldset>

        <div className="config__texts">
          <label className="field field--dark">
            <span>Çanta üzerindeki isim / yazı</span>
            <input type="text" value={name} maxLength={32} placeholder="Örn. Canım Anneme" onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="field field--dark">
            <span>Kart mesajı</span>
            <textarea value={message} maxLength={140} rows={2} placeholder="Sevdiğinize iletmek istediğiniz not" onChange={(e) => setMessage(e.target.value)} />
            <small className="field__count">{message.length}/140</small>
          </label>
        </div>

        <div className="config__summary" aria-live="polite">
          <h3>Seçiminiz</h3>
          <dl>
            {summary.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="config__actions">
          <button type="submit" className="btn btn--light btn--grow">Tasarımı Sepete Ekle</button>
          <button type="button" className="btn btn--ghost-light" onClick={reset} disabled={!dirty}>Sıfırla</button>
        </div>
        <button type="button" className="link-arrow link-arrow--light" onClick={() => setUi({ cart: true })}>Sepeti görüntüle</button>
      </form>
    </section>
  );
}
