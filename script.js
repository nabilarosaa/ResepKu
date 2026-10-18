const KUNCI_DATA = 'resepku_data';
const MULAI_KOSONG = true;

const BATAS_BERANDA = 5;

const KATEGORI = {
    sarapan:     { label: 'Sarapan',     warna: '#B8860B', latar: '#fff7e3' },
    makan_siang: { label: 'Makan Siang', warna: '#2F6DB5', latar: '#E6F0FB' },
    pasta:       { label: 'Pasta',       warna: '#7A4AB8', latar: '#EFE6FA' },
    dessert:     { label: 'Dessert',     warna: '#4A7A3C', latar: '#E3F2E1' },
    minuman:     { label: 'Minuman',     warna: '#C2487A', latar: '#FCE4E4' }
};

const dataContoh = [
    {
        id: 1,
        judul: 'Shrimp Chicken Pasta',
        kategori: 'pasta',
        waktu: 40,
        porsi: 2,
        deskripsi: 'Pasta creamy dengan perpaduan udang dan ayam yang gurih',
        bahan: '1 bungkus pasta spaghetti\n150 gram udang\n100 gram ayam fillet\n300 ml susu full cream\n50 gram keju parut',
        langkah: 'Rebus pasta sampai matang\nMasak udang dan ayam\nBuat saus susu, campur semua bahan',
        foto: 'assets/shrimp-chicken-pasta-foto-resep-utama.webp',
        halaman: 'detail_resep.html',
        favorit: true
    },
    {
        id: 2,
        judul: 'Nasi Goreng Kampung',
        kategori: 'sarapan',
        waktu: 20,
        porsi: 2,
        deskripsi: 'Nasi goreng sederhana dengan bumbu bawang dan telur, cocok untuk sarapan.',
        bahan: '2 piring nasi putih\n2 butir telur\n3 siung bawang putih\nKecap manis',
        langkah: 'Tumis bawang putih\nMasukkan telur lalu nasi\nTambahkan kecap dan aduk rata',
        foto: null,
        halaman: '#',
        favorit: false
    },
    {
        id: 3,
        judul: 'Ayam Lada Hitam',
        kategori: 'makan_siang',
        waktu: 30,
        porsi: 3,
        deskripsi: 'Ayam tumis saus lada hitam yang pedas gurih, enak dengan nasi hangat.',
        bahan: '300 gram ayam fillet\n1 bawang bombay\n2 sdm saus tiram\nLada hitam',
        langkah: 'Potong ayam dan tumis sampai matang\nTambahkan bawang bombay\nBumbui dengan saus tiram dan lada hitam',
        foto: null,
        halaman: '#',
        favorit: false
    },
    {
        id: 4,
        judul: 'Pudding Cokelat',
        kategori: 'dessert',
        waktu: 45,
        porsi: 6,
        deskripsi: 'Pudding lembut rasa cokelat yang disajikan dingin.',
        bahan: '1 bungkus agar-agar\n500 ml susu\n3 sdm cokelat bubuk\nGula secukupnya',
        langkah: 'Campur semua bahan dan masak sampai mendidih\nTuang ke cetakan\nDinginkan di kulkas',
        foto: null,
        halaman: '#',
        favorit: false
    },
    {
        id: 5,
        judul: 'Es Teh Lemon',
        kategori: 'minuman',
        waktu: 10,
        porsi: 4,
        deskripsi: 'Teh dingin segar dengan perasan lemon.',
        bahan: '4 kantong teh\n2 buah lemon\nGula dan es batu',
        langkah: 'Seduh teh lalu dinginkan\nTambahkan perasan lemon dan gula\nSajikan dengan es batu',
        foto: null,
        halaman: '#',
        favorit: false
    }
];

let kategoriAktif = 'semua';

function ambilData() {
    try {
        const tersimpan = localStorage.getItem(KUNCI_DATA);
        if (tersimpan) {
            return JSON.parse(tersimpan);
        }
    } catch (e) {
        
    }
    return MULAI_KOSONG ? [] : dataContoh.slice();
}

function simpanData(daftar) {
    try {
        localStorage.setItem(KUNCI_DATA, JSON.stringify(daftar));
    } catch (e) {
        
    }
}

function filterResep(daftar, kategori, kata) {
    const kunci = kata.trim().toLowerCase();
    return daftar.filter(function (r) {
        const cocokKategori = (kategori === 'semua' || r.kategori === kategori);
        const cocokKata = r.judul.toLowerCase().includes(kunci);
        return cocokKategori && cocokKata;
    });
}

function urutkanResep(daftar, mode) {
    const salinan = daftar.slice(); 
    if (mode === 'judul') {
        salinan.sort(function (a, b) { return a.judul.localeCompare(b.judul, 'id'); });
    } else if (mode === 'tercepat') {
        salinan.sort(function (a, b) { return a.waktu - b.waktu; });
    } else {
        salinan.sort(function (a, b) { return b.id - a.id; });
    }
    return salinan;
}

