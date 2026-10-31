# 📊 Panduan Pengguna: Smart Dashboard Regional Kalimantan
**Sistem Monitoring Real-Time Performa Penjualan & Operasional 10 Toko Matahari Department Store (MDS) Regional Kalimantan**

---

## 🌟 Selamat Datang!
Dokumen ini dirancang khusus sebagai panduan lengkap bagi siapa saja (termasuk pengguna pemula/baru) untuk memahami, mengoperasikan, dan memanfaatkan seluruh fitur yang ada di dalam aplikasi **Smart Dashboard Regional Kalimantan**. 

Aplikasi ini berbasis web modern (*Single-Page Application* dengan integrasi *Google Apps Script*) yang terhubung secara langsung (*real-time*) dengan database pusat di Google Spreadsheet.

---

## 📂 Struktur File & Peran Masing-Masing
Proyek ini dirancang agar bersih, modular, dan aman dari error. Berikut adalah rincian file yang ada di dalam folder proyekmu:

1. **`index.html`**
   - **Fungsi:** Halaman utama dashboard analitik. Di sinilah seluruh grafik, tabel perbandingan toko, kartu KPI, dan filter tanggal berada.
2. **`entry.html`**
   - **Fungsi:** Formulir input harian (*Daily Sales Entry*). Digunakan oleh admin atau kepala toko untuk memasukkan data realisasi penjualan harian per kategori, divisi, dan operasional.
3. **`audit.html`**
   - **Fungsi:** Halaman matriks audit kelengkapan data input. Berfungsi untuk memantau toko mana saja yang tanggal inputnya sudah lengkap (**DONE**) atau yang masih bolong/belum diisi (**MISSING**).
4. **`script.js`**
   - **Fungsi:** Skrip penggerak otomatis. Berfungsi untuk menyuntikkan tautan Google Spreadsheet (*Read-Only*) dan menghubungkan file tata gaya secara dinamis.
5. **`style.css`**
   - **Fungsi:** File penataan gaya visual bergaya *Enterprise* yang membuat tampilan dashboard menjadi bersih, profesional, dan rapi.
6. **`jam.html`**
   - **Fungsi:** Widget penunjuk waktu digital *real-time* yang tersemat otomatis di bagian atas header halaman utama.

---

## 🚀 Panduan Penggunaan untuk Pengguna (User Flow)

### 1. Cara Membuka Dashboard Utama (`index.html`)
* Buka file **`index.html`** menggunakan browser modern (Chrome, Edge, atau Safari).
* Di bagian atas, kamu akan melihat **Control Bar / Global Filters**:
  * **Pilih Toko:** Kamu bisa melihat performa seluruh toko sekaligus (**REGIONAL KALIMANTAN**) atau memilih salah satu dari 10 toko spesifik (misal: MDS Palangkaraya, MDS Duta Mall Banjarmasin, dll.).
  * **Rentang Tanggal (MTD hingga Hari Ini):** Secara otomatis ter-set ke awal bulan berjalan sampai hari ini. Kamu bisa mengubah tanggalnya sesuai kebutuhan, lalu klik **Terapkan Filter**.
* **Navigasi Menu (Tab Bar):**
  * *Store Performance:* Ringkasan total sales, achievement, dan tabel breakdown lengkap per toko.
  * *Sales by Division:* Analisis perbandingan kategori (DP vs CV) dan pembagian Divisi 1 sampai Divisi 4.
  * *Sales Channel:* Monitoring kanal penjualan seperti In-Store, Bazaar, Shop & Talk, FFS, dan B2B.
  * *New Initiative Brand (SUKO):* Khusus memantau performa dan tren penjualan brand SUKO di seluruh toko.
  * *Indicator Business:* Metrik manajemen inti seperti TRX, Basket Size (AUC), UPT, Traffic, dan Conversion Rate.

### 2. Cara Mengisi Data Harian (`entry.html`)
Jika kamu bertugas menginput data penjualan harian toko:
* Klik tombol **"+ Form Entry"** yang ada di pojok kanan atas dashboard utama.
* Pilih **Kode Toko** kamu dan tentukan **Tanggal Transaksi**.
* Masukkan angka realisasi nominal untuk kanal sales (DP, CV, Bazaar, Shop & Talk, FFS, SUKO, B2B), pembagian divisi produk, serta data operasional (QTY, TRX, Traffic).
* Total sales akan terhitung secara otomatis.
* Klik **"Simpan Data ke Spreadsheet"**. Data akan langsung masuk ke database pusat Google Spreadsheet secara instan!

### 3. Cara Memeriksa Kelengkapan Data (`audit.html`)
* Akses halaman **`audit.html`** (atau klik menu audit jika tersedia).
* Halaman ini menampilkan tabel matriks 12 bulan untuk 10 toko.
* **Indikator Warna:**
  * 🟢 **Hijau (DONE):** Seluruh data harian di bulan tersebut sudah terisi penuh.
  * 🔴 **Merah Berdenyut (MISSING):** Ada tanggal yang belum diisi. Kamu bisa **mengklik kotak merah tersebut**, dan sistem akan otomatis mengarahkanmu ke `entry.html` tepat pada tanggal yang bolong untuk diisi!
  * ⚪ **Abu-abu (FUTURE):** Bulan di masa depan yang belum berjalan.

---

## 📌 Catatan Teknis & Keamanan
* **Integrasi Database:** Seluruh data ditarik langsung dari Google Spreadsheet menggunakan API Backend *Google Apps Script*. Pastikan perangkatmu terhubung ke internet saat membuka dashboard agar data tersinkronisasi.
* **Akses Data Cepat:** Tersedia tombol akses cepat **Google Spreadsheet (Read-Only)** di dalam aplikasi bagi manajemen yang ingin mengunduh atau meninjau data mentah secara langsung.
