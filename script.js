/**
 * SCRIPT.JS - Header Action Buttons Auto-Injector & Compact Layout
 * Regional Kalimantan Dashboard
 */

// 1. Otomatis inject style.css ke header halaman
function injectStyleCSS() {
    if (document.getElementById('customDashboardStyle')) return;
    const linkCss = document.createElement('link');
    linkCss.id = 'customDashboardStyle';
    linkCss.rel = 'stylesheet';
    linkCss.href = 'style.css';
    document.head.appendChild(linkCss);
}

// 2. Dynamic Action Buttons Injection & Compact Form Entry Styling
function injectHeaderActionButtons() {
    // Cari tombol hijau Form Entry yang ada di index.html
    const formEntryBtn = document.querySelector('a[href="entry.html"]');
    
    if (formEntryBtn && formEntryBtn.parentNode) {
        // A. Ubah tombol hijau Form Entry jadi lebih compact / kecil
        formEntryBtn.className = "px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow transition flex items-center gap-1.5 shrink-0";

        const parentContainer = formEntryBtn.parentNode;

        // B. Buat dan pasang Ikon Google Spreadsheet (Read-Only) di sebelah kiri tombol hijau
        if (!document.getElementById('spreadsheetIconButton')) {
            const spreadsheetBtn = document.createElement('a');
            spreadsheetBtn.id = 'spreadsheetIconButton';
            spreadsheetBtn.href = 'https://docs.google.com/spreadsheets/d/1Iu6D1ahvl9E7RQN7mP30TeYtbDi0LO1FyGHhhF4cRSc/edit?usp=sharing';
            spreadsheetBtn.target = '_blank';
            spreadsheetBtn.className = 'w-8 h-8 bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs rounded-lg transition border border-slate-700 flex items-center justify-center shadow-sm cursor-pointer shrink-0';
            spreadsheetBtn.innerHTML = '<i class="fa-solid fa-file-excel"></i>';
            spreadsheetBtn.title = "Buka Google Spreadsheet (Read-Only)";
            parentContainer.insertBefore(spreadsheetBtn, formEntryBtn);
        }

        // C. Buat dan pasang Ikon Audit di sebelah kiri ikon Google Spreadsheet
        if (!document.getElementById('auditIconButton')) {
            const spreadsheetBtn = document.getElementById('spreadsheetIconButton');
            const auditBtn = document.createElement('a');
            auditBtn.id = 'auditIconButton';
            auditBtn.href = 'audit.html';
            auditBtn.className = 'w-8 h-8 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs rounded-lg transition border border-slate-700 flex items-center justify-center shadow-sm cursor-pointer shrink-0';
            auditBtn.innerHTML = '<i class="fa-solid fa-clipboard-check"></i>';
            auditBtn.title = "Audit Kelengkapan Data Input Toko";
            parentContainer.insertBefore(auditBtn, spreadsheetBtn);
        }

        // D. Buat dan pasang Ikon Lampu (README) di sebelah kiri ikon Audit
        if (!document.getElementById('readmeIconButton')) {
            const auditBtn = document.getElementById('auditIconButton');
            const readmeBtn = document.createElement('button');
            readmeBtn.id = 'readmeIconButton';
            readmeBtn.type = 'button';
            readmeBtn.className = 'w-8 h-8 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs rounded-lg transition border border-slate-700 flex items-center justify-center shadow-sm cursor-pointer shrink-0';
            readmeBtn.innerHTML = '<i class="fa-solid fa-lightbulb"></i>';
            readmeBtn.title = "Panduan Aplikasi (README)";
            readmeBtn.onclick = openReadmeModal;
            parentContainer.insertBefore(readmeBtn, auditBtn);
        }
    }

    // 3. Buat Struktur Modal Pop-up README di Balik Layar (jika belum ada)
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
                        <p class="text-slate-600">Gunakan tombol <b>Form Entry</b> di header untuk memasukkan data penjualan harian secara lengkap.</p>
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