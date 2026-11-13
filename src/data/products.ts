/*
 * ÜRÜN VERİLERİ — DÜZENLENEBİLİR ÖRNEK İÇERİK
 * ------------------------------------------------------------------
 * Fotoğraflar EdoraDesign'ın gerçek ürünleridir. Ürün adları, açıklamalar ve
 * seçenekler fotoğraflara bakılarak yazılmış ÖRNEK metinlerdir; işletme
 * tarafından gözden geçirilmelidir.
 *
 * price: null → sitede "Fiyat için bize yazın" gösterilir.
 * Fiyat eklemek için TL cinsinden sayı yazın (ör. price: 750).
 */
export type OptionDef = { key: string; label: string; choices: string[] };

export type CategoryId = 'cicek' | 'balon' | 'pelus' | 'kutu';

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'cicek', label: 'Kişiye Özel Çiçek Tasarımları' },
  { id: 'balon', label: 'Balon Tasarımları' },
  { id: 'pelus', label: 'Peluş Hediyelikler' },
  { id: 'kutu', label: 'Sürpriz Kutular' },
];

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  image: string; // public/img içindeki dosya adı (uzantısız)
  ratio: string; // görselin en-boy oranı
  focus?: string; // object-position
  alt: string;
  tagline: string;
  description: string;
  price: number | null;
  options: OptionDef[];
  personalization: { label: string; placeholder: string; max: number };
};

const COLOR_NOTE = 'Renk tercihi';

export const PRODUCTS: Product[] = [
  {
    id: 'hologram-canta',
    name: 'Hologram Çanta Aranjmanı',
    category: 'cicek',
    image: 'hologram',
    ratio: '973 / 1031',
    alt: 'Mavi güller ve krem çiçeklerle hazırlanmış, mavi kurdeleli hologram hediye çantası',
    tagline: 'Işıkla renk değiştiren çantada mavi ve krem',
    description:
      'Hologram desenli hediye çantasında mavi güller ve krem tonlu çiçeklerden oluşan yapay çiçek aranjmanı. Çantanın üzerine dilediğiniz yazı işlenebilir; sapı kurdele ile tamamlanır.',
    price: null,
    options: [
      { key: 'renk', label: COLOR_NOTE, choices: ['Mavi & Krem (görseldeki)', 'Pembe', 'Beyaz', 'Krem', 'Karışık'] },
      { key: 'kurdele', label: 'Kurdele', choices: ['Mavi', 'Pudra', 'Kırmızı', 'Şampanya', 'Beyaz'] },
    ],
    personalization: { label: 'Çanta üzerindeki yazı', placeholder: 'Örn. Emek Veren Güzel Kalbe', max: 40 },
  },
  {
    id: 'just-for-you',
    name: 'Just For You Çanta',
    category: 'cicek',
    image: 'just-for-you',
    ratio: '1158 / 1311',
    focus: '40% 60%',
    alt: 'Pembe, bordo ve krem çiçeklerle dolu, kemer saplı pembe hediye çantası',
    tagline: 'Kemer saplı pudra çantada sıcak tonlar',
    description:
      'Kemer saplı pudra pembe çantada pembe, bordo ve krem tonlarında yapay çiçeklerden hazırlanan dolgun bir aranjman.',
    price: null,
    options: [
      { key: 'renk', label: COLOR_NOTE, choices: ['Pembe & Bordo (görseldeki)', 'Beyaz', 'Mavi', 'Krem', 'Karışık'] },
    ],
    personalization: { label: 'Hediye notu', placeholder: 'Kartın üzerine yazılacak kısa not', max: 80 },
  },
  {
    id: 'peri-cantasi',
    name: 'Peri Masalı Çantası',
    category: 'cicek',
    image: 'peri',
    ratio: '1158 / 1311',
    focus: '50% 70%',
    alt: 'Üzerinde isim yazılı, keçe peri bebek ve kelebeklerle süslenmiş pembe çiçek çantası',
    tagline: 'İsme özel, perili ve kelebekli',
    description:
      'Pembe çantada çiçekler, kelebek süsler ve keçe peri bebek. Çantanın üzerine isim yazılır; özellikle çocuklar için hazırlanan kişiye özel bir tasarım.',
    price: null,
    options: [
      { key: 'renk', label: 'Çanta rengi', choices: ['Pembe (görseldeki)', 'Farklı bir renk — notta belirtin'] },
    ],
    personalization: { label: 'Çantaya yazılacak isim', placeholder: 'Örn. İkra Kumsal', max: 30 },
  },
  {
    id: 'seni-seviyorum-balon',
    name: 'Seni Seviyorum Balonu',
    category: 'balon',
    image: 'balon',
    ratio: '1158 / 1311',
    focus: '50% 80%',
    alt: 'Turuncu kutuda orkide ve çiçekler, üzerinde “Seni Seviyorum” yazılı şeffaf balon',
    tagline: 'Şeffaf balon, orkide ve kutu bir arada',
    description:
      'İçinde renkli balonlar bulunan yazılı şeffaf balon, orkide dalı ve silindir kutuda çiçek aranjmanı. Balonun üzerindeki yazı kişiye özel hazırlanır.',
    price: null,
    options: [
      { key: 'renk', label: 'Renk teması', choices: ['Turuncu & Altın (görseldeki)', 'Pembe', 'Mor', 'Kırmızı', 'Mavi'] },
    ],
    personalization: { label: 'Balon yazısı', placeholder: 'Örn. Seni Seviyorum', max: 30 },
  },
  {
    id: 'ayicikli-sepet',
    name: 'Ayıcıklı Bebek Sepeti',
    category: 'pelus',
    image: 'ayicik',
    ratio: '1158 / 1311',
    focus: '65% 80%',
    alt: 'Beyaz bebek arabası biçimli kutuda mavi peluş ayıcık ve mavi, krem çiçekler',
    tagline: 'Hoş geldin bebek hediyesi',
    description:
      'Bebek arabası biçimli kutuda peluş ayıcık ve mavi, krem, gri tonlarında yapay çiçekler. Yeni doğan ziyaretleri ve bebek kutlamaları için.',
    price: null,
    options: [
      { key: 'renk', label: 'Renk teması', choices: ['Mavi (görseldeki)', 'Pembe', 'Krem'] },
    ],
    personalization: { label: 'Bebeğin adı / not', placeholder: 'Örn. Hoş geldin Aras', max: 40 },
  },
  {
    id: 'flower-coffee',
    name: 'Flower & Coffee',
    category: 'kutu',
    image: 'coffee',
    ratio: '1158 / 1311',
    focus: '45% 70%',
    alt: 'Lila ve krem çiçeklerle kahve bardağını bir arada taşıyan beyaz “Flower & Coffee” kutusu',
    tagline: 'Çiçek ve kahve, tek kutuda',
    description:
      'Bir yanında çiçekler, diğer yanında kahve bardağı bölmesi bulunan saplı sürpriz kutu. Küçük ama akılda kalan bir jest.',
    price: null,
    options: [
      { key: 'renk', label: COLOR_NOTE, choices: ['Lila & Krem (görseldeki)', 'Pembe', 'Beyaz', 'Mavi', 'Karışık'] },
    ],
    personalization: { label: 'Hediye notu', placeholder: 'Kutuyla birlikte iletilecek kısa not', max: 80 },
  },
];

