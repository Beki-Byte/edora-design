import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, scrollToId } from '../lib/scroll';

/*
 * ANA KAYDIRMA HİKÂYESİ — "kaydırma çubuğu bir zaman çizelgesidir".
 * Yöntem (rehberdeki 01 numaralı rota — kaydırmalı video):
 *  • Ürün videosu önceden karelere ayrıldı (public/frames). Kareler bir kez yüklenir
 *    ve <canvas>'a çizilir; video.currentTime ile sarma YAPILMAZ.
 *  • Tek bir "cue" tablosu vardır. Her cue eksiksiz bir çekimdir:
 *    video zamanı (t), yakınlık (zoom), odak noktası (fx, fy) ve yatay kadraj (side).
 *  • Kaydırma konumu scroll olayında değil, çizim döngüsünde okunur;
 *    kamera hedefe üstel yumuşatma ile yaklaşır, asla sıçramaz.
 */
type Cue = { at: number; t: number; zoom: number; fx: number; fy: number; side: number };

const T_FULL = 0.872; // çiçekler ve kurdele tamam, ışıltı öncesi
const T_PARTS = 0.784; // kurdele henüz havada: bileşenler anı

const CUES: Cue[] = [
  { at: 0.0, t: T_FULL, zoom: 0.9, fx: 0.5, fy: 0.5, side: 0.17 }, //   01 açılış — geniş plan
  { at: 0.07, t: T_FULL, zoom: 0.96, fx: 0.5, fy: 0.5, side: 0.17 },
  { at: 0.15, t: T_FULL, zoom: 2.25, fx: 0.52, fy: 0.55, side: 0.14 }, // 02 detay — makro
  { at: 0.23, t: T_FULL, zoom: 2.4, fx: 0.44, fy: 0.58, side: 0.14 },
  { at: 0.32, t: 0.0, zoom: 1.0, fx: 0.5, fy: 0.5, side: -0.17 }, //    geri sarım: çanta boşalır
  { at: 0.36, t: 0.0, zoom: 1.0, fx: 0.5, fy: 0.5, side: -0.17 }, //    03 dönüşüm başlar
  { at: 0.6, t: T_PARTS, zoom: 1.06, fx: 0.5, fy: 0.47, side: 0 }, //   04 bileşenler
  { at: 0.72, t: T_PARTS, zoom: 1.12, fx: 0.5, fy: 0.47, side: 0 },
  { at: 0.82, t: T_FULL, zoom: 1.02, fx: 0.5, fy: 0.5, side: 0.17 }, // 05 tamamlanan tasarım
  { at: 0.9, t: T_FULL, zoom: 1.0, fx: 0.5, fy: 0.5, side: 0.17 },
  { at: 1.0, t: 1.0, zoom: 0.94, fx: 0.5, fy: 0.5, side: 0.17 }, //        06 kapanış — başladığı yere döner
];

// Metinlerin göründüğü kaydırma aralıkları
const BEATS = [
  { from: -1, to: 0.095 },
  { from: 0.135, to: 0.245 },
  { from: 0.345, to: 0.575 },
  { from: 0.605, to: 0.735 },
  { from: 0.805, to: 0.905 },
  { from: 0.945, to: 2 },
];

// Bileşen etiketleri: kare üzerindeki konumlar (0–1), kamerayla birlikte her karede yeniden yerleştirilir
const PARTS = [
  { x: 0.46, y: 0.165, label: 'Kurdele', note: 'Dilediğiniz renkte', dir: 1 },
  { x: 0.33, y: 0.385, label: 'Yeşil dallar', note: 'Hacim ve doku', dir: -1 },
  { x: 0.63, y: 0.575, label: 'Güller', note: 'Tasarımın vurgusu', dir: 1 },
  { x: 0.36, y: 0.665, label: 'Çiçekler', note: 'Tek tek yerleştirilir', dir: -1 },
  { x: 0.62, y: 0.845, label: 'Yazılı çanta', note: 'Mesajınız üzerinde', dir: 1 },
];

const STEPS = [
  { label: 'Çanta', until: 0.1 },
  { label: 'Çiçekler', until: 0.34 },
  { label: 'Güller', until: 0.5 },
  { label: 'Yeşil dallar', until: 0.7 },
  { label: 'Kurdele', until: 2 },
];

const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

