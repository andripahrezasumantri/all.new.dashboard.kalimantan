/**
 * SCRIPT.JS - Floating Action Widget (Aman & Tidak Mengganggu Header)
 * Regional Kalimantan Dashboard
 */

function injectStyleCSS() {
    if (document.getElementById('customDashboardStyle')) return;
    const linkCss = document.createElement('link');
    linkCss.id = 'customDashboardStyle';
    linkCss.rel = 'stylesheet';
    linkCss.href = 'style.css';
    document.head.appendChild(linkCss);
}

function injectFloatingWidget() {
    // Cek apakah widget sudah pernah dibuat agar tidak dobel
    if (document.getElementById('floatingActionWidget')) return;

    // Buat kontainer widget melayang di pojok kanan bawah
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'floatingActionWidget';
    widgetContainer.className = 'fixed bottom-6 right-6 z-[9998] flex flex-col items-end gap-2.5';
    
    widgetContainer.innerHTML = `
        <!-- Tombol Utama / Toggle Menu (Opsional atau langsung list ikon) -->
        <div class="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-slate-700/80">
            
            <!-- Ikon Lampu (README) -->
            <button type="button" onclick="openReadmeModal()" class="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl transition border border-slate-700 flex items-center justify-center shadow cursor-pointer group relative" title="Panduan Aplikasi (README)">
                <i class="fa-solid fa-lightbulb text-sm"></i>
                <span class="absolute right-full mr-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow border border-slate-700 pointer-events-none">Panduan</span>
            </button>

            <!-- Ikon Audit -->
            <a href="audit.html" class="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl transition border border-slate-700 flex items-center justify-center shadow cursor-pointer group relative" title="Audit Data Toko">
                <i class="fa-solid fa-clipboard-check text-sm"></i>
                <span class="absolute right-full mr-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow border border-slate-700 pointer-events-none">Audit Data</span>
            </a>

            <!-- Ikon Google Spreadsheet -->
            <a href="https://docs.google.com/spreadsheets/d/1Iu6D1ahvl9E7RQN7mP30TeYtbDi0LO1FyGHhhF4cRSc/edit?usp=sharing" target="_blank" class="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl transition border border-slate-700 flex items-center justify-center shadow cursor-pointer group relative" title="Buka Spreadsheet">
                <i class="fa-solid fa-file-excel text-sm"></i>
                <span class="absolute right-full mr-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow border border-slate-700 pointer-events-none">Spreadsheet</span>
            </a>

        </div>
    `;

    document.body.appendChild(widgetContainer);

    // Buat Struktur Modal Pop-up README di Balik Layar (jika belum ada)
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

// Jalankan saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    injectStyleCSS();
    injectFloatingWidget();
});