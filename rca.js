/**
 * RCA ACTION PLAN & REASON LOGIC - DASHBOARD REGIONAL KALIMANTAN
 * File ini memuat seluruh handler untuk pencatatan, pembaruan, penghapusan,
 * serta pemuatan feed monitoring RCA.
 */

// Memory Cache Log Reason Toko
let reasonLogs = [];

/**
 * 1. MENGAMBIL FEED REASON LOGS DARI BACKEND
 */
async function loadReasonFeed() {
    const container = document.getElementById('rcaCardFeedContainer');
    if (container) {
        container.innerHTML = `
            <div class="text-center py-8 text-slate-400 text-xs">
                <i class="fa-solid fa-spinner animate-spin text-lg mb-2"></i>
                <p>Memuat feed laporan RCA toko...</p>
            </div>
        `;
    }

    try {
        const res = await fetch(`${API_URL}?action=getReasons`, { redirect: 'follow' });
        const json = await res.json();
        if (json.status === 'success') {
            reasonLogs = json.data || [];
            renderReasonCards();
        } else {
            console.error('Gagal mengambil data RCA:', json.message);
        }
    } catch (err) {
        console.error('Gagal mengambil feed RCA:', err);
    }
}

/**
 * 2. RENDERING FEED RCA INTO CARD GRID (GROUPED BY STORE)
 */
