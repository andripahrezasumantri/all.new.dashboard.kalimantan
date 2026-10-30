// REPLACE FUNGSI initApp DAN fetchDashboardData DI app.js DENGAN KODE INI:

function initApp() {
  // Set default filter date (Default: Tanggal 1 s.d. Hari Ini pada bulan berjalan)
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const formatDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  document.getElementById('filterStartDate').value = formatDate(firstDay);
  document.getElementById('filterEndDate').value = formatDate(today);
  document.getElementById('inputTanggal').value = formatDate(today);

  // Event Listeners Filter
  document.getElementById('btnApplyFilter').addEventListener('click', () => filterAndRenderData());
  document.getElementById('filterToko').addEventListener('change', () => filterAndRenderData());

  // Initial Fetch & Render Data
  fetchDashboardData();
}

// 1. Ambil Data Master dari Backend / Sheet
async function fetchDashboardData() {
  const syncStatus = document.getElementById('syncStatus');
  const spinner = document.getElementById('spinnerSync');

  try {
    if (spinner) spinner.classList.remove('hidden');
    syncStatus.querySelector('span').innerText = 'Memuat Data...';

    const res = await fetch(API_URL);
    const result = await res.json();

    if (result.status === 'success') {
      // Simpan seluruh data mentah transaksi harian
      window.masterRawData = result.rawData || [];
      filterAndRenderData();
      syncStatus.querySelector('span').innerText = 'Ready';
    } else {
      throw new Error(result.message || 'Gagal memuat data');
    }

  } catch (err) {
    console.error('Error fetching data:', err);
    syncStatus.querySelector('span').innerText = 'Error / Offline Data';
    
    // Fallback ke Mock Data harian jika offline
    window.masterRawData = generateDailyMockData();
    filterAndRenderData();
  } finally {
    if (spinner) spinner.classList.add('hidden');
  }
}

// 2. LOGIKA UTAMA: Filter berdasarkan Rentang Tanggal & Toko lalu Recalculate Dashboard
function filterAndRenderData() {
  const kodeToko = document.getElementById('filterToko').value;
  const startDate = document.getElementById('filterStartDate').value;
  const endDate = document.getElementById('filterEndDate').value;

  if (!window.masterRawData || window.masterRawData.length === 0) return;

  // Filter Baris Transaksi Berdasarkan Tanggal & Toko
  const filteredRows = window.masterRawData.filter(row => {
    const matchToko = (kodeToko === 'ALL' || String(row.kodeToko) === String(kodeToko));
    const matchDate = (!startDate || row.tanggal >= startDate) && (!endDate || row.tanggal <= endDate);
    return matchToko && matchDate;
  });

  // Re-Calculate Agregat Analitik dari Baris yang Lolos Filter
  globalData = recalculateAnalytics(filteredRows, kodeToko);
  renderCurrentTab();
}

