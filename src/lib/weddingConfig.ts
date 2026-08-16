export const weddingConfig = {
  // 0. Metadata SEO & Social Media
  metadata: {
    url: 'https://invitation-v2-blue.vercel.app',
    ogImage: '/assets/bg.jpg', // Ganti dengan URL foto cover tenant
    musicUrl: 'https://assets.satumomen.com/musics/y2metaapp-java-instrument-128-kbps.mp3', // Ganti dengan URL lagu tenant
  },
  
  // 1. Info Pasangan
  groom: {
    nickname: 'Dimas',
    initial: 'D',
    fullName: 'Dimas Prasetyo, S.Kom.',
    parents: 'Putra dari\nBapak Bambang Santoso\n& Ibu Sri Rahayu',
  },
  bride: {
    nickname: 'Annisa',
    initial: 'A',
    fullName: 'Annisa Larasati, S.E.',
    parents: 'Putri dari\nBapak Hendra Wijaya\n& Ibu Ratna Dewi',
  },

  // 2. Acara Akad Nikah
  akad: {
    dayName: 'Sabtu',
    dateStr: '24',
    monthStr: 'Oktober',
    yearStr: '2026',
    time: 'Pukul 08.00 WIB',
    locationName: 'Masjid Agung Al-Falah',
    address: 'Jl. Pahlawan No. 123, Sukoharjo, Jawa Tengah',
  },

  // 3. Acara Ngunduh Mantu (Resepsi)
  resepsi: {
    title: 'Resepsi Pernikahan',
    dayName: 'Minggu',
    dateStr: '25',
    monthStr: 'Oktober',
    yearStr: '2026',
    fullDate: 'Minggu, 25 Oktober 2026',
    time: 'Pukul 11.00 WIB ~ Selesai',
    locationName: 'Gedung Graha Nusantara',
    address: 'Jl. Letjen Suprapto No. 80, Solo, Jawa Tengah',
    mapLink: 'https://maps.google.com',
  },

  // 4. Fitur Hitung Mundur (Countdown)
  countdownTarget: '2026-10-25T11:00:00', // Format: YYYY-MM-DDTHH:mm:ss

  // 5. Rekening Hadiah / Amplop Digital
  cashlessAccounts: [
    {
      bank: 'BCA',
      number: '123-456-7890',
      name: 'Dimas Prasetyo',
      logo: '/assets/bca-logo.png',
    },
    {
      bank: 'BNI',
      number: '098-765-4321',
      name: 'Annisa Larasati',
      logo: '/assets/bni-logo.png',
    },
  ],

  // 6. Alamat Kirim Kado (Fisik)
  giftAddress: "Jl. Letjen Suprapto No. 80, Kel. Sumber, Kec. Banjarsari, Kota Surakarta, Jawa Tengah 57138",

  // 7. Kontak Person
  contacts: [
    {
      name: 'Dimas',
      phone: '0812-3456-7890',
      waLink: 'https://wa.me/6281234567890',
      photo: '/assets/imam.jpg',
    },
    {
      name: 'Annisa',
      phone: '0812-9876-5432',
      waLink: 'https://wa.me/6281298765432',
      photo: '/assets/hitna.jpg',
    },
  ]
};

