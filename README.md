# EdoraDesign — etkileşimli web sitesi

Giresun / Espiye'deki EdoraDesign için hazırlanmış, tamamen Türkçe, kaydırma ile yönetilen ürün hikâyesi ve sipariş talebi akışı içeren web sitesi.

## Çalıştırma

```bash
npm install
npm run dev       # geliştirme sunucusu
npm run build     # dist/ klasörüne üretim çıktısı (önce tip denetimi)
npm run preview   # üretim çıktısını yerelde dener
```

`dist/` klasörü statiktir; Netlify, Vercel, Cloudflare Pages veya GitHub Pages'e doğrudan yüklenebilir (`base: './'` sayesinde alt dizinde de çalışır).

## Teknik yapı

Vite + React + TypeScript. Ek bağımlılıklar yalnızca **Lenis** (masaüstünde yumuşak kaydırma) ve yerel olarak barındırılan yazı tipleridir (Cormorant Garamond, Jost). Uygun bir 3B model bulunmadığı için three.js kullanılmadı; rehberdeki **“kaydırmalı video”** rotası uygulandı.

| Dosya | Görev |
| --- | --- |
| `src/components/ScrollStory.tsx` | Ana kaydırma hikâyesi: cue tablosu, kare oynatıcı (canvas), ekrana sabitlenen etiketler |
| `src/components/GiftLayers.tsx` | Gerçek ürün karesi üzerinde katmanlı renk önizlemesi (çiçek değiştirme + tasarım aracı) |
| `src/components/Configurator.tsx` | “Tasarımını Oluştur” |
| `src/components/Cart.tsx`, `Checkout.tsx` | Sepet ve sipariş talebi formu |
| `src/lib/order.ts` | Form doğrulama, WhatsApp mesajı |
| `src/lib/store.tsx` | Sepet durumu (`localStorage`) |
| `src/data/products.ts` | **Ürünler, seçenekler, fiyatlar** |
| `src/data/business.ts` | **Adres, telefon, bağlantılar, puan, çalışma saatleri** |

### Kaydırma hikâyesi

- Ürün videosu karelere ayrıldı: `public/frames/d` (720×1280, 179 kare, ~8,6 MB) ve telefonlar için `public/frames/m` (480×854, 120 kare, ~3,4 MB). Kareler önce seyrek, sonra aradakiler olacak şekilde yüklenir; `video.currentTime` ile sarma yapılmaz.
- Tek bir cue tablosu (`CUES`) vardır: video zamanı, yakınlık, odak ve yatay kadraj. Kaydırma konumu çizim döngüsünde okunur, kamera üstel yumuşatmayla hareket eder.
- Bölüm ekranda değilken ya da sekme gizliyken çizim durur. Kareler yüklenene kadar durağan bir afiş görünür.
- `prefers-reduced-motion` açıkken ya da canvas desteklenmiyorsa hikâye durağan bir metin + görsel düzenine döner.

Videoyu değiştirmek için kareleri yeniden üretin:

```bash
ffmpeg -i video.mp4 -vf "select='not(mod(n\,2))',scale=720:1280" -vsync 0 -c:v libwebp -quality 74 -start_number 0 public/frames/d/%03d.webp
ffmpeg -i video.mp4 -vf "select='not(mod(n\,3))',scale=480:854"  -vsync 0 -c:v libwebp -quality 70 -start_number 0 public/frames/m/%03d.webp
```

Kare sayısı değişirse `ScrollStory.tsx` içindeki `count` değerlerini ve `T_FULL` / `T_PARTS` zamanlarını güncelleyin.

## Sipariş akışı

Çevrim içi ödeme **yoktur**. Müşteri sepeti doldurur, formu tamamlar ve sipariş özeti hazır bir WhatsApp mesajı olarak açılır (`https://wa.me/905314535510?text=…`). Sunucuya kayıt yapılmadığı için site “siparişiniz alındı” demez; talebin, mesaj gönderildiğinde ulaşacağını açıkça belirtir. Açılır pencere engellenirse hata durumu, doğrudan bağlantı ve “mesajı kopyala” seçeneği gösterilir.

## İşletmenin tamamlaması gerekenler

1. **Fiyatlar** — `products.ts` içinde tüm ürünlerde `price: null` (sitede “Fiyat için bize yazın”). TL cinsinden sayı yazmanız yeterli.
2. **Ürün adları ve açıklamaları** — fotoğraflara bakılarak yazılmış örnek metinlerdir; gözden geçirin.
3. **Fotoğraflar** — hologram çanta dışındaki ürün görselleri Google Haritalar ekran görüntülerinden kırpıldı (alt kısımları arayüz nedeniyle kesik, çözünürlük sınırlı). Özgün fotoğrafları `public/img/` içine aynı adlarla (`ad.webp` ~1100 px, `ad-sm.webp` ~550 px) koymanız kaliteyi belirgin biçimde artırır.
4. **Çalışma saatleri** — doğrulanamadığı için gösterilmiyor. `business.ts` içindeki `hours` alanını doldurun.
5. **Yasal bilgiler ve gizlilik** — alt bilgideki “Yasal Bilgiler” ve “Gizlilik” pencerelerinde sarı işaretli alanlar (ticari unvan, vergi bilgileri, e-posta, iade koşulları, KVKK metni).
6. **Google puanı** — `business.ts` içinde elle güncellenir (şu an 5,0 / 3 değerlendirme).

Renk önizlemeleri (çiçek değiştirme ve tasarım aracı) gerçek ürün karesinin dijital olarak renklendirilmesidir; sitede bu açıkça belirtilir.

## Gelecek: yönetim paneli ve ödeme

Bu sürümde yönetim paneli **yoktur** (çalışmayan sahte bir panel eklenmedi). Yapı buna hazırdır:

- Ürünler ve işletme bilgileri tek kaynaktan (`src/data`) okunur; bu modüller bir API/veritabanı (ör. Supabase, Firebase) çağrısıyla değiştirilebilir.
- Sipariş `buildOrderMessage(items, form)` ile tek noktada toplanır; aynı veri bir arka uca `POST` edilerek sipariş kaydı, durum takibi ve ödeme (iyzico, PayTR vb.) eklenebilir.
- Panel için gerekenler: kimlik doğrulama, ürün/fotoğraf yönetimi, sipariş listesi ve durumları, stok/uygunluk.