function ambilTerbaru(daftar, jumlah) {
    return urutkanResep(daftar, 'terbaru').slice(0, jumlah);
}

function ambilFavorit(daftar, jumlah) {
    const favorit = daftar.filter(function (r) { return r.favorit === true; });
    return urutkanResep(favorit, 'terbaru').slice(0, jumlah);
}

function judulSudahAda(judul) {
    const kunci = judul.trim().toLowerCase();
    return ambilData().some(function (r) {
        return r.judul.toLowerCase() === kunci;
    });
}

function escapeHtml(teks) {
    return String(teks)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}


function buatKartu(r) {
    const k = KATEGORI[r.kategori] || KATEGORI.sarapan;
    const favorit = (r.favorit === true);

    let gambar;
    if (r.foto) {
        gambar = '<img src="' + r.foto + '" alt="Foto hidangan ' + escapeHtml(r.judul) + '" class="h-40 w-full object-cover">';
    } else {
        gambar = '<div class="flex h-40 items-center justify-center bg-primary/10 text-sm text-primary">Foto resep</div>';
    }

    const tombolFavorit = '<button type="button" class="btn-favorit absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xl shadow"' +
        ' aria-pressed="' + favorit + '"' +
        ' aria-label="' + (favorit ? 'Hapus dari favorit' : 'Jadikan favorit') + '"' +
        ' style="color:' + (favorit ? '#ee6123' : '#999999') + '">' + (favorit ? '&#9829;' : '&#9825;') + '</button>';

    return '' +
        '<article class="relative overflow-hidden rounded-2xl border border-primary/15 bg-white" data-id="' + r.id + '">' +
            gambar +
            tombolFavorit +
            '<div class="p-5">' +
                '<span class="rounded-full border px-3 py-0.5 text-sm" style="color:' + k.warna + ';background:' + k.latar + ';border-color:' + k.warna + '">' + k.label + '</span>' +
                '<h3 class="mt-3 text-lg font-bold">' + escapeHtml(r.judul) + '</h3>' +
                '<p class="mt-1 text-sm text-ink/70">' + r.waktu + ' menit &middot; ' + r.porsi + ' porsi</p>' +
                '<p class="deskripsi mt-3 text-sm" style="display:none">' + escapeHtml(r.deskripsi) + '</p>' +
                '<div class="mt-4 flex flex-wrap items-center gap-4">' +
                    '<a href="' + (r.halaman || '#') + '" class="font-semibold text-primary hover:underline">Lihat resep</a>' +
                    '<button type="button" class="btn-deskripsi text-sm text-ink/70 hover:text-primary">Deskripsi</button>' +
                    '<button type="button" class="btn-hapus ml-auto text-sm text-[#C2487A] hover:underline">Hapus</button>' +
                '</div>' +
            '</div>' +
        '</article>';
}

function buatChip(kunci, label, warna, latar, aktif) {
    return '<button type="button" class="chip rounded-full border px-5 py-1' + (aktif ? ' ring-2 ring-current font-semibold' : '') + '"' +
        ' data-kategori="' + kunci + '"' +
        ' style="color:' + warna + ';background:' + latar + ';border-color:' + warna + '">' + label + '</button>';
}


function tampilNotifikasi(teks, setelahSelesai) {
    $('#notifikasi').stop(true, true).text(teks).fadeIn(200).delay(1200).fadeOut(300, setelahSelesai);
}

$(function () {
    if ($('#daftarTerbaru').length) { initBeranda(); }
    if ($('#formResep').length) { initFormTambah(); }
});

