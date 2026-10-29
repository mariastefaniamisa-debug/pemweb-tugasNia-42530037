const BukuModel = require('../models/buku.model');

const STATUS_VALID = ['tersedia', 'dipinjam', 'rusak'];

// Validasi sederhana sisi server; mengembalikan data bersih atau null
const validasi = (body) => {
    const { judul, penulis, sinopsis, harga_sewa, status, tanggal_terbit } = body;

    if (!judul || !penulis || !harga_sewa || !status || !tanggal_terbit) return null;
    if (!STATUS_VALID.includes(status)) return null;
    if (isNaN(Number(harga_sewa)) || Number(harga_sewa) < 0) return null;

    return {
        judul: judul.trim(),
        penulis: penulis.trim(),
        sinopsis: sinopsis ? sinopsis.trim() : '',
        harga_sewa,
        status,
        tanggal_terbit
    };
};

// READ: daftar buku (mendukung ?cari=...)
exports.getDaftarBuku = async (req, res) => {
    try {
        const cari = req.query.cari ? req.query.cari.trim() : '';
        if (cari) console.log('[PREPARED STATEMENT] Pencarian dengan nilai literal:', [cari]);
        const bukuList = cari ? await BukuModel.cari(cari) : await BukuModel.getAll();

    res.render('pages/buku-list', {
        pageTitle: 'Daftar Buku Perpustakaan',
        bukuList: bukuList,
        cari: cari
    });
} catch (error) {
    console.error('[ERROR getDaftarBuku]:', error);
    res.status(500).send('Terjadi galat internal peladen saat mengambil data.');
    }
};

// CREATE: tampilkan form
exports.getFormTambah = (req, res) => {
    res.render('pages/buku-form-tambah', { pageTitle: 'Form Tambah Buku Baru' });
};

// CREATE: proses simpan (pola PRG)
exports.postTambahBuku = async (req, res) => {
    try {
        const data = validasi(req.body);
        if (!data) {
            return res.status(400).send('Data formulir tidak lengkap atau tidak valid.');
    }

    await BukuModel.create(data);
    console.log(`[DATABASE] Buku "${data.judul}" berhasil di-insert.`);
    res.redirect('/buku');
    } catch (error) {
    console.error('[ERROR postTambahBuku]:', error);
    res.status(500).send('Gagal menyimpan data ke basis data.');
    }
};

// UPDATE: tampilkan form edit (pre-filled)
exports.getFormEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const buku = await BukuModel.getById(id);

    if (!buku) {
        return res.status(404).send('Buku tidak ditemukan.');
    }

    res.render('pages/buku-form-edit', { pageTitle: 'Edit Data Buku', buku: buku });
    } catch (error) {
    console.error('[ERROR getFormEdit]:', error);
    res.status(500).send('Galat internal saat memuat form edit.');
    }
};

// UPDATE: proses simpan perubahan
exports.postUpdateBuku = async (req, res) => {
    try {
        const { id } = req.params;
        const data = validasi(req.body);
    if (!data) {
        return res.status(400).send('Data formulir tidak lengkap atau tidak valid.');
    }

    await BukuModel.update(id, data);
    console.log(`[DATABASE] Record ID ${id} berhasil diperbarui.`);
    res.redirect('/buku');
    } catch (error) {
    console.error('[ERROR postUpdateBuku]:', error);
    res.status(500).send('Gagal memperbarui record data.');
    }
};

// DELETE
exports.postHapusBuku = async (req, res) => {
    try {
    const { id } = req.params;
    const result = await BukuModel.delete(id);

    if (result.affectedRows === 0) {
        console.warn(`[DATABASE] Tidak ada record yang terhapus untuk ID ${id}`);
    } else {
        console.log(`[DATABASE] Record ID ${id} berhasil dihapus.`);
    }

    res.redirect('/buku');
    } catch (error) {
    console.error('[ERROR postHapusBuku]:', error);
    res.status(500).send('Gagal menghapus entitas dari basis data.');
    }
};