export const weddingConfig = {
  // 0. Metadata SEO & Social Media
  metadata: {
    url: 'https://invitation-v2-blue.vercel.app',
    ogImage: '/assets/bg.jpg', // Ganti dengan URL foto cover tenant
    musicUrl: 'https://assets.satumomen.com/musics/y2metaapp-java-instrument-128-kbps.mp3', // Ganti dengan URL lagu tenant
  },
  
  // 1. Info Pasangan
  groom: {
    nickname: 'Ilham',
    initial: 'i',
    fullName: 'Ilham Gokil',
    parents: 'Putra dari\nBapak H. alok \n& Ibu wahyuni ',
  },
  bride: {
    nickname: 'Viola',
    initial: 'v',
    fullName: ' Viola Angeline',
    parents: 'Putri dari\nBapak Mugni Labib\n& Ibu Kodriyah',
  },

  // 2. Acara Akad Nikah
  akad: {
    dayName: 'Ahad',
    dateStr: '20',
    monthStr: 'April',
    yearStr: '2027',
    time: 'Pukul 09.00 WIB',
    locationName: 'Rumah Mempelai Wanita',
    address: 'Cranggang, RT. 27 / RW. 00, Gemantar, Mondokan, Sragen',
  },

  // 3. Acara Ngunduh Mantu (Resepsi)
  resepsi: {
    title: 'Ngunduh Mantu',
    dayName: 'Senin',
    dateStr: '12',
    monthStr: 'Mei',
    yearStr: '2027',
    fullDate: 'Senin, 12 Mei 2025',
    time: 'Pukul 09.00 WIB ~ Selesai',
    locationName: 'Gedung Graha Setyowati',
    address: 'Jl. Mangesti Raya, Gentan, Kec. Baki, Kab. Sukoharjo, Jawa Tengah',
    mapLink: 'https://maps.app.goo.gl/jJtFJwg39cadS74k7',
  },

  // 4. Fitur Hitung Mundur (Countdown)
  countdownTarget: '2027-05-12T09:00:00', // Format: YYYY-MM-DDTHH:mm:ss

  // 5. Rekening Hadiah / Amplop Digital
  cashlessAccounts: [
    {
      bank: 'BNI',
      number: '1415003163',
      name: 'Ilham',
      logo: '/assets/bni-logo.png',
    },
    {
      bank: 'BCA',
      number: '015-467-7433',
      name: 'Ilham',
      logo: '/assets/bca-logo.png',
    },
  ],

  // 6. Alamat Kirim Kado (Fisik)
  giftAddress: "BIMASAKTI",

  // 7. Kontak Person
  contacts: [
    {
      name: 'ilham',
      phone: '0857-0225-5215',
      waLink: 'https://wa.me/6285702255215',
      photo: '/assets/imam.jpg',
    },
    {
      name: 'viola',
      phone: '0812-1580-4693',
      waLink: 'https://wa.me/6281215804693',
      photo: '/assets/hitna.jpg',
    },
  ]
};
