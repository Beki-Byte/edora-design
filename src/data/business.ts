// İşletme bilgileri — tek kaynaktan yönetilir. Değişiklikler yalnızca burada yapılmalıdır.
export const BUSINESS = {
  name: 'EdoraDesign',
  tagline: 'Kişiye Özel Çiçek & Balon Tasarım',
  bio: ['Giresun', 'Tüm İllere Kargo', 'Kişiye Özel Çiçek & Balon Tasarım', 'Peluş Hediyelikler', 'Sürpriz Kutular'],
  address: {
    line1: 'Adabük, Şakir Bahadır Caddesi No: 41',
    line2: '28600 Espiye / Giresun, Türkiye',
  },
  phoneDisplay: '+90 531 453 55 10',
  phoneHref: 'tel:+905314535510',
  whatsappNumber: '905314535510',
  links: {
    maps: 'https://www.google.com/maps/place/EdoraDesign/@40.9498842,38.719405,17z/',
    mapsEmbed: 'https://www.google.com/maps?q=40.9498842,38.719405&z=17&hl=tr&output=embed',
    instagram: 'https://www.instagram.com/edora.design/',
    facebook: 'https://www.facebook.com/p/Edoradesign-61586626891098/',
    yandex: 'https://yandex.com.tr/maps/org/edoradesign/131282082747/reviews/',
  },
  // Bilginin sağlandığı tarihteki Google puanı. Güncellendikçe elle düzenleyin.
  rating: { value: '5,0', count: 3 },
  // Çalışma saatleri doğrulanamadığı için bilinçli olarak eklenmedi.
  // Doğrulandığında: hours: [{ days: 'Pazartesi – Cumartesi', time: '09.00 – 19.00' }]
  hours: null as null | { days: string; time: string }[],
} as const;