// 3. Helper Hitung Ulang Agregat Analitik (Sales, Target, Channel, Divisi, Indicators)
function recalculateAnalytics(rows, selectedToko) {
  let totalSales = 0, totalTarget = 0, totalTrx = 0, totalQty = 0, totalTraffic = 0;
  let totalDP = 0, totalCV = 0, totalBazaar = 0, totalShopTalk = 0, totalFFS = 0, totalSuko = 0, totalB2B = 0;
  let totalDiv1 = 0, totalDiv2 = 0, totalDiv3 = 0, totalDiv4 = 0;

  let storeMap = {};

  rows.forEach(r => {
    const sales = parseFloat(r.sales) || (parseFloat(r.dp || 0) + parseFloat(r.cv || 0));
    const target = parseFloat(r.targetStore) || 0;
    const trx = parseFloat(r.trx) || 0;
    const qty = parseFloat(r.qty) || 0;
    const traffic = parseFloat(r.traffic) || 0;

    totalSales += sales;
    totalTarget += target;
    totalTrx += trx;
    totalQty += qty;
    totalTraffic += traffic;

    totalDP += parseFloat(r.dp) || 0;
    totalCV += parseFloat(r.cv) || 0;
    totalBazaar += parseFloat(r.bazaar) || 0;
    totalShopTalk += parseFloat(r.shopTalk) || 0;
    totalFFS += parseFloat(r.ffs) || 0;
    totalSuko += parseFloat(r.suko) || 0;
    totalB2B += parseFloat(r.b2b) || 0;

    totalDiv1 += parseFloat(r.divisi1) || 0;
    totalDiv2 += parseFloat(r.divisi2) || 0;
    totalDiv3 += parseFloat(r.divisi3) || 0;
    totalDiv4 += parseFloat(r.divisi4) || 0;

    // Grouping Per Toko
    const k = String(r.kodeToko);
    if (!storeMap[k]) {
      storeMap[k] = {
        kode: k,
        nama: r.namaToko || `MDS ${k}`,
        sales: 0,
        target: 0,
        trx: 0,
        qty: 0,
        traffic: 0,
        sukoSales: 0
      };
    }

    storeMap[k].sales += sales;
    storeMap[k].target += target;
    storeMap[k].trx += trx;
    storeMap[k].qty += qty;
    storeMap[k].traffic += traffic;
    storeMap[k].sukoSales += parseFloat(r.suko) || 0;
  });

  const achPercent = totalTarget > 0 ? Math.round((totalSales / totalTarget) * 100) : 0;
  const basketSize = totalTrx > 0 ? Math.round(totalSales / totalTrx) : 0;
  const aur = totalQty > 0 ? Math.round(totalSales / totalQty) : 0;
  const upt = totalTrx > 0 ? Math.round((totalQty / totalTrx) * 100) / 100 : 0;
  const convRate = totalTraffic > 0 ? Math.round((totalTrx / totalTraffic) * 100) : 0;

  const breakdownStores = Object.values(storeMap).map(st => ({
    ...st,
    achievementPercent: st.target > 0 ? Math.round((st.sales / st.target) * 100) : 0,
    kontribusiPercent: totalSales > 0 ? Math.round((st.sales / totalSales) * 100) : 0
  }));

  return {
    summary: {
      totalSales,
      totalTarget,
      achievementPercent: achPercent,
      growthGregoYoYPercent: 5,
      trx: { value: totalTrx },
      traffic: { value: totalTraffic },
      basketSize: { value: basketSize },
      aur: { value: aur },
      upt: { value: upt },
      conversionRate: { value: convRate }
    },
    breakdownChannel: {
      dp: totalDP,
      cv: totalCV,
      bazaar: totalBazaar,
      shopAndTalk: totalShopTalk,
      ffs: totalFFS,
      suko: totalSuko,
      b2b: totalB2B
    },
    breakdownDivisi: {
      divisi1: totalDiv1,
      divisi2: totalDiv2,
      divisi3: totalDiv3,
      divisi4: totalDiv4
    },
    sukoDetail: {
      sales: totalSuko,
      kontribusiPercent: totalSales > 0 ? Math.round((totalSuko / totalSales) * 100) : 0
    },
    breakdownStores
  };
}

// 4. Fallback Generator Mock Data Harian (Jika API Offline)
function generateDailyMockData() {
  const stores = [
    { kode: '253', nama: 'MDS PALANGKARAYA' },
    { kode: '283', nama: 'MDS PONTIANAK' },
    { kode: '284', nama: 'MDS BANJARMASIN' },
    { kode: '311', nama: 'MDS DUTA MALL BANJARMASIN' },
    { kode: '322', nama: 'MDS BALIKPAPAN' },
    { kode: '327', nama: 'MDS SAMARINDA' },
    { kode: '355', nama: 'MDS SINGKAWANG' },
    { kode: '405', nama: 'MDS TARAKAN' },
    { kode: '408', nama: 'MDS SAMPIT' },
    { kode: '412', nama: 'MDS BONTANG' }
  ];

  let raw = [];
  const year = 2026;
  
  // Generate data harian untuk Bulan Oktober 2026
  for (let day = 1; day <= 31; day++) {
    const dateStr = `${year}-10-${String(day).padStart(2, '0')}`;
    stores.forEach(st => {
      const dp = 15000000 + (day * 500000);
      const cv = 20000000 + (day * 700000);
      raw.push({
        kodeToko: st.kode,
        namaToko: st.nama,
        tanggal: dateStr,
        targetStore: 45000000,
        sales: dp + cv,
        dp,
        cv,
        bazaar: 2000000,
        shopTalk: 1000000,
        ffs: 500000,
        suko: 1500000,
        b2b: 800000,
        divisi1: (dp + cv) * 0.35,
        divisi2: (dp + cv) * 0.25,
        divisi3: (dp + cv) * 0.25,
        divisi4: (dp + cv) * 0.15,
        qty: 150 + day,
        trx: 60 + day,
        traffic: 300 + (day * 5)
      });
    });
  }
  return raw;
}