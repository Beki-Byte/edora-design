import { useEffect, useRef, useState } from 'react';
import { CATEGORIES, PRODUCTS, formatPrice } from '../data/products';
import { useStore } from '../lib/store';
import { flyToCart } from '../lib/scroll';
import { whatsappUrl } from '../lib/order';
import { CloseButton, Dialog } from './Dialog';

export function ProductDialog() {
  const { ui, setUi, add, notify } = useStore();
  const product = PRODUCTS.find((p) => p.id === ui.productId) ?? null;
  const [opts, setOpts] = useState<Record<string, string>>({});
  const [text, setText] = useState('');
  const [qty, setQty] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!product) return;
    setOpts(Object.fromEntries(product.options.map((o) => [o.key, o.choices[0]])));
    setText('');
    setQty(1);
  }, [product]);

  const close = () => setUi({ productId: null });

  const addToCart = () => {
    if (!product) return;
    add({ productId: product.id, name: product.name, image: `./img/${product.image}-sm.webp`, price: product.price, options: opts, text, textLabel: product.personalization.label, qty });
    flyToCart(imgRef.current);
    notify(`${product.name} sepete eklendi`);
    setTimeout(close, 560);
  };

  return (
    <Dialog open={!!product} onClose={close} className="dialog--product" label={product?.name ?? 'Ürün'}>
      {product && (
        <div className="pd">
          <CloseButton onClick={close} />
          <div className="pd__media">
            <img ref={imgRef} src={`./img/${product.image}.webp`} alt={product.alt} style={{ objectPosition: product.focus }} />
          </div>
          <div className="pd__body">
            <p className="eyebrow">{CATEGORIES.find((c) => c.id === product.category)?.label}</p>
            <h2>{product.name}</h2>
            <p className="pd__price">{formatPrice(product.price)}</p>
            <p className="pd__desc">{product.description}</p>

            {product.options.map((o) => (
              <fieldset key={o.key} className="chips">
                <legend>{o.label}</legend>
                {o.choices.map((c) => (
                  <label key={c} className={opts[o.key] === c ? 'on' : ''}>
                    <input type="radio" name={`${product.id}-${o.key}`} checked={opts[o.key] === c} onChange={() => setOpts((s) => ({ ...s, [o.key]: c }))} />
                    {c}
                  </label>
                ))}
              </fieldset>
            ))}

            <label className="field">
              <span>{product.personalization.label} <small>(isteğe bağlı)</small></span>
              <input type="text" value={text} maxLength={product.personalization.max} placeholder={product.personalization.placeholder} onChange={(e) => setText(e.target.value)} />
              <small className="field__count">{text.length}/{product.personalization.max}</small>
            </label>

            <div className="pd__buy">
              <div className="qty" role="group" aria-label="Adet">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Adedi azalt">−</button>
                <output aria-live="polite">{qty}</output>
                <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Adedi artır">+</button>
              </div>
              <button type="button" className="btn btn--dark btn--grow" onClick={addToCart}>Sepete Ekle</button>
            </div>
            <a className="link-arrow" href={whatsappUrl(`Merhaba, “${product.name}” tasarımı hakkında bilgi almak istiyorum.`)} target="_blank" rel="noopener noreferrer">
              WhatsApp'tan soru sor
            </a>
            <p className="fineprint">Ürünler yapay çiçeklerle elde hazırlanır. Fiyat ve teslimat bilgisi sipariş talebinizin ardından WhatsApp üzerinden iletilir.</p>
          </div>
        </div>
      )}
    </Dialog>
  );
}
