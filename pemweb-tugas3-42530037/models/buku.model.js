const db = require('../config/database');

const BukuModel = {
  // READ: semua buku
    getAll: async () => {
    const [rows] = await db.execute(
        "SELECT id, judul, penulis, sinopsis, harga_sewa, status, DATE_FORMAT(tanggal_terbit, '%d-%m-%Y') AS tanggal_tampil FROM buku ORDER BY id DESC"
    );
    return rows;
    },

  // READ: pencarian judul atau penulis (parameter dengan placeholder)
    cari: async (kata) => {
        const [rows] = await db.execute(
            "SELECT id, judul, penulis, sinopsis, harga_sewa, status, DATE_FORMAT(tanggal_terbit, '%d-%m-%Y') AS tanggal_tampil FROM buku WHERE judul LIKE CONCAT('%', ?, '%') OR penulis LIKE CONCAT('%', ?, '%') ORDER BY id DESC",
            [kata, kata]
    );
    return rows;
    },

  // READ: satu buku (untuk form edit)
    getById: async (id) => {
        const [rows] = await db.execute(
            "SELECT id, judul, penulis, sinopsis, harga_sewa, status, DATE_FORMAT(tanggal_terbit, '%Y-%m-%d') AS tanggal_terbit FROM buku WHERE id = ?",
            [id]
    );
    return rows[0];
    },

  // CREATE
    create: async (data) => {
        const [result] = await db.execute(
            'INSERT INTO buku (judul, penulis, sinopsis, harga_sewa, status, tanggal_terbit) VALUES (?, ?, ?, ?, ?, ?)',
            [data.judul, data.penulis, data.sinopsis, data.harga_sewa, data.status, data.tanggal_terbit]
    );
    return result;
    },

  // UPDATE
    update: async (id, data) => {
        const [result] = await db.execute(
            'UPDATE buku SET judul = ?, penulis = ?, sinopsis = ?, harga_sewa = ?, status = ?, tanggal_terbit = ? WHERE id = ?',
            [data.judul, data.penulis, data.sinopsis, data.harga_sewa, data.status, data.tanggal_terbit, id]
    );
    return result;
    },

  // DELETE
    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM buku WHERE id = ?', [id]);
        return result;
    }
};

module.exports = BukuModel;