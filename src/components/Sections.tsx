import { useState } from 'react';
import { BUSINESS } from '../data/business';
import { useStore } from '../lib/store';
import { scrollToId } from '../lib/scroll';
import { whatsappUrl } from '../lib/order';
import { CloseButton, Dialog } from './Dialog';
import { NAV } from './Header';

export function Marquee() {
  const row = BUSINESS.bio.map((b) => <span key={b}>{b}</span>);
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <div>{row}</div>
        <div>{row}</div>
        <div>{row}</div>
      </div>
    </div>
  );
}

export function About() {
  return (
    <section className="about" id="hakkimizda" aria-labelledby="about-title">
      <div className="about__media">
        <figure className="about__photo">
          <img src="./img/vitrin-sm.webp" srcSet="./img/vitrin-sm.webp 435w, ./img/vitrin.webp 870w" sizes="(max-width: 800px) 88vw, 38vw" alt="EdoraDesign mağazasının vitrini: balonlu kutular, çiçek çantaları ve peluş hediyelikler" loading="lazy" data-parallax-img />
        </figure>
        <figure className="about__photo about__photo--small" data-parallax="0.1">
          <img src="./img/peri-sm.webp" alt="Keçe peri bebekli, isme özel pembe çiçek çantası" loading="lazy" />
        </figure>
        <p className="about__stamp" aria-hidden="true">Espiye<br />Giresun</p>
      </div>
      <div className="about__copy">
        <p className="eyebrow">Hakkımızda</p>
        <h2 id="about-title">
          Küçük bir atölye, <em>büyük</em> jestler.
        </h2>
        <p>
          EdoraDesign, Giresun'un Espiye ilçesinde kişiye özel hediye tasarımları hazırlayan bir tasarım atölyesidir. Yapay çiçek aranjmanları, balon tasarımları, peluş hediyelikler ve sürpriz kutular; hepsi siparişe göre, kime gideceği düşünülerek hazırlanır.
        </p>
        <p>
          Bir isim, kısa bir not ya da sevilen bir renk… Küçük ayrıntılar bir hediyeyi kişisel kılar. Biz de her tasarıma o ayrıntıdan başlıyoruz.
        </p>
        <ul className="about__list">
          <li><span>01</span>Kişiye özel çiçek tasarımları</li>
          <li><span>02</span>Balon tasarımları</li>
          <li><span>03</span>Peluş hediyelikler</li>
          <li><span>04</span>Sürpriz kutular</li>
        </ul>
        <p className="about__ship">Giresun'dan <strong>tüm illere kargo</strong> ile gönderim yapılır. Teslimat süresi ve ücreti sipariş sırasında bildirilir.</p>
      </div>
    </section>
  );
}