export const formatPrice = (p: number | null) =>
  p == null ? 'Fiyat için bize yazın' : new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(p);

/* ---------- "Tasarımını Oluştur" seçenekleri ---------- */
export type Look = { id: string; label: string; swatch: string; filter: string };

// CSS filtreleri gerçek ürün fotoğrafındaki ilgili katmana uygulanır (dijital önizleme).
export const ROSE_LOOKS: Look[] = [
  { id: 'mavi', label: 'Mavi', swatch: '#2f55a4', filter: 'none' },
  { id: 'pembe', label: 'Pembe', swatch: '#d98aa0', filter: 'hue-rotate(118deg) saturate(.85) brightness(1.5)' },
  { id: 'kirmizi', label: 'Kırmızı', swatch: '#a3262f', filter: 'hue-rotate(140deg) saturate(1.15) brightness(1.02)' },
  { id: 'mor', label: 'Mor', swatch: '#6c4a9c', filter: 'hue-rotate(48deg) saturate(.8) brightness(1.1)' },
  { id: 'beyaz', label: 'Beyaz', swatch: '#f1ece4', filter: 'saturate(.05) brightness(3) contrast(.62)' },
  { id: 'krem', label: 'Krem', swatch: '#ead2b0', filter: 'hue-rotate(172deg) saturate(.5) brightness(2.7) contrast(.68)' },
];
export const POM_LOOKS: Look[] = [
  { id: 'krem', label: 'Krem', swatch: '#f0d2ae', filter: 'none' },
  { id: 'pudra', label: 'Pudra', swatch: '#eebcc0', filter: 'hue-rotate(-34deg) saturate(1.2)' },
  { id: 'beyaz', label: 'Beyaz', swatch: '#f4efe8', filter: 'saturate(.22) brightness(1.07)' },
  { id: 'lila', label: 'Lila', swatch: '#cbb6e0', filter: 'hue-rotate(-118deg) saturate(.75) brightness(1.02)' },
  { id: 'mavi', label: 'Buz Mavisi', swatch: '#b9cfe6', filter: 'hue-rotate(178deg) saturate(.7) brightness(1.02)' },
];
export const RIBBON_LOOKS: Look[] = [
  { id: 'mavi', label: 'Mavi', swatch: '#3557a8', filter: 'none' },
  { id: 'pudra', label: 'Pudra', swatch: '#e2a3b0', filter: 'hue-rotate(118deg) saturate(.9) brightness(1.75)' },
  { id: 'kirmizi', label: 'Kırmızı', swatch: '#a3262f', filter: 'hue-rotate(140deg) saturate(1.2) brightness(1)' },
  { id: 'sampanya', label: 'Şampanya', swatch: '#c9ad7c', filter: 'hue-rotate(178deg) saturate(.55) brightness(2.1) contrast(.8)' },
  { id: 'beyaz', label: 'Beyaz', swatch: '#f4efe8', filter: 'saturate(.05) brightness(2.9) contrast(.62)' },
];
export const BAG_LOOKS: Look[] = [
  { id: 'gumus', label: 'Hologram Gümüş', swatch: 'linear-gradient(135deg,#cfd9ee,#e8dff0 50%,#cfe9e6)', filter: 'none' },
  { id: 'pudra', label: 'Hologram Pudra', swatch: 'linear-gradient(135deg,#f0cfd6,#f3e0dc 50%,#e6cfe6)', filter: 'sepia(.5) hue-rotate(-38deg) saturate(1.6) brightness(1.03)' },
  { id: 'sampanya', label: 'Hologram Şampanya', swatch: 'linear-gradient(135deg,#e8d6b4,#f1e6d0 50%,#e0d2b0)', filter: 'sepia(.62) saturate(1.15) brightness(1.02)' },
];
export const EXTRAS = ['Kelebek süsler', 'Peluş ayıcık', 'Şeffaf balon', 'Işık süsleme'];