function renderReasonCards() {
    const container = document.getElementById('rcaCardFeedContainer');
    if (!container) return;

    const filterTokoElem = document.getElementById('filterRcaStoreFeed');
    const filterToko = filterTokoElem ? filterTokoElem.value : 'ALL';

    let filteredLogs = reasonLogs;
    if (filterToko !== 'ALL') {
        filteredLogs = reasonLogs.filter(l => String(l.kodeToko) === String(filterToko));
    }

    if (filteredLogs.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-slate-400 text-xs">
                <i class="fa-solid fa-folder-open text-2xl mb-2"></i>
                <p>Belum ada laporan RCA untuk toko ini.</p>
            </div>
        `;
        return;
    }

    // Grouping Laporan berdasarkan Toko
    const grouped = {};
    filteredLogs.forEach(log => {
        if (!grouped[log.kodeToko]) {
            grouped[log.kodeToko] = { nama: log.namaToko, logs: [] };
        }
        grouped[log.kodeToko].logs.push(log);
    });

    container.innerHTML = '';

    Object.keys(grouped).forEach(kToko => {
        const grp = grouped[kToko];
        const storeWrapper = document.createElement('div');
        storeWrapper.className = 'border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white';

        let cardsHtml = '';
        grp.logs.forEach(log => {
            const recordId = log.id || log.rowId;

            cardsHtml += `
                <div class="p-4 bg-slate-50/60 border-t border-slate-200 space-y-3">
                    <div class="flex justify-between items-start">
                        <div>
                            <span class="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">${log.topik || 'General'}</span>
                            <span class="text-[10px] font-semibold text-slate-500 ml-2"><i class="fa-solid fa-calendar text-slate-400 mr-1"></i> ${log.periode || '-'}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-bold ${log.status === 'RESOLVED' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'} px-2 py-0.5 rounded-full">${log.status || 'OPEN'}</span>
                            <button onclick="editReason('${recordId}')" class="text-xs text-indigo-600 hover:text-indigo-800 p-1" title="Edit Laporan"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button onclick="deleteReason('${recordId}')" class="text-xs text-rose-600 hover:text-rose-800 p-1" title="Hapus Laporan"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                            <p class="text-[10px] font-bold text-slate-400 uppercase">Kategori RCA</p>
                            <p class="font-bold text-slate-800">${log.kategoriRCA || '-'} ${log.detailEksternal ? `(${log.detailEksternal})` : ''}</p>
                            <p class="text-slate-600 mt-1">${log.detailRCA || '-'}</p>
                        </div>

                        <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                            <p class="text-[10px] font-bold text-slate-400 uppercase">Action Plan & Recovery</p>
                            <p class="text-slate-700">${log.actionPlan || '-'}</p>
                            <p class="text-[10px] text-indigo-600 font-semibold mt-1"><i class="fa-solid fa-clock mr-1"></i> Target: ${log.targetRecoveryDate || '-'}</p>
                        </div>
                    </div>

                    ${(log.whatWorked || log.whatDidntWork) ? `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                        <div class="bg-emerald-50/50 p-2 rounded-lg border border-emerald-100"><span class="font-bold text-emerald-800 text-[10px]">WHAT WORKED:</span> <span class="text-emerald-900">${log.whatWorked || '-'}</span></div>
                        <div class="bg-rose-50/50 p-2 rounded-lg border border-rose-100"><span class="font-bold text-rose-800 text-[10px]">WHAT DIDN'T WORK:</span> <span class="text-rose-900">${log.whatDidntWork || '-'}</span></div>
                    </div>` : ''}
                </div>
            `;
        });

        storeWrapper.innerHTML = `
            <div class="bg-indigo-900 text-white p-3.5 flex justify-between items-center cursor-pointer" onclick="toggleStoreGroup('${kToko}')">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-store text-amber-400"></i>
                    <h4 class="text-sm font-bold">${grp.nama} (${kToko})</h4>
                    <span class="text-xs bg-indigo-800 px-2 py-0.5 rounded-full text-indigo-200">${grp.logs.length} Laporan</span>
                </div>
                <i id="icon-grp-${kToko}" class="fa-solid fa-chevron-down text-xs transition-transform"></i>
            </div>
            <div id="grp-body-${kToko}" class="space-y-0">
                ${cardsHtml}
            </div>
        `;

        container.appendChild(storeWrapper);
    });
}

/**
 * TOGGLE COLLAPSE / EXPAND GROUP FEED PER TOKO
 */
function toggleStoreGroup(kode) {
    const body = document.getElementById(`grp-body-${kode}`);
    const icon = document.getElementById(`icon-grp-${kode}`);
    if (body && icon) {
        if (body.classList.contains('hidden')) {
            body.classList.remove('hidden');
            icon.classList.add('rotate-180');
        } else {
            body.classList.add('hidden');
            icon.classList.remove('rotate-180');
        }
    }
}

/**
 * TOGGLE DETAIL FAKTOR EKSTERNAL JIKA KATEGORI DIPILIH
 */
function toggleExternalFactors() {
    const katElem = document.getElementById('rcaKategori');
    const wrapper = document.getElementById('wrapperExternalDetail');
    if (katElem && wrapper) {
        if (katElem.value === 'External Factors / Force Majeure') {
            wrapper.classList.remove('hidden');
        } else {
            wrapper.classList.add('hidden');
        }
    }
}

/**
 * 3. SUBMIT LAPORAN RCA (CREATE / UPDATE)
 */
async function handleRcaSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('rcaEditId').value;
    const action = editId ? 'updateReason' : 'saveReason';

    const btnSubmit = document.getElementById('btnSubmitRca');
    const originalBtnHtml = btnSubmit ? btnSubmit.innerHTML : '';
    if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Menyimpan...`;
    }

    const payload = {
        action: action,
        id: editId,
        kodeToko: document.getElementById('rcaKodeToko').value,
        periode: document.getElementById('rcaPeriode').value,
        topik: document.getElementById('rcaTopik').value,
        kategoriRCA: document.getElementById('rcaKategori').value,
        detailEksternal: document.getElementById('rcaDetailEksternal') ? document.getElementById('rcaDetailEksternal').value : '',
        detailRCA: document.getElementById('rcaDetailRCA').value,
        whatWorked: document.getElementById('rcaWhatWorked').value,
        whatDidntWork: document.getElementById('rcaWhatDidntWork').value,
        actionPlan: document.getElementById('rcaActionPlan').value,
        targetRecoveryDate: document.getElementById('rcaTargetDate').value,
        status: document.getElementById('rcaStatus').value
    };

    if (!editId) {
        payload.blocks = [{
            topik: payload.topik,
            kategoriRCA: payload.kategoriRCA,
            detailEksternal: payload.detailEksternal,
            detailRCA: payload.detailRCA,
            whatWorked: payload.whatWorked,
            whatDidntWork: payload.whatDidntWork,
            actionPlan: payload.actionPlan
        }];
    }

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });
        const json = await res.json();

        if (json.status === 'success') {
            alert(json.message || 'Laporan RCA berhasil disimpan!');
            cancelEditMode();
            loadReasonFeed();
        } else {
            alert('Gagal menyimpan: ' + json.message);
        }
    } catch (err) {
        alert('Terjadi kesalahan jaringan saat mengirim data!');
        console.error(err);
    } finally {
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalBtnHtml;
        }
    }
}

