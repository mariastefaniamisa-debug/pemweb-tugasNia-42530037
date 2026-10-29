const express = require('express');
const router = express.Router();
const bukuController = require('../controllers/buku.controller');

router.get('/buku', bukuController.getDaftarBuku);
router.get('/buku/tambah', bukuController.getFormTambah);
router.post('/buku/tambah', bukuController.postTambahBuku);
router.get('/buku/edit/:id', bukuController.getFormEdit);
router.post('/buku/edit/:id', bukuController.postUpdateBuku);
router.post('/buku/hapus/:id', bukuController.postHapusBuku);

module.exports = router;