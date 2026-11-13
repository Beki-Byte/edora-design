import { useEffect, useRef, useState } from 'react';
import { BAG_LOOKS, POM_LOOKS, RIBBON_LOOKS, ROSE_LOOKS } from '../data/products';

export type GiftLook = { rose: string; pom: string; ribbon: string; bag: string };

const f = (list: { id: string; filter: string }[], id: string) => list.find((l) => l.id === id)?.filter ?? 'none';
const src = (n: string) => `./layers/${n}.webp`;

function Layers({ look, state }: { look: GiftLook; state: 'in' | 'out' | 'still' }) {
  return (
    <div className={`gift__set gift__set--${state}`} aria-hidden="true">
      <img className="gift__layer gift__layer--bag" src={src('bag')} alt="" style={{ filter: f(BAG_LOOKS, look.bag) }} draggable={false} />
      <img className="gift__layer gift__layer--poms" src={src('poms')} alt="" style={{ filter: f(POM_LOOKS, look.pom) }} draggable={false} />
      <img className="gift__layer gift__layer--roses" src={src('roses')} alt="" style={{ filter: f(ROSE_LOOKS, look.rose) }} draggable={false} />
      <img className="gift__layer gift__layer--ribbon" src={src('ribbon')} alt="" style={{ filter: f(RIBBON_LOOKS, look.ribbon) }} draggable={false} />
    </div>
  );
}

/*
 * Gerçek ürün fotoğrafı (video karesi) üzerinde çalışan katmanlı önizleme.
 * Çanta sabit kalır; güller, çiçekler ve kurdele ayrı katmanlar olarak renklendirilir.
 * Seçim değişince eski çiçekler yukarı kalkıp dağılır, yenileri yerine oturur.
 */
export function GiftLayers({ look, alt, loading = 'lazy' }: { look: GiftLook; alt: string; loading?: 'lazy' | 'eager' }) {
  const [current, setCurrent] = useState(look);
  const [leaving, setLeaving] = useState<GiftLook | null>(null);
  const [gen, setGen] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (JSON.stringify(look) === JSON.stringify(current)) return;
    setLeaving(current);
    setCurrent(look);
    setGen((g) => g + 1);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setLeaving(null), 1100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [look]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div className="gift" role="img" aria-label={alt}>
      <img className="gift__base" src={src('base')} alt="" loading={loading} draggable={false} />
      <Layers key={`in-${gen}`} look={current} state={gen === 0 ? 'still' : 'in'} />
      {leaving && <Layers key={`out-${gen}`} look={leaving} state="out" />}
    </div>
  );
}
