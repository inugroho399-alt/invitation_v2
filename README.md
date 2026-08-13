# Panduan Penggunaan & Deploy Undangan Digital (Imam & Hitna)

Selamat! Migrasi undangan digital **Imam & Hitna** ke **Next.js 14, Tailwind CSS, dan Supabase** telah selesai dibuat dengan struktur modular, modern, dan performa yang optimal.

Undangan ini didesain menggunakan skema warna klasik Javanese (Dark Maroon & Champagne Gold) dengan animasi transisi yang sangat halus menggunakan **Framer Motion**, serta interaksi ucapan (guest book) yang responsif dengan efek konfeti emas saat sukses mengirim RSVP.

---

## 📁 Struktur Folder Project

Berikut adalah struktur folder utama dari project undangan ini:

```text
undangan-v2/
├── public/
│   └── assets/              # File gambar latar belakang, frame, & foto couple
├── src/
│   ├── app/
│   │   ├── globals.css      # Custom font imports & core style tokens
│   │   ├── layout.tsx       # Root layout, metadata SEO, & Open Graph
│   │   └── page.tsx         # Page loader & dynamic wrapper
│   ├── components/
│   │   ├── Countdown.tsx    # Counter live s/d Hari-H
│   │   ├── GiftSection.tsx  # Tabs cashless & kado dengan Copy Account
│   │   ├── InvitationMain.ts# Main controller, 10 Slides, Menu & Swipe control
│   │   ├── MusicPlayer.tsx  # Loop audio player & float control disk
│   │   └── RSVPModal.tsx    # Modal form input ucapan & database feed
│   └── lib/
│       └── supabaseClient.ts# Inisialisasi Supabase & Fallback Local Storage
├── package.json             # Package dependency config
├── tailwind.config.js       # Mapping custom theme colors & fonts
├── tsconfig.json            # TypeScript compiler configuration
└── supabase_schema.sql      # Script SQL database untuk Supabase
```

---

## ⚡ Cara Menjalankan Project Secara Lokal

Karena di sandbox terminal ini tidak terpasang runtime Node.js, Anda dapat mengunduh atau menyalin project ini ke komputer lokal Anda yang sudah terinstal Node.js dan ikuti langkah berikut:

### 1. Install Dependencies
Buka terminal di folder project Anda, lalu jalankan perintah:
```bash
npm install
```

### 2. Jalankan Dev Server
Jalankan server lokal development dengan perintah:
```bash
npm run dev
```
Buka browser dan buka alamat [http://localhost:3000](http://localhost:3000).

### 3. URL Parameter Untuk Nama Tamu
Untuk menguji tampilan nama tamu kustom (kepada siapa undangan ditujukan), tambahkan parameter `?to=Nama+Tamu` di bagian akhir URL browser Anda.
* Contoh: `http://localhost:3000/?to=Bapak+Joko+Widodo`
* Contoh: `http://localhost:3000/?to=Ilham+Nugroho`

---

## 🗄️ Menghubungkan ke Database Supabase

Aplikasi ini dilengkapi fitur **Local Storage Fallback**. Artinya, form ucapan & RSVP akan otomatis tetap bekerja dan tersimpan secara lokal jika kredensial Supabase belum diisi. 

Untuk mengaktifkan database online (agar tamu lain bisa saling melihat ucapan):

### 1. Buat Tabel di Supabase
* Buka **Supabase Dashboard** dan buat project baru.
* Masuk ke menu **SQL Editor**, buat query baru, lalu salin isi file `supabase_schema.sql` ke editor tersebut.
* Klik **Run** untuk membuat tabel `rsvps` beserta policy keamanan RLS agar tamu dapat memasukkan data secara aman.

### 2. Setup Environment Variables
Buat file baru bernama `.env.local` di root folder project Anda, lalu masukkan kredensial Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*Ganti nilai di atas dengan URL dan Anon Key asli dari pengaturan project Supabase Anda (Project Settings -> API).*

Setelah `.env.local` disimpan, restart dev server dengan menghentikan terminal (`Ctrl + C`) lalu jalankan kembali `npm run dev`. Aplikasi akan otomatis terhubung ke database online!

---

## 🚀 Panduan Deployment ke Vercel

Undangan Next.js ini dirancang agar sangat mudah dideploy ke **Vercel** secara gratis:

1. Push folder project ini ke repositori **GitHub** Anda.
2. Masuk ke [Vercel Dashboard](https://vercel.com) dan hubungkan akun GitHub Anda.
3. Klik **Add New** -> **Project**, lalu pilih repositori undangan ini.
4. Di bagian **Environment Variables**, masukkan variabel berikut (jika sudah menggunakan Supabase):
   * Key: `NEXT_PUBLIC_SUPABASE_URL` | Value: *URL Supabase Anda*
   * Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Value: *Anon Key Supabase Anda*
5. Klik tombol **Deploy**.
6. Selesai! Web undangan digital Anda sudah online dan siap disebarkan.