function blend(p: number): Cue {
  if (p <= CUES[0].at) return CUES[0];
  for (let i = 1; i < CUES.length; i++) {
    const a = CUES[i - 1];
    const b = CUES[i];
    if (p <= b.at) {
      const raw = (p - a.at) / (b.at - a.at);
      const k = smooth(raw);
      // video zamanı doğrusal ilerler (adımlar eşit hızda kurulur), kamera yumuşak eğriyle
      return { at: p, t: lerp(a.t, b.t, raw), zoom: lerp(a.zoom, b.zoom, k), fx: lerp(a.fx, b.fx, k), fy: lerp(a.fy, b.fy, k), side: lerp(a.side, b.side, k) };
    }
  }
  return CUES[CUES.length - 1];
}

const FW = 720;
const FH = 1280;

export function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const partRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement>(null);
  const loadRef = useRef<HTMLDivElement>(null);
  const [staticMode] = useState(() => typeof window !== 'undefined' && prefersReducedMotion());

  useEffect(() => {
    if (staticMode) return;
    const section = sectionRef.current!;
    const canvas = canvasRef.current!;
    const stage = stageRef.current!;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      section.classList.add('story--nocanvas');
      return;
    }

    /* ---- kareler: telefonda daha hafif bir kopya ---- */
    const small = Math.min(window.innerWidth, window.innerHeight) < 700 || ((navigator as any).deviceMemory ?? 8) <= 3;
    const dir = small ? 'm' : 'd';
    const count = small ? 120 : 179;
    const frames: (HTMLImageElement | undefined)[] = new Array(count);
    let loaded = 0;
    let disposed = false;

    // Önce seyrek, sonra aradaki kareler: kaydırma ilk andan itibaren akıcı kalır
    const order: number[] = [];
    const seen = new Set<number>();
    for (const step of [16, 8, 4, 2, 1]) for (let i = 0; i < count; i += step) if (!seen.has(i)) (seen.add(i), order.push(i));
    const last = Math.round(T_FULL * (count - 1));
    order.unshift(last);

    let cursor = 0;
    let dirty = true;
    const pump = () => {
      if (disposed || cursor >= order.length) return;
      const i = order[cursor++];
      if (frames[i]) return pump();
      const img = new Image();
      img.decoding = 'async';
      img.src = `./frames/${dir}/${String(i).padStart(3, '0')}.webp`;
      const done = () => {
        if (disposed) return;
        loaded++;
        dirty = true;
        if (loadRef.current) {
          const pct = Math.round((loaded / count) * 100);
          loadRef.current.style.setProperty('--load', String(loaded / count));
          if (pct >= 100) loadRef.current.classList.add('is-done');
        }
        pump();
      };
      img.onload = () => {
        frames[i] = img;
        if (loaded === 0) section.classList.add('story--ready');
        done();
      };
      img.onerror = done;
    };
    let started = false;
    const startLoading = () => {
      if (started) return;
      started = true;
      for (let k = 0; k < (small ? 4 : 6); k++) pump();
    };

    const nearest = (i: number) => {
      if (frames[i]) return frames[i];
      for (let d = 1; d < count; d++) {
        if (frames[i - d]) return frames[i - d];
        if (frames[i + d]) return frames[i + d];
      }
      return undefined;
    };

    /* ---- tuval boyutu kendi kutusundan (adres çubuğu yüksekliği değiştirir) ---- */
    let cw = 0;
    let ch = 0;
    let dpr = 1;
    const ro = new ResizeObserver(() => {
      const r = stage.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
      cw = Math.round(r.width);
      ch = Math.round(r.height);
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      dirty = true;
    });
    ro.observe(stage);

    /* ---- çizim döngüsü ---- */
    const cam = { ...CUES[0] };
    let first = true;
    let visible = false;
    let raf = 0;
    let prev = 0;
    let lastBeat = -2;
    let lastStep = -1;
    let lastDrawn = '';

    const tick = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min(0.05, (now - prev) / 1000 || 0.016);
      prev = now;

      const rect = section.getBoundingClientRect();
      const span = rect.height - ch;
      const p = span > 0 ? clamp(-rect.top / span) : 0;
      const shot = blend(p);

      const k = first ? 1 : 1 - Math.exp(-7 * dt);
      const kt = first ? 1 : 1 - Math.exp(-12 * dt);
      first = false;
      cam.zoom = lerp(cam.zoom, shot.zoom, k);
      cam.fx = lerp(cam.fx, shot.fx, k);
      cam.fy = lerp(cam.fy, shot.fy, k);
      cam.side = lerp(cam.side, shot.side, k);
      cam.t = lerp(cam.t, shot.t, kt);

      const portrait = cw / ch < 0.8;
      const fit = portrait ? Math.max(ch / FH, cw / FW) : ch / FH;
      // Dikey ekranda kadraj genişliğe göre kurulur: geniş planlar ürünü metnin üstünde tutar,
      // yalnızca makro çekim gerçekten yaklaşır.
      const macro = clamp((cam.zoom - 1.05) / 0.5);
      const zoom = portrait ? lerp(Math.min(cam.zoom, 1), cam.zoom, macro) : cam.zoom;
      const focusY = portrait ? lerp(0.5, cam.fy, macro) : cam.fy;
      const scale = fit * zoom * (portrait ? lerp(0.76, 0.8, macro) : 1);
      const side = portrait ? 0 : cam.side;
      const w = FW * scale;
      const h = FH * scale;
      let dx = cw / 2 + side * cw - cam.fx * w;
      let dy = ch * (portrait ? 0.4 : 0.5) - focusY * h;
      if (h >= ch) dy = clamp(dy, ch - h, 0);

      const idx = Math.round(clamp(cam.t) * (count - 1));
      const img = nearest(idx);
      const sig = `${img?.src}|${dx.toFixed(1)}|${dy.toFixed(1)}|${scale.toFixed(4)}`;
      if (img && (dirty || sig !== lastDrawn)) {
        lastDrawn = sig;
        dirty = false;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, cw, ch);
        ctx.globalCompositeOperation = 'source-over';
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, dx, dy, w, h);
        // Kare kenarlarını sayfa zeminine eritir: tuval şeffaf, zemin sayfanın rengi
        ctx.globalCompositeOperation = 'destination-out';
        const feather = (x0: number, y0: number, x1: number, y1: number, rx: number, ry: number, rw: number, rh: number) => {
          const g = ctx.createLinearGradient(x0, y0, x1, y1);
          g.addColorStop(0, 'rgba(0,0,0,1)');
          g.addColorStop(0.35, 'rgba(0,0,0,.72)');
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.fillRect(rx, ry, rw, rh);
        };
        const fx = w * 0.2;
        const fy = h * 0.14;
        if (dx > -fx) feather(dx, 0, dx + fx, 0, dx - 1, 0, fx + 1, ch);
        if (dx + w < cw + fx) feather(dx + w, 0, dx + w - fx, 0, dx + w - fx, 0, fx + 1, ch);
        if (dy > -fy) feather(0, dy, 0, dy + fy, 0, dy - 1, cw, fy + 1);
        if (dy + h < ch + fy) feather(0, dy + h, 0, dy + h - fy, 0, dy + h - fy, cw, fy + 1);
        ctx.globalCompositeOperation = 'source-over';
      }

      /* metinler */
      let active = -1;
      for (let i = 0; i < BEATS.length; i++) {
        const b = BEATS[i];
        const el = beatRefs.current[i];
        if (!el) continue;
        const edge = 0.022;
        const a = clamp(Math.min((p - b.from) / edge, (b.to - p) / edge));
        el.style.opacity = a.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - a) * (p < (b.from + b.to) / 2 ? 28 : -28)).toFixed(1)}px, 0)`;
        el.style.visibility = a > 0.01 ? 'visible' : 'hidden';
        if (a > 0.5) active = i;
      }
      if (active !== lastBeat) {
        lastBeat = active;
        railRef.current?.querySelectorAll('i').forEach((n, i) => n.classList.toggle('on', i === active));
      }

      /* bileşen etiketleri — kameradan sonra ekrana izdüşürülür */
      const partsA = clamp(Math.min((p - 0.6) / 0.03, (0.735 - p) / 0.02)) * clamp(1 - Math.abs(cam.t - T_PARTS) * 30);
      for (let i = 0; i < PARTS.length; i++) {
        const el = partRefs.current[i];
        if (!el) continue;
        const a = clamp(partsA * 1.6 - i * 0.12);
        el.style.opacity = a.toFixed(3);
        el.style.visibility = a > 0.01 ? 'visible' : 'hidden';
        el.style.transform = `translate3d(${(dx + PARTS[i].x * w).toFixed(1)}px, ${(dy + PARTS[i].y * h).toFixed(1)}px, 0)`;
      }

      /* kurulum adımları */
      const st = cam.t / T_PARTS;
      const stepIdx = STEPS.findIndex((s) => st < s.until);
      if (stepIdx !== lastStep) {
        lastStep = stepIdx;
        stepRefs.current.forEach((n, i) => n && (n.classList.toggle('on', i === stepIdx), n.classList.toggle('done', i < stepIdx)));
      }
      railRef.current?.style.setProperty('--p', p.toFixed(4));

      raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!raf && visible && !document.hidden) {
        prev = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    // Bölüm ekranda değilken çizim tamamen durur
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) (startLoading(), kick());
      },
      { rootMargin: '10% 0px' },
    );
    io.observe(section);
    const near = new IntersectionObserver(([e]) => e.isIntersecting && startLoading(), { rootMargin: '150% 0px' });
    near.observe(section);
    const idle = window.setTimeout(startLoading, 2500);
    document.addEventListener('visibilitychange', kick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      io.disconnect();
      near.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', kick);
    };
  }, [staticMode]);

  const setBeat = (i: number) => (el: HTMLDivElement | null) => {
    beatRefs.current[i] = el;
  };

  return (
    <section ref={sectionRef} className={`story ${staticMode ? 'story--static' : ''}`} id="hikaye" aria-label="Bir tasarımın hikâyesi">
      <div className="story__stage" ref={stageRef}>
        <img className="story__poster" src="./frames/poster.webp" alt="Mavi güller ve krem çiçeklerle hazırlanmış hologram hediye çantası" />
        <canvas ref={canvasRef} className="story__canvas" aria-hidden="true" />

        <div className="story__parts" aria-hidden="true">
          {PARTS.map((part, i) => (
            <div key={part.label} className={`part ${part.dir < 0 ? 'part--left' : ''}`} ref={(el) => { partRefs.current[i] = el; }}>
              <span className="part__dot" />
              <span className="part__line" />
              <span className="part__text">
                <b>{part.label}</b>
                <em>{part.note}</em>
              </span>
            </div>
          ))}
        </div>

        <div className="story__beats">
          <div className="beat beat--left" ref={setBeat(0)}>
            <p className="eyebrow">01 — Açılış</p>
            <h2>Bir hediye değil, <em>unutulmaz bir an.</em></h2>
            <p className="beat__sub">Kaydırdıkça bir tasarımın nasıl ortaya çıktığını siz yönetin.</p>
          </div>
          <div className="beat beat--left beat--plate" ref={setBeat(1)}>
            <p className="eyebrow">02 — Detay</p>
            <h2>Her detay <em>özenle</em> tasarlandı.</h2>
            <p className="beat__sub">Çiçeklerin dokusu, renklerin dengesi, yaprakların yönü.</p>
          </div>
          <div className="beat beat--right" ref={setBeat(2)}>
            <p className="eyebrow">03 — Dönüşüm</p>
            <h2>Boş bir çantadan, <em>adım adım.</em></h2>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li key={s.label} ref={(el) => { stepRefs.current[i] = el; }}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {s.label}
                </li>
              ))}
            </ol>
          </div>
          <div className="beat beat--top" ref={setBeat(3)}>
            <p className="eyebrow">04 — Bileşenler</p>
            <h2>Her parça <em>bütünün</em> bir notası.</h2>
          </div>
          <div className="beat beat--left" ref={setBeat(4)}>
            <p className="eyebrow">05 — Tamamlanan tasarım</p>
            <h2>Sevdiklerinize özel, <em>tamamen size ait.</em></h2>
            <p className="beat__sub">Renkler, yazı ve kurdele; hepsi sizin seçiminiz.</p>
          </div>
          <div className="beat beat--end" ref={setBeat(5)}>
            <p className="eyebrow">06 — Sıra sizde</p>
            <h2>Hayalinizdeki hediyeyi <em>tasarlayın.</em></h2>
            <button type="button" className="btn btn--dark" onClick={() => scrollToId('koleksiyon')} data-cursor="Keşfet">
              Tasarımları Keşfet
            </button>
          </div>
        </div>

        <div className="story__rail" ref={railRef} aria-hidden="true">
          {BEATS.map((_, i) => (
            <i key={i}>{String(i + 1).padStart(2, '0')}</i>
          ))}
        </div>
        <div className="story__load" ref={loadRef} aria-hidden="true" />
      </div>
    </section>
  );
}
