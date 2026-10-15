const express = require('express');
const router = express.Router();

// Import controller yang baru saja dibuat
const pageController = require('../controllers/page.controller.js');

// Petakan HTTP Method & URL Path ke Fungsi Controller
router.get('/', pageController.getBeranda);
router.get('/katalog', pageController.getKatalog);

module.exports = router;