/**
 * 4. ISI FORM UNTUK EDIT LAPORAN RCA
 */
function editReason(id) {
    const log = reasonLogs.find(l => String(l.id || l.rowId) === String(id));
    if (!log) return;

    document.getElementById('rcaEditId').value = log.id || log.rowId;
    document.getElementById('rcaKodeToko').value = log.kodeToko;
    document.getElementById('rcaPeriode').value = log.periode;
    document.getElementById('rcaTopik').value = log.topik || 'Overall Sales Toko';
    document.getElementById('rcaKategori').value = log.kategoriRCA;
    
    toggleExternalFactors();
    if (log.detailEksternal && document.getElementById('rcaDetailEksternal')) {
        document.getElementById('rcaDetailEksternal').value = log.detailEksternal;
    }
    
    document.getElementById('rcaDetailRCA').value = log.detailRCA || '';
    document.getElementById('rcaWhatWorked').value = log.whatWorked || '';
    document.getElementById('rcaWhatDidntWork').value = log.whatDidntWork || '';
    document.getElementById('rcaActionPlan').value = log.actionPlan || '';
    document.getElementById('rcaTargetDate').value = log.targetRecoveryDate || '';
    document.getElementById('rcaStatus').value = log.status || 'OPEN';

    const editBadge = document.getElementById('editBadgeInfo');
    const cancelBtn = document.getElementById('btnCancelEdit');
    const submitBtn = document.getElementById('btnSubmitRca');

    if (editBadge) editBadge.classList.remove('hidden');
    if (cancelBtn) cancelBtn.classList.remove('hidden');
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Update Laporan RCA';

    const formElem = document.getElementById('rcaForm');
    if (formElem) {
        window.scrollTo({ top: formElem.offsetTop - 80, behavior: 'smooth' });
    }
}

/**
 * BATALKAN MODE EDIT LAPORAN
 */
function cancelEditMode() {
    document.getElementById('rcaEditId').value = '';
    const formElem = document.getElementById('rcaForm');
    if (formElem) formElem.reset();
    
    updateRcaPeriodeReadonly();
    toggleExternalFactors();

    const editBadge = document.getElementById('editBadgeInfo');
    const cancelBtn = document.getElementById('btnCancelEdit');
    const submitBtn = document.getElementById('btnSubmitRca');

    if (editBadge) editBadge.classList.add('hidden');
    if (cancelBtn) cancelBtn.classList.add('hidden');
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Laporan RCA';
}

/**
 * 5. HAPUS LAPORAN RCA
 */
async function deleteReason(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus laporan RCA ini?')) return;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'deleteReason', id: id })
        });
        const json = await res.json();

        if (json.status === 'success') {
            alert(json.message || 'Laporan RCA berhasil dihapus!');
            loadReasonFeed();
        } else {
            alert('Gagal menghapus: ' + json.message);
        }
    } catch (err) {
        alert('Terjadi kesalahan saat menghapus data!');
        console.error(err);
    }
}