function initBeranda() {

    function isiDaftar($wadah, daftar, animasi) {
        let html = '';
        daftar.forEach(function (r) {
            html += buatKartu(r);
        });
        $wadah.stop(true).html(html);
        if (animasi) {
            $wadah.css('opacity', 0).fadeTo(250, 1);
        } else {
            $wadah.css('opacity', 1);
        }
    }

    function tampilkanBeranda(animasi) {
        const semua = ambilData();
        const adaData = semua.length > 0;
        const kata = ($('#cari').val() || '').trim();

        $('#cari').toggle(adaData);

        if (!adaData) {
            $('#cari').val('');
            $('#bagianCari, #bagianTerbaru, #bagianFavorit, #tidakCocok').hide();
            $('#kosong').stop(true).css('opacity', 0).removeClass('hidden').addClass('flex').fadeTo(200, 1);
            return;
        }
        $('#kosong').addClass('hidden').removeClass('flex');

        if (kata !== '') {
            const hasil = urutkanResep(filterResep(semua, 'semua', kata), 'terbaru');
            $('#bagianTerbaru, #bagianFavorit').hide();
            $('#bagianCari').toggle(hasil.length > 0);
            $('#tidakCocok').toggle(hasil.length === 0);
            isiDaftar($('#daftarCari'), hasil, false);
            return;
        }

        $('#bagianCari, #tidakCocok').hide();

        isiDaftar($('#daftarTerbaru'), ambilTerbaru(semua, BATAS_BERANDA), animasi);
        $('#bagianTerbaru').show();

        const favorit = ambilFavorit(semua, BATAS_BERANDA);
        $('#bagianFavorit').show();
        if (favorit.length === 0) {
            // Ada resep, tapi belum ada yang dijadikan favorit
            $('#daftarFavorit').empty().hide();
            $('#kosongFavorit').show();
        } else {
            $('#kosongFavorit').hide();
            isiDaftar($('#daftarFavorit').show(), favorit, animasi);
        }
    }

    $('#cari').on('input', function () {
        tampilkanBeranda(false);
    });

    $('main').on('click', '.btn-deskripsi', function () {
        $(this).closest('article').find('.deskripsi').slideToggle(200);
    });

    $('main').on('click', '.btn-favorit', function () {
        const id = Number($(this).closest('article').data('id'));
        const daftar = ambilData();
        const resep = daftar.find(function (r) { return r.id === id; });
        if (!resep) { return; }

        resep.favorit = (resep.favorit !== true);
        simpanData(daftar);
        tampilkanBeranda(false);
        tampilNotifikasi(resep.favorit ? 'Ditambahkan ke favorit' : 'Dihapus dari favorit');
    });

    $('main').on('click', '.btn-hapus', function () {
        const $kartu = $(this).closest('article');
        const id = Number($kartu.data('id'));
        const resep = ambilData().find(function (r) { return r.id === id; });
        if (!resep || !confirm('Hapus resep "' + resep.judul + '"?')) { return; }

        $kartu.fadeOut(250, function () {
            simpanData(ambilData().filter(function (r) { return r.id !== id; }));
            tampilkanBeranda(false);
            tampilNotifikasi('Resep dihapus');
        });
    });

    tampilkanBeranda(true);
}

const ATURAN = [
    { id: 'judul',        pesan: 'Judul hidangan minimal 3 karakter.',     cek: function (v) { return v.trim().length >= 3; } },
    { id: 'judul',        pesan: 'Resep dengan judul ini sudah ada.',      cek: function (v) { return !judulSudahAda(v); } },
    { id: 'kategori',     pesan: 'Pilih kategori hidangan.',               cek: function (v) { return v !== ''; } },
    { id: 'waktu_masak',  pesan: 'Waktu masak minimal 1 menit.',           cek: function (v) { return Number(v) >= 1; } },
    { id: 'porsi',        pesan: 'Jumlah porsi minimal 1.',                cek: function (v) { return Number(v) >= 1; } },
    { id: 'deskripsi',    pesan: 'Deskripsi singkat tidak boleh kosong.',  cek: function (v) { return v.trim() !== ''; } },
    { id: 'daftar_bahan', pesan: 'Daftar bahan tidak boleh kosong.',       cek: function (v) { return v.trim() !== ''; } },
    { id: 'langkah',      pesan: 'Langkah memasak tidak boleh kosong.',    cek: function (v) { return v.trim() !== ''; } }
];

function tandaiError($field, pesan) {
    $field.css('border-color', '#dc2626');
    $('<p class="pesan-error mt-1 text-sm text-red-600"></p>')
        .text(pesan)
        .hide()
        .insertAfter($field)
        .slideDown(150);
}

function bersihkanError($field) {
    $field.css('border-color', '');
    $field.next('.pesan-error').slideUp(150, function () { $(this).remove(); });
}

function initFormTambah() {

    $('#formResep').on('input change', 'input, select, textarea', function () {
        bersihkanError($(this));
    });

    $('#formResep').on('submit', function (e) {
        e.preventDefault();

        $('.pesan-error').remove();
        $('#formResep').find('input, select, textarea').css('border-color', '');

        let fieldPertama = null;
        ATURAN.forEach(function (a) {
            const $field = $('#' + a.id);
            const nilai = $field.val() || '';
            if ($field.next('.pesan-error').length) { return; } // satu pesan per field
            if (!a.cek(nilai)) {
                tandaiError($field, a.pesan);
                if (!fieldPertama) { fieldPertama = $field; }
            }
        });

        if (fieldPertama) {
            fieldPertama.trigger('focus');
            return; 
        }

        const daftar = ambilData();
        daftar.push({
            id: Date.now(),
            judul: $('#judul').val().trim(),
            kategori: $('#kategori').val(),
            waktu: Number($('#waktu_masak').val()),
            porsi: Number($('#porsi').val()),
            deskripsi: $('#deskripsi').val().trim(),
            bahan: $('#daftar_bahan').val().trim(),
            langkah: $('#langkah').val().trim(),
            foto: null, backend
            halaman: '#',
            favorit: false
        });
        simpanData(daftar);

        $('#btnSimpan').prop('disabled', true);
        tampilNotifikasi('Resep berhasil disimpan!', function () {
            window.location.href = 'index.html';
        });
    });
}