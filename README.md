# SIG-WISATA Harau

Aplikasi mobile Sistem Informasi GIS Fasilitas Wisata untuk wilayah Kecamatan Harau, Kabupaten Lima Puluh Kota, Sumatera Barat.

## Fitur
- Login Admin dan Pengguna tersimpan pada SQLite (demo: `admin/admin123` dan `pengguna/pengguna123`).
- Data wisata, kategori, harga tiket, jam operasional, deskripsi, koordinat dan fasilitas pendukung.
- CRUD objek wisata oleh Admin, dengan validasi dasar.
- SQLite lokal melalui `expo-sqlite`.
- Peta OpenStreetMap memakai Leaflet di React Native WebView.
- Marker destinasi, detail wisata, pencarian, filter kategori dan fasilitas.
- GPS perangkat melalui `expo-location`.
- Admin dapat mengisi koordinat dengan GPS, mengetik koordinat, atau mengetuk lokasi di peta.
- Tombol navigasi Google Maps.
- Dashboard jumlah destinasi, ringkasan kategori dan fasilitas.
- Master kategori dan fasilitas pendukung disiapkan di SQLite untuk pengembangan CRUD terpisah.

## Persyaratan
- Node.js **22.13 atau lebih baru** (SDK 58).
- Android dengan Expo Go yang mendukung SDK 58.
- Koneksi internet untuk tile OpenStreetMap dan CDN Leaflet.
- VS Code (opsional).

## Menjalankan di Windows
1. Ekstrak ZIP.
2. Buka folder `SIG-WISATA-HARAU` di VS Code.
3. Buka terminal pada folder proyek.
4. Jalankan:

```bash
npm install
npx expo install --fix
npx expo start
```

5. Buka Expo Go pada Android dan scan QR code.
6. Izinkan akses lokasi ketika ingin menggunakan fitur GPS.

Jika Expo Go dari Play Store belum mendukung SDK 58 pada perangkat, perbarui Expo Go. Untuk lingkungan SDK 58 yang belum tersedia di Expo Go publik, gunakan development build Android.

## Akun / autentikasi
Login dilakukan terhadap tabel `users` lokal. Akun demo: Admin `admin/admin123`, Pengguna `pengguna/pengguna123`. Untuk produksi, password wajib di-hash dan autentikasi dipindahkan ke backend.

## Database
Database SQLite bernama `sig_wisata_harau.db` dibuat otomatis pada perangkat. Enam contoh lokasi wisata akan dimasukkan saat aplikasi pertama kali dibuka. Data yang ditambahkan atau diubah disimpan lokal pada perangkat tersebut.

## Data awal dan akurasi
Data awal mencakup Lembah Harau, Air Terjun Sarasah Bunta, Kampung Eropa Harau, Panorama Lembah Harau, Sarasah Donat, dan Kawasan Harau Dream Park. Koordinat awal merupakan **titik perkiraan untuk demonstrasi peta**, bukan hasil survei GPS resmi. Harga tiket, jam buka, alamat rinci, dan fasilitas juga merupakan nilai contoh yang wajib dikonfirmasi kepada pengelola wisata. Admin dapat memperbaikinya di aplikasi.

## Struktur proyek

```text
SIG-WISATA-HARAU/
├── App.tsx                 # Navigasi tab, role, pencarian, dashboard, modal
├── app.json                # Konfigurasi Expo SDK 58 dan permission lokasi
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── database.ts         # Skema SQLite, seed, CRUD wisata
    ├── types.ts            # Tipe kategori, fasilitas, objek wisata, role
    ├── MapView.tsx         # Peta Leaflet dan marker wisata
    └── MapPicker.tsx       # Pemilihan koordinat dengan tap pada peta
```

## Catatan teknis
- Peta dasar menggunakan server tile OpenStreetMap dan library Leaflet dari CDN. Internet diperlukan untuk menampilkan peta.
- Data objek wisata tersimpan lokal. Belum ada sinkronisasi antarperangkat atau server/API.
- Marker yang terlihat mengikuti hasil pencarian/filter aktif.
- Navigasi membuka Google Maps melalui URL koordinat.
- Pengujian akhir tetap perlu dilakukan pada perangkat Android karena izin GPS dan kompatibilitas Expo Go bergantung pada versi aplikasi di perangkat.
