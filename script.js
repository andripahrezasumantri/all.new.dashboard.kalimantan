/**
 * SCRIPT.JS - Ultimate Direct Injection Version
 * Regional Kalimantan Dashboard
 */

// Otomatis inject style.css
function injectStyleCSS() {
    if (document.getElementById('customDashboardStyle')) return;
    const linkCss = document.createElement('link');
    linkCss.id = 'customDashboardStyle';
    linkCss.rel = 'stylesheet';
    linkCss.href = 'style.css';
    document.head.appendChild(linkCss);
}

// Injeksi tombol aksi secara langsung ke header & sebelah form entry
function injectHeaderActionButtons() {
    // 1. Cari elemen <header> utama
    const header = document.querySelector('header');
    if (!header) return;

    // Cari area div flex di dalam header untuk menaruh ikon Spreadsheet & Lampu
    let headerContainer = header.querySelector('div.flex.items-center.gap-2') || header.querySelector('div');

    if (headerContainer) {
        // A. Ikon Google Spreadsheet (Read-Only)
        if (!document.getElementById('spreadsheetIconButton')) {
            const spreadsheetBtn = document.createElement('a');
            spreadsheetBtn.id = 'spreadsheetIconButton';
            spreadsheetBtn.href = 'https://docs.google.com/spreadsheets/d/1Iu6D1ahvl9E7RQN7mP30TeYtbDi0LO1FyGHhhF4cRSc/edit?usp=sharing';
            spreadsheetBtn.target = '_blank';
            spreadsheetBtn.className = 'w-9 h-9 bg-slate-800 hover:bg-slate-700 text-indigo-400 text-sm rounded-xl transition border border-slate-700 flex items-center justify-center shadow-sm cursor-pointer ml-2';
            spreadsheetBtn.innerHTML = '<i class="fa-solid fa-file-excel"></i>';
            spreadsheetBtn.title = "Buka Google Spreadsheet (Read-Only)";
            headerContainer.appendChild(spreadsheetBtn);
        }

        // B. Ikon Lampu (Panduan / README)
        if (!document.getElementById('readmeIconButton')) {
            const readmeBtn = document.createElement('button');
            readmeBtn.id = 'readmeIconButton';
            readmeBtn.type = 'button';
            readmeBtn.className = 'w-9 h-9 bg-slate-800 hover:bg-slate-700 text-amber-400 text-sm rounded-xl transition border border-slate-700 flex items-center justify-center shadow-sm cursor-pointer ml-2';
            readmeBtn.innerHTML = '<i class="fa-solid fa-lightbulb"></i>';
            readmeBtn.title = "Panduan Aplikasi (README)";
            readmeBtn.onclick = openReadmeModal;
            headerContainer.appendChild(readmeBtn);
        }
    }

    // 2. Masukkan Ikon Audit & Ikon Spreadsheet di sebelah kiri Tombol Hijau "+ Form Entry"
    const formEntryBtn = document.querySelector('a[href="entry.html"]');
    if (formEntryBtn && formEntryBtn.parentNode) {
        
        // Ikon Spreadsheet kecil di dekat form entry (opsional/tambahan akses cepat)
        let inlineSpreadsheet = document.getElementById('inlineSpreadsheetIcon');
        if (!inlineSpreadsheet) {
            inlineSpreadsheet = document.createElement('a');
            inlineSpreadsheet.id = 'inlineSpreadsheetIcon';
            inlineSpreadsheet.href = 'https://docs.google.com/spreadsheets/d/1Iu6D1ahvl9E7RQN7mP30TeYtbDi0LO1FyGHhhF4cRSc/edit?usp=sharing';
            inlineSpreadsheet.target = '_blank';
            inlineSpreadsheet.className = 'w-9 h-9 bg-slate-800 hover:bg-slate-700 text-indigo-400 text-sm rounded-xl transition border border-slate-700 flex items-center justify-center shadow-sm cursor-pointer mr-2';
            inlineSpreadsheet.innerHTML = '<i class="fa-solid fa-file-excel"></i>';
            inlineSpreadsheet.title = "Buka Google Spreadsheet";
            formEntryBtn.parentNode.insertBefore(inlineSpreadsheet, formEntryBtn);
        }

        // Ikon Audit (Clipboard Check)
        if (!document.getElementById('auditIconButton')) {
            const auditBtn = document.createElement('a');
            auditBtn.id = 'auditIconButton';
            auditBtn.href = 'audit.html';
            auditBtn.className = 'w-9 h-9 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-sm rounded-xl transition border border-slate-700 flex items-center justify-center shadow-sm cursor-pointer mr-2';
            auditBtn.innerHTML = '<i class="fa-solid fa-clipboard-check"></i>';
            auditBtn.title = "Audit Kelengkapan Data Input Toko";
            formEntryBtn.parentNode.insertBefore(auditBtn, inlineSpreadsheet);
        }
    }

    // 3. Buat Struktur Modal Pop-up README di Balik Layar
    if (!document.getElementById('readmeModalContainer')) {
        const modalWrapper = document.createElement('div');
        modalWrapper.id = 'readmeModalContainer';
        modalWrapper.className = 'fixed inset-0 z-[9999] hidden items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto';
        modalWrapper.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
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
                <div class="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
                    <div>
                        <h4 class="font-bold text-indigo-900 text-sm uppercase mb-1"><i class="fa-solid fa-circle-info text-indigo-600"></i> 1. Tentang Dashboard</h4>
                        <p class="text-slate-600">Aplikasi ini dirancang untuk memantau performa penjualan harian, pencapaian target, dan indikator operasional 10 toko wilayah Regional Kalimantan secara real-time.</p>
                    </div>
                    <hr class="border-slate-100">
                    <div>
                        <h4 class="font-bold text-indigo-900 text-sm uppercase mb-1"><i class="fa-solid fa-pen-to-square text-indigo-600"></i> 2. Input Data Harian</h4>
                        <p class="text-slate-600">Gunakan tombol hijau <b>+ Form Entry</b> di pojok kanan atas untuk memasukkan data penjualan harian secara lengkap (10 getItem wajib).</p>
                    </div>
                </div>
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

// Jalankan otomatis saat halaman siap
document.addEventListener('DOMContentLoaded', () => {
    injectStyleCSS();
    injectHeaderActionButtons();
});