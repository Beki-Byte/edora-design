import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../lib/store';
import { EMPTY_FORM, buildOrderMessage, validate, whatsappUrl, type OrderForm } from '../lib/order';
import { BUSINESS } from '../data/business';
import { CloseButton, Dialog } from './Dialog';
import { ItemSummary } from './Cart';

const FORM_KEY = 'edora-siparis-formu-v1';
type Phase = 'form' | 'sent' | 'blocked';

export function Checkout() {
  const { ui, setUi, items, clear } = useStore();
  const [form, setForm] = useState<OrderForm>(() => {
    try {
      return { ...EMPTY_FORM, ...JSON.parse(sessionStorage.getItem(FORM_KEY) || '{}') };
    } catch {
      return EMPTY_FORM;
    }
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderForm, string>>>({});
  const [phase, setPhase] = useState<Phase>('form');
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(FORM_KEY, JSON.stringify(form));
    } catch { /* yoksay */ }
  }, [form]);

  useEffect(() => {
    if (ui.checkout) (setPhase('form'), setCopied(null));
  }, [ui.checkout]);

  const message = useMemo(() => buildOrderMessage(items, form), [items, form]);
  const url = whatsappUrl(message);
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const close = () => setUi({ checkout: false });

  const bind = (k: keyof OrderForm) => ({
    id: `f-${k}`,
    name: k,
    value: form[k],
    'aria-invalid': !!errors[k],
    'aria-describedby': errors[k] ? `e-${k}` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
    },
  });
  const Err = ({ k }: { k: keyof OrderForm }) => (errors[k] ? <small className="field__error" id={`e-${k}`} role="alert">{errors[k]}</small> : null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er = validate(form);
    setErrors(er);
    const firstBad = Object.keys(er)[0];
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`#f-${firstBad}`)?.focus();
      return;
    }
    // Talep WhatsApp'a aktarılır. Sunucuya kayıt yapılmadığı için "siparişiniz alındı" denmez.
    // 'noopener' özelliği her zaman null döndürdüğü için pencere açıldıktan sonra opener sıfırlanır
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    setPhase(win ? 'sent' : 'blocked');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied('ok');
    } catch {
      setCopied('fail');
    }
  };

  return (
    <Dialog open={ui.checkout} onClose={close} className="dialog--checkout" label="Sipariş talebi">
      <div className="co">
        <CloseButton onClick={close} />

        {phase === 'form' && (
          <>
            <header className="co__head">
              <p className="eyebrow">Sipariş talebi</p>
              <h2>Bilgilerinizi <em>tamamlayın</em></h2>
              <p>Formu gönderdiğinizde sipariş özetiniz WhatsApp'ta hazır bir mesaj olarak açılır. Mesajı gönderdiğinizde talebiniz bize ulaşır; bu adımda ödeme alınmaz.</p>
            </header>
            <div className="co__grid">
              <form ref={formRef} className="co__form" onSubmit={submit} noValidate>
                <label className="field"><span>Ad Soyad *</span><input type="text" autoComplete="name" required {...bind('name')} /><Err k="name" /></label>
                <label className="field"><span>Telefon Numarası *</span><input type="tel" inputMode="tel" autoComplete="tel" placeholder="05xx xxx xx xx" required {...bind('phone')} /><Err k="phone" /></label>
                <label className="field field--full"><span>E-posta <small>(isteğe bağlı)</small></span><input type="email" autoComplete="email" {...bind('email')} /><Err k="email" /></label>
                <label className="field field--full"><span>Teslimat Adresi *</span><textarea rows={2} autoComplete="street-address" required {...bind('address')} /><Err k="address" /></label>
                <label className="field"><span>Şehir *</span><input type="text" autoComplete="address-level1" required {...bind('city')} /><Err k="city" /></label>
                <label className="field"><span>Posta Kodu <small>(isteğe bağlı)</small></span><input type="text" inputMode="numeric" autoComplete="postal-code" maxLength={5} {...bind('zip')} /><Err k="zip" /></label>
                <label className="field field--full"><span>İstenen Teslim Tarihi <small>(isteğe bağlı)</small></span><input type="date" min={today} {...bind('date')} /><Err k="date" /><small className="field__hint">Tarih bir tercihtir; uygunluk sipariş onayında teyit edilir.</small></label>
                <label className="field field--full"><span>Kişisel Mesaj <small>(hediye kartı için)</small></span><textarea rows={2} maxLength={300} {...bind('message')} /></label>
                <label className="field field--full"><span>Sipariş Notları</span><textarea rows={2} maxLength={400} {...bind('notes')} /></label>
                {Object.values(errors).some(Boolean) && <p className="co__error" role="alert">Lütfen işaretli alanları kontrol edin.</p>}
                <button type="submit" className="btn btn--dark btn--block field--full" disabled={items.length === 0}>
                  <WaIcon /> Talebi WhatsApp ile Gönder
                </button>
                <p className="fineprint field--full">Bilgileriniz yalnızca bu cihazda tutulur ve siz gönderene kadar hiçbir yere iletilmez. Ayrıntılar için <button type="button" className="inline-link" onClick={() => setUi({ legal: 'gizlilik' })}>Gizlilik</button> bölümüne bakabilirsiniz.</p>
              </form>

              <aside className="co__summary" aria-label="Sipariş özeti">
                <h3>Sipariş özeti</h3>
                {items.length === 0 && <p>Sepetinizde ürün yok.</p>}
                <ul>
                  {items.map((it) => (
                    <li key={it.uid}>
                      <img src={it.image} alt="" width="56" height="70" />
                      <div>
                        <strong>{it.name} <span>× {it.qty}</span></strong>
                        <ItemSummary item={it} />
                      </div>
                    </li>
                  ))}
                </ul>
                <button type="button" className="text-btn" onClick={() => setUi({ checkout: false, cart: true })}>Sepeti düzenle</button>
              </aside>
            </div>
          </>
        )}

        {phase !== 'form' && (
          <div className="co__done" role="status">
            <p className="eyebrow">{phase === 'sent' ? 'Son bir adım' : 'WhatsApp açılamadı'}</p>
            {phase === 'sent' ? (
              <>
                <h2>WhatsApp'ta mesajı <em>gönderin</em></h2>
                <p>Sipariş özetiniz yeni sekmede hazır bir WhatsApp mesajı olarak açıldı. <strong>Talebiniz, mesajı gönderdiğinizde bize ulaşır</strong>; fiyat ve teslimat bilgisini aynı sohbetten iletiriz.</p>
              </>
            ) : (
              <>
                <h2>Pencere <em>engellendi</em></h2>
                <p>Tarayıcınız yeni sekmenin açılmasına izin vermedi; talebiniz henüz iletilmedi. Aşağıdaki bağlantıyla WhatsApp'ı açabilir ya da mesajı kopyalayıp {BUSINESS.phoneDisplay} numarasına gönderebilirsiniz.</p>
              </>
            )}
            <div className="co__done-actions">
              <a className="btn btn--dark" href={url} target="_blank" rel="noopener noreferrer"><WaIcon /> {phase === 'sent' ? 'WhatsApp\'ı yeniden aç' : 'WhatsApp\'ı aç'}</a>
              <button type="button" className="btn btn--ghost" onClick={copy}>Mesajı kopyala</button>
            </div>
            {copied === 'ok' && <p className="co__note" role="status">Mesaj kopyalandı. WhatsApp'ta {BUSINESS.phoneDisplay} numarasına yapıştırabilirsiniz.</p>}
            {copied === 'fail' && <p className="co__error" role="alert">Kopyalanamadı. Lütfen aşağıdaki metni elle seçip kopyalayın.</p>}
            <details className="co__msg" open={copied === 'fail'}>
              <summary>Gönderilecek mesajı göster</summary>
              <pre>{message}</pre>
            </details>
            <div className="co__after">
              <button type="button" className="text-btn" onClick={() => setPhase('form')}>Bilgileri düzenle</button>
              <button type="button" className="text-btn" onClick={() => (clear(), close())}>Mesajı gönderdim, sepeti boşalt</button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M12 3.2a8.8 8.8 0 00-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1012 3.2z" />
      <path d="M9 8.3c-.4.9-.3 2.1.7 3.5 1.1 1.5 2.4 2.5 3.9 3 .9.3 1.7-.2 2.1-1" strokeLinecap="round" />
    </svg>
  );
}
