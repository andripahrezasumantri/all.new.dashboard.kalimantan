/**
 * SCRIPT.JS - Final Clean Version (Spreadsheet Icon Between Audit & Form Entry)
 * Regional Kalimantan Dashboard
 */

// 1. Otomatis inject style.css ke header halaman secara dinamis tanpa sentuh index.html
function injectStyleCSS() {
    if (document.getElementById('customDashboardStyle')) return;
    
    const linkCss = document.createElement('link');
    linkCss.id = 'customDashboardStyle';
    linkCss.rel = 'stylesheet';
    linkCss.href = 'style.css';
    document.head.appendChild(linkCss);
}

// 2. Dynamic Action Buttons Injection (Ikon Lampu di Header Kiri, Ikon Audit & Ikon Spreadsheet di sebelah Form Entry)
function injectHeaderActionButtons() {
    // A. Masukkan Ikon Lampu (Panduan / README) di Header Kiri
    const headerLeftContainer = document.querySelector('header .max-w-7xl div.flex.items-center.gap-2') || document.querySelector('header');
    if (headerLeftContainer && !document.getElementById('readmeIconButton')) {
        const readmeBtn = document.createElement('button');
        readmeBtn.id = 'readmeIconButton';
        readmeBtn.type = 'button';
        readmeBtn.className = 'w-9 h-9 bg-slate-800 hover:bg-slate-700 text-amber-400 text-sm rounded-xl transition border border-slate-700 flex items-center justify-center shadow-sm cursor-pointer ml-2';
        readmeBtn.innerHTML = '<i class="fa-solid fa-lightbulb"></i>';
        readmeBtn.title = "Panduan Aplikasi (README)";
        readmeBtn.onclick = openReadmeModal;
        headerLeftContainer.appendChild(readmeBtn);
    }

    // B. Masukkan Ikon Audit & Ikon Spreadsheet di sebelah kiri Tombol Hijau "+ Form Entry"
    const formEntryBtn = document.querySelector('a[href="entry.html"]');
    if (formEntryBtn && formEntryBtn.parentNode) {
        
        // 1. Buat Ikon Spreadsheet (Read-Only) jika belum ada
        let spreadsheetBtn = document.getElementById('spreadsheetIconButton');
        if (!spreadsheetBtn) {
            spreadsheetBtn = document.createElement('a');
            spreadsheetBtn.id = 'spreadsheetIconButton';
            spreadsheetBtn.href = 'https://docs.google.com/spreadsheets/d/1Iu6D1ahvl9E7RQN7mP30TeYtbDi0LO1FyGHhhF4cRSc/edit?usp=sharing';
            spreadsheetBtn.target = '_blank';
            spreadsheetBtn.className = 'w-9 h-9 bg-slate-800 hover:bg-slate-700 text-indigo-400 text-sm rounded-xl transition border border-slate-700 flex items-center justify-center shadow-sm cursor-pointer mr-2';
            spreadsheetBtn.innerHTML = '<i class="fa-solid fa-file-excel"></i>';
            spreadsheetBtn.title = "Buka Google Spreadsheet (Read-Only)";
            
            // Masukkan tepat sebelum Form Entry
            formEntryBtn.parentNode.insertBefore(spreadsheetBtn, formEntryBtn);
        }

        // 2. Buat Ikon Audit (Clipboard Check) tepat sebelum Ikon Spreadsheet (sehingga posisinya di antara audit dan form entry)
        if (!document.getElementById('auditIconButton')) {
            const auditBtn = document.createElement('a');
            auditBtn.id = 'auditIconButton';
            auditBtn.href = 'audit.html';
            auditBtn.className = 'w-9 h-9 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-sm rounded-xl transition border border-slate-700 flex items-center justify-center shadow-sm cursor-pointer mr-2';
            auditBtn.innerHTML = '<i class="fa-solid fa-clipboard-check"></i>';
            auditBtn.title = "Audit Kelengkapan Data Input Toko";
            
            // Masukkan tepat sebelum spreadsheetBtn agar posisinya di sebelah kiri spreadsheet
            formEntryBtn.parentNode.insertBefore(auditBtn, spreadsheetBtn);
        }
    }

    // C. Buat Struktur Modal Pop-up README di Balik Layar (jika belum ada)
    if (!document.getElementById('readmeModalContainer')) {
        const modalWrapper = document.createElement('div');
        modalWrapper.id = 'readmeModalContainer';
        modalWrapper.className = 'fixed inset-0 z-[9999] hidden items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto';
        modalWrapper.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <!-- Modal Header -->
                <div class="bg-indigo-900 text-white px-5 py-4 flex items-center justify-between border-b border-indigo-800">
                    <div class="flex items-center gap-2.5">
                        <div class="p-2 bg-amber-400 text-indigo-950 rounded-xl font-bold">
                            <i class="fa-solid fa-lightbulb"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-bold tracking-wide">PANDUAN PENGGUNAAN APLIKASI</h3>
                            <p class="text-[11px] text-indigo-200">Dashboard Regional Kalimantan &bull; Manual Operasional User</p>
                        </div>
                    </div>
                    <button type="button" onclick="closeReadmeModal()" class="w-8 h-8 rounded-lg bg-indigo-800/80 hover:bg-indigo-700 text-indigo-200 hover:text-white flex items-center justify-center transition cursor-pointer">
                        <i class="fa-solid fa-xmark text-sm"></i>
                    </button>
                </div>

                <!-- Modal Body (Isi README) -->
                <div class="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
                    <div>
                        <h4 class="font-bold text-indigo-900 text-sm uppercase mb-1 flex items-center gap-1.5">
                            <i class="fa-solid fa-circle-info text-indigo-600"></i> 1. Tentang Dashboard
                        </h4>
                        <p class="text-slate-600">
                            Aplikasi ini dirancang untuk memantau performa penjualan harian, pencapaian target, dan indikator operasional 10 toko wilayah Regional Kalimantan secara <i>real-time</i>.
                        </p>
                    </div>

                    <hr class="border-slate-100">

                    <div>
                        <h4 class="font-bold text-indigo-900 text-sm uppercase mb-1 flex items-center gap-1.5">
                            <i class="fa-solid fa-filter text-indigo-600"></i> 2. Cara Menggunakan Filter Data
                        </h4>
                        <ul class="list-disc pl-5 space-y-1 text-slate-600">
                            <li><b>Pilih Toko:</b> Pilih salah satu toko spesifik atau biarkan <i>"REGIONAL KALIMANTAN (SEMUA TOKO)"</i> untuk melihat rangkuman seluruh toko.</li>
                            <li><b>Rentang Tanggal (MTD):</b> Otomatis terseting dari tanggal 1 sampai hari ini. Anda bisa mengubahnya sesuai kebutuhan, lalu klik tombol <b>Terapkan Filter</b>.</li>
                        </ul>
                    </div>

                    <hr class="border-slate-100">

                    <div>
                        <h4 class="font-bold text-indigo-900 text-sm uppercase mb-1 flex items-center gap-1.5">
                            <i class="fa-solid fa-pen-to-square text-indigo-600"></i> 3. Input Data Harian (Form Entry)
                        </h4>
                        <p class="text-slate-600">
                            Gunakan tombol hijau <b>+ Form Entry</b> di pojok kanan atas untuk memasukkan data penjualan harian (DP, CV, Bazaar, QTY, TRX, Traffic, dll.) langsung ke Google Spreadsheet pusat.
                        </p>
                    </div>

                    <hr class="border-slate-100">

                    <div>
                        <h4 class="font-bold text-indigo-900 text-sm uppercase mb-1 flex items-center gap-1.5">
                            <i class="fa-solid fa-table text-indigo-600"></i> 4. Audit & Tautan Spreadsheet
                        </h4>
                        <ul class="list-disc pl-5 space-y-1 text-slate-600">
                            <li>Gunakan ikon <b>Audit (Clipboard)</b> di sebelah tombol Form Entry untuk mengecek kelengkapan input harian per toko secara presisi.</li>
                            <li>Gunakan ikon <b>Spreadsheet (Excel)</b> di samping ikon audit untuk melihat data mentah secara transparan.</li>
                        </ul>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
                    <span class="text-[11px] text-slate-400 font-medium">Regional Kalimantan Analytics &bull; Versi 2026</span>
                    <button type="button" onclick="closeReadmeModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition cursor-pointer">
                        Saya Mengerti
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modalWrapper);
    }
}

function openReadmeModal() {
    const modal = document.getElementById('readmeModalContainer');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeReadmeModal() {
    const modal = document.getElementById('readmeModalContainer');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    injectStyleCSS();             // Otomatis pasang style.css
    injectHeaderActionButtons();  // Otomatis pasang seluruh tombol ikon & modal
});