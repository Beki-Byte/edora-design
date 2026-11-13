import { useState } from 'react';
import { useStore, type CartItem } from '../lib/store';
import { optionDefsFor } from '../lib/order';
import { formatPrice } from '../data/products';
import { scrollToId } from '../lib/scroll';
import { CloseButton, Dialog } from './Dialog';

export function ItemSummary({ item }: { item: CartItem }) {
  const defs = optionDefsFor(item.productId);
  return (
    <ul className="item__opts">
      {defs.map((d) => item.options[d.key] && <li key={d.key}><span>{d.label}:</span> {item.options[d.key]}</li>)}
      {!!item.extras?.length && <li><span>Süslemeler:</span> {item.extras.join(', ')}</li>}
      {item.text.trim() && <li><span>{item.textLabel}:</span> “{item.text.trim()}”</li>}
    </ul>
  );
}

function Item({ item }: { item: CartItem }) {
  const { remove, setQty, update } = useStore();
  const [edit, setEdit] = useState(false);
  const defs = optionDefsFor(item.productId);

  return (
    <li className="item">
      <img src={item.image} alt="" width="84" height="105" />
      <div className="item__body">
        <div className="item__top">
          <h3>{item.name}</h3>
          <p className="item__price">{formatPrice(item.price)}</p>
        </div>
        {!edit && <ItemSummary item={item} />}
        {edit && (
          <div className="item__edit">
            {defs.map((d) => (
              <label key={d.key} className="field field--sm">
                <span>{d.label}</span>
                <select value={item.options[d.key] ?? ''} onChange={(e) => update(item.uid, { options: { ...item.options, [d.key]: e.target.value } })}>
                  {d.choices.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
            ))}
            <label className="field field--sm">
              <span>{item.textLabel}</span>
              <input type="text" value={item.text} maxLength={200} onChange={(e) => update(item.uid, { text: e.target.value })} />
            </label>
          </div>
        )}
        <div className="item__row">
          <div className="qty qty--sm" role="group" aria-label={`${item.name} adedi`}>
            <button type="button" onClick={() => setQty(item.uid, item.qty - 1)} disabled={item.qty <= 1} aria-label="Adedi azalt">−</button>
            <output aria-live="polite">{item.qty}</output>
            <button type="button" onClick={() => setQty(item.uid, item.qty + 1)} aria-label="Adedi artır">+</button>
          </div>
          <button type="button" className="text-btn" onClick={() => setEdit((e) => !e)} aria-expanded={edit}>{edit ? 'Tamam' : 'Düzenle'}</button>
          <button type="button" className="text-btn text-btn--danger" onClick={() => remove(item.uid)}>Kaldır</button>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer() {
  const { ui, setUi, items, count } = useStore();
  const close = () => setUi({ cart: false });
  const priced = items.every((i) => i.price != null);
  const total = items.reduce((s, i) => s + (i.price ?? 0) * i.qty, 0);

  return (
    <Dialog open={ui.cart} onClose={close} className="dialog--drawer" label="Sepet">
      <div className="drawer">
        <header className="drawer__head">
          <h2>Sepetiniz <sup>{count}</sup></h2>
          <CloseButton onClick={close} />
        </header>

        {items.length === 0 ? (
          <div className="drawer__empty">
            <p className="serif">Sepetiniz henüz boş.</p>
            <p>Koleksiyondan bir tasarım seçin ya da kendi hediyenizi oluşturun.</p>
            <button type="button" className="btn btn--dark" onClick={() => (close(), setTimeout(() => scrollToId('koleksiyon'), 80))}>Koleksiyona Git</button>
          </div>
        ) : (
          <>
            <ul className="drawer__list">
              {items.map((it) => <Item key={it.uid} item={it} />)}
            </ul>
            <footer className="drawer__foot">
              <div className="drawer__total">
                <span>Toplam</span>
                <strong>{priced ? formatPrice(total) : 'Sipariş talebinden sonra bildirilir'}</strong>
              </div>
              <p className="fineprint">Bu adımda ödeme alınmaz. Talebiniz WhatsApp üzerinden EdoraDesign'a iletilir; fiyat ve teslimat ayrıntıları size yazılı olarak bildirilir.</p>
              <button type="button" className="btn btn--dark btn--block" onClick={() => setUi({ cart: false, checkout: true })}>Sipariş Talebi Oluştur</button>
            </footer>
          </>
        )}
      </div>
    </Dialog>
  );
}
