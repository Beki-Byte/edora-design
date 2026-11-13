import { scrollToId } from '../lib/scroll';

export function Hero() {
  return (
    <section className="hero" id="ana-sayfa" aria-label="EdoraDesign">
      <p className="hero__side" aria-hidden="true">Giresun — Tüm illere kargo</p>

      <div className="hero__copy">
        <p className="eyebrow hero__eyebrow">Kişiye özel çiçek &amp; balon tasarım</p>
        <h1 className="hero__title">
          <span className="line"><span>Her detayında</span></span>
          <span className="line"><span>bir <em>hikâye,</em></span></span>
          <span className="line"><span>her tasarımında</span></span>
          <span className="line"><span>bir <em>mutluluk.</em></span></span>
        </h1>
        <p className="hero__lead">
          EdoraDesign; sevdiklerinize söylemek istediklerinizi çiçeklere, balonlara ve sürpriz kutulara dönüştürür. Her tasarım, kime gideceği düşünülerek tek tek hazırlanır.
        </p>
        <div className="hero__cta">
          <button type="button" className="btn btn--dark" onClick={() => scrollToId('koleksiyon')} data-cursor="Keşfet">
            Koleksiyonu Keşfet
          </button>
          <button type="button" className="link-arrow" onClick={() => scrollToId('tasarla')}>
            Kendi tasarımını oluştur
          </button>
        </div>
      </div>

      <div className="hero__visual">
        <figure className="hero__arch" data-parallax="-0.06">
          <img src="./img/hologram.webp" alt="Mavi güller ve krem çiçeklerle hazırlanmış, mavi kurdeleli hologram hediye çantası" width="973" height="1031" fetchPriority="high" />
        </figure>
        <figure className="hero__inset" data-parallax="0.12">
          <img src="./img/just-for-you-sm.webp" alt="Pembe ve bordo çiçeklerle dolu kemer saplı pembe hediye çantası" width="550" height="623" />
        </figure>
        <p className="hero__caption" data-parallax="0.05">
          <span>N° 01</span> Hologram Çanta Aranjmanı
        </p>
      </div>

      <button type="button" className="hero__scroll" onClick={() => scrollToId('hikaye')} aria-label="Hikâyeye kaydır">
        <span>Kaydırın</span>
        <i aria-hidden="true" />
      </button>
    </section>
  );
}
