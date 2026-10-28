/**
 * CONFIG & GLOBAL HELPERS - DASHBOARD REGIONAL KALIMANTAN
 * File ini memuat URL API, state global, serta fungsi pembantu yang digunakan di seluruh halaman.
 */

// 1. URL Endpoint Direct Google Apps Script Web App
const API_URL = "https://script.google.com/macros/s/AKfycbyDvQGuOFJVg9tQOUA_lQqL5e0t_Xdl0pDezExbhZ8Pq14zjnPYax1Baz-K6HHtbqM4/exec";

// 2. Variable State Global Data Dashboard
let rawDashboardData = null;

// 3. Pengaturan Tanggal Default (Awal Bulan MTD s/d Hari Ini)
function initDefaultDates() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const startDateElem = document.getElementById('startDate');
    const endDateElem = document.getElementById('endDate');

    if (startDateElem) startDateElem.value = `${year}-${month}-01`;
    if (endDateElem) endDateElem.value = `${year}-${month}-${day}`;
    
    updateRcaPeriodeReadonly();
}

// 4. Update Teks Periode Laporan (Read-only)
function updateRcaPeriodeReadonly() {
    const startElem = document.getElementById('startDate');
    const endElem = document.getElementById('endDate');
    const rcaPeriodeElem = document.getElementById('rcaPeriode');

    if (startElem && endElem && rcaPeriodeElem) {
        rcaPeriodeElem.value = `${startElem.value} s/d ${endElem.value}`;
    }
}

// 5. Sinkronisasi Dropdown Toko di Filter Utama ke Form RCA
function syncRcaTokoDropdown() {
    const globalTokoElem = document.getElementById('kodeToko');
    const rcaKodeTokoElem = document.getElementById('rcaKodeToko');

    if (globalTokoElem && rcaKodeTokoElem) {
        const globalToko = globalTokoElem.value;
        if (globalToko !== 'ALL') {
            rcaKodeTokoElem.value = globalToko;
        }
    }
}

// 6. Helper Format Angka Mata Uang Rupiah
function formatRupiah(num) {
    if (num === null || num === undefined) return 'Rp 0';
    return 'Rp ' + Number(num).toLocaleString('id-ID');
}

// 7. Helper Format Angka Biasa (Ribuan)
function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return Number(num).toLocaleString('id-ID');
}

// 8. Helper Badge Warna Pertumbuhan/Growth (%)
function setGrowthBadge(elemId, val) {
    const elem = document.getElementById(elemId);
    if (!elem) return;
    const numVal = parseFloat(val) || 0;
    elem.innerText = (numVal > 0 ? '+' : '') + numVal + '%';
    
    if (numVal > 0) {
        elem.className = 'font-bold text-emerald-600';
    } else if (numVal < 0) {
        elem.className = 'font-bold text-rose-600';
    } else {
        elem.className = 'font-bold text-slate-500';
    }
}

// 9. Tampilkan / Sembunyikan Overlay Spinner Loading
function showLoading(isLoading) {
    const loading = document.getElementById('loadingState');
    if (!loading) return;
    if (isLoading) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}