export function Contact() {
  const [map, setMap] = useState(false);
  const L = BUSINESS.links;
  return (
    <section className="contact" id="iletisim" aria-labelledby="contact-title">
      <div className="contact__intro">
        <p className="eyebrow">İletişim</p>
        <h2 id="contact-title">
          Bir fikriniz mi var? <em>Yazın,</em> birlikte tasarlayalım.
        </h2>
        <a className="btn btn--dark" href={whatsappUrl('Merhaba EdoraDesign, bir hediye tasarımı hakkında bilgi almak istiyorum.')} target="_blank" rel="noopener noreferrer" data-cursor="Yaz">
          WhatsApp'tan Yazın
        </a>
      </div>

      <dl className="contact__info">
        <div>
          <dt>Adres</dt>
          <dd>
            <address>{BUSINESS.address.line1}<br />{BUSINESS.address.line2}</address>
            <a className="link-arrow" href={L.maps} target="_blank" rel="noopener noreferrer">Google Haritalar'da aç</a>
          </dd>
        </div>
        <div>
          <dt>Telefon &amp; WhatsApp</dt>
          <dd>
            <a className="contact__phone" href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a>
          </dd>
        </div>
        <div>
          <dt>Sosyal medya</dt>
          <dd className="contact__social">
            <a href={L.instagram} target="_blank" rel="noopener noreferrer">Instagram <span>@edora.design</span></a>
            <a href={L.facebook} target="_blank" rel="noopener noreferrer">Facebook <span>Edoradesign</span></a>
            <a href={L.yandex} target="_blank" rel="noopener noreferrer">Yandex Haritalar <span>Yorumlar</span></a>
          </dd>
        </div>
        <div>
          <dt>Google değerlendirmesi</dt>
          <dd className="contact__rating">
            <strong>{BUSINESS.rating.value}</strong>
            <span>/ 5 · {BUSINESS.rating.count} değerlendirme</span>
            <a className="link-arrow" href={L.maps} target="_blank" rel="noopener noreferrer">Yorumları Google'da görün</a>
          </dd>
        </div>
        {BUSINESS.hours && (
          <div>
            <dt>Çalışma saatleri</dt>
            <dd>{BUSINESS.hours.map((h) => <p key={h.days}>{h.days}: {h.time}</p>)}</dd>
          </div>
        )}
      </dl>

      <div className="contact__map">
        {map ? (
          <iframe title="EdoraDesign konumu — Google Haritalar" src={L.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        ) : (
          <button type="button" className="map-cover" onClick={() => setMap(true)} data-cursor="Aç">
            <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth="1" opacity=".4" vectorEffect="non-scaling-stroke">
                <path vectorEffect="non-scaling-stroke" d="M-10 60 C80 40 150 90 240 70 S 380 30 420 50" /><path vectorEffect="non-scaling-stroke" d="M-10 130 C60 150 170 110 250 140 S 360 170 420 150" />
                <path vectorEffect="non-scaling-stroke" d="M-10 200 C90 180 180 220 270 200 S 370 190 420 210" /><path vectorEffect="non-scaling-stroke" d="M70 -10 C60 60 110 120 90 250" />
                <path vectorEffect="non-scaling-stroke" d="M190 -10 C210 70 170 150 200 250" /><path vectorEffect="non-scaling-stroke" d="M310 -10 C290 80 340 160 320 250" />
              </g>
              <circle cx="205" cy="118" r="5" fill="currentColor" /><circle cx="205" cy="118" r="14" fill="none" stroke="currentColor" strokeWidth=".8" />
            </svg>
            <span className="map-cover__text">
              <b>Haritayı göster</b>
              <small>Harita, Google'dan yüklenir.</small>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}

export function Footer() {
  const { setUi } = useStore();
  return (
    <footer className="footer">
      <img className="footer__logo" src="./img/logo.png" alt="EdoraDesign" width="571" height="214" loading="lazy" />
      <p className="footer__line">Her detayında bir hikâye.</p>
      <nav className="footer__nav" aria-label="Alt menü">
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} onClick={(e) => (e.preventDefault(), scrollToId(n.id))}>{n.label}</a>
        ))}
      </nav>
      <div className="footer__meta">
        <span>© {new Date().getFullYear()} EdoraDesign · Espiye / Giresun</span>
        <span>
          <button type="button" className="inline-link" onClick={() => setUi({ legal: 'gizlilik' })}>Gizlilik</button>
          <button type="button" className="inline-link" onClick={() => setUi({ legal: 'yasal' })}>Yasal Bilgiler</button>
        </span>
      </div>
    </footer>
  );
}

const TODO = ({ children }: { children: string }) => <mark className="todo">[{children}]</mark>;

export function LegalDialog() {
  const { ui, setUi } = useStore();
  const close = () => setUi({ legal: null });
  return (
    <Dialog open={!!ui.legal} onClose={close} className="dialog--legal" label={ui.legal === 'yasal' ? 'Yasal Bilgiler' : 'Gizlilik'}>
      <div className="legal">
        <CloseButton onClick={close} />
        {ui.legal === 'gizlilik' && (
          <>
            <h2>Gizlilik</h2>
            <p className="legal__note">Bu metin bir taslaktır. Yayına almadan önce işletme tarafından gözden geçirilmeli ve KVKK kapsamındaki aydınlatma metniyle tamamlanmalıdır.</p>
            <h3>Bu site hangi verileri işler?</h3>
            <p>Sepetiniz ve sipariş formuna yazdığınız bilgiler yalnızca kendi tarayıcınızda saklanır. Bu site bir sunucuya sipariş kaydı göndermez, çerezle izleme yapmaz.</p>
            <h3>Sipariş talebi</h3>
            <p>“Talebi WhatsApp ile Gönder” düğmesine bastığınızda sipariş özetiniz WhatsApp uygulamasına aktarılır. Mesajı siz gönderene kadar bilgileriniz EdoraDesign'a ulaşmaz. Gönderdiğiniz bilgiler yalnızca siparişinizin hazırlanması ve teslimi için kullanılır.</p>
            <h3>Harita</h3>
            <p>İletişim bölümündeki harita, yalnızca “Haritayı göster” düğmesine bastığınızda Google'dan yüklenir.</p>
            <h3>Veri sorumlusu</h3>
            <p><TODO>Veri sorumlusunun unvanı ve iletişim bilgileri işletme tarafından eklenecek</TODO></p>
          </>
        )}
        {ui.legal === 'yasal' && (
          <>
            <h2>Yasal Bilgiler</h2>
            <p className="legal__note">Aşağıdaki alanlar işletme sahibi tarafından doldurulmalıdır. Doğrulanmamış hiçbir bilgi eklenmemiştir.</p>
            <dl>
              <div><dt>İşletme adı</dt><dd>EdoraDesign</dd></div>
              <div><dt>Adres</dt><dd>{BUSINESS.address.line1}, {BUSINESS.address.line2}</dd></div>
              <div><dt>Telefon</dt><dd>{BUSINESS.phoneDisplay}</dd></div>
              <div><dt>Ticari unvan / işletme sahibi</dt><dd><TODO>Eklenecek</TODO></dd></div>
              <div><dt>Vergi dairesi ve numarası</dt><dd><TODO>Eklenecek</TODO></dd></div>
              <div><dt>E-posta</dt><dd><TODO>Eklenecek</TODO></dd></div>
              <div><dt>Teslimat ve iade koşulları</dt><dd><TODO>Eklenecek — kişiye özel ürünlerde iade koşulları ayrıca belirtilmelidir</TODO></dd></div>
              <div><dt>Mesafeli satış bilgilendirmesi</dt><dd><TODO>Çevrim içi ödeme eklendiğinde zorunludur</TODO></dd></div>
            </dl>
          </>
        )}
      </div>
    </Dialog>
  );
}
