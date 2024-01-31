const express = require('express');
const controller = require('../controllers/prihodi');

const router = express.Router();

router.post('/dodaj', controller.dodajPrihod);
router.get('/dohvati', controller.dohvatiPrihode);

module.exports = router;