/* Çiçek Değiştir bölümündeki hazır kombinasyonlar */
export type Palette = { id: string; label: string; note: string; rose: string; pom: string; ribbon: string; accent: string };
export const PALETTES: Palette[] = [
  { id: 'mavi', label: 'Mavi', note: 'Mavi güller, krem çiçekler — fotoğraftaki özgün tasarım.', rose: 'mavi', pom: 'krem', ribbon: 'mavi', accent: '#3557a8' },
  { id: 'pembe', label: 'Pembe', note: 'Pembe güller ve pudra çiçeklerle yumuşak bir ton.', rose: 'pembe', pom: 'pudra', ribbon: 'pudra', accent: '#d98aa0' },
  { id: 'beyaz', label: 'Beyaz', note: 'Beyazın sade zarafeti; söz, nişan ve özel günler için.', rose: 'beyaz', pom: 'beyaz', ribbon: 'beyaz', accent: '#cfc6b8' },
  { id: 'krem', label: 'Krem', note: 'Krem ve şampanya; sıcak, dingin bir bütünlük.', rose: 'krem', pom: 'krem', ribbon: 'sampanya', accent: '#c9ad7c' },
  { id: 'karisik', label: 'Karışık', note: 'Kırmızı güller, lila çiçekler; canlı ve neşeli.', rose: 'kirmizi', pom: 'lila', ribbon: 'kirmizi', accent: '#a3262f' },
];

export const CUSTOM_PRODUCT_ID = 'ozel-tasarim';
export const CUSTOM_OPTION_DEFS: OptionDef[] = [
  { key: 'ambalaj', label: 'Ambalaj', choices: BAG_LOOKS.map((l) => l.label) },
  { key: 'cicek', label: 'Çiçek rengi', choices: POM_LOOKS.map((l) => l.label) },
  { key: 'gul', label: 'Gül rengi', choices: ROSE_LOOKS.map((l) => l.label) },
  { key: 'kurdele', label: 'Kurdele', choices: RIBBON_LOOKS.map((l) => l.label) },
];
