import { BUSINESS } from '../data/business';
import { CUSTOM_OPTION_DEFS, CUSTOM_PRODUCT_ID, PRODUCTS, formatPrice, type OptionDef } from '../data/products';
import type { CartItem } from './store';

export type OrderForm = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  date: string;
  message: string;
  notes: string;
};

export const EMPTY_FORM: OrderForm = { name: '', phone: '', email: '', address: '', city: '', zip: '', date: '', message: '', notes: '' };

export function optionDefsFor(productId: string): OptionDef[] {
  if (productId === CUSTOM_PRODUCT_ID) return CUSTOM_OPTION_DEFS;
  return PRODUCTS.find((p) => p.id === productId)?.options ?? [];
}

export function validate(f: OrderForm): Partial<Record<keyof OrderForm, string>> {
  const e: Partial<Record<keyof OrderForm, string>> = {};
  if (f.name.trim().length < 3) e.name = 'Lütfen adınızı ve soyadınızı yazın.';
  const digits = f.phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) e.phone = 'Geçerli bir telefon numarası yazın (ör. 05xx xxx xx xx).';
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'E-posta adresi geçerli görünmüyor.';
  if (f.address.trim().length < 8) e.address = 'Lütfen teslimat adresini eksiksiz yazın.';
  if (f.city.trim().length < 2) e.city = 'Lütfen şehri yazın.';
  if (f.zip.trim() && !/^\d{5}$/.test(f.zip.trim())) e.zip = 'Posta kodu 5 haneli olmalıdır.';
  if (f.date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(f.date + 'T00:00:00') < today) e.date = 'Teslim tarihi geçmiş bir gün olamaz.';
  }
  return e;
}

const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
};

/** WhatsApp'a gönderilecek, okunaklı sipariş özeti. */
export function buildOrderMessage(items: CartItem[], f: OrderForm): string {
  const L: string[] = [];
  L.push('Merhaba EdoraDesign, web sitenizden sipariş talebi oluşturdum.', '');
  L.push('*SİPARİŞ ÖZETİ*');
  items.forEach((it, i) => {
    L.push(`${i + 1}) ${it.name} — ${it.qty} adet${it.price != null ? ` (${formatPrice(it.price)})` : ''}`);
    const defs = optionDefsFor(it.productId);
    for (const d of defs) if (it.options[d.key]) L.push(`   • ${d.label}: ${it.options[d.key]}`);
    if (it.extras?.length) L.push(`   • Süslemeler: ${it.extras.join(', ')}`);
    if (it.text.trim()) L.push(`   • ${it.textLabel}: “${it.text.trim()}”`);
  });
  L.push('', '*TESLİMAT BİLGİLERİ*');
  L.push(`Ad Soyad: ${f.name.trim()}`);
  L.push(`Telefon: ${f.phone.trim()}`);
  if (f.email.trim()) L.push(`E-posta: ${f.email.trim()}`);
  L.push(`Adres: ${f.address.trim()}`);
  L.push(`Şehir: ${f.city.trim()}${f.zip.trim() ? ` (${f.zip.trim()})` : ''}`);
  if (f.date) L.push(`İstenen teslim tarihi: ${fmtDate(f.date)}`);
  if (f.message.trim()) L.push('', `*Kişisel mesaj:* ${f.message.trim()}`);
  if (f.notes.trim()) L.push('', `*Sipariş notu:* ${f.notes.trim()}`);
  L.push('', 'Fiyat ve teslimat bilgisi için dönüşünüzü bekliyorum. Teşekkürler.');
  return L.join('\n');
}

export const whatsappUrl = (text?: string) =>
  `https://wa.me/${BUSINESS.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
