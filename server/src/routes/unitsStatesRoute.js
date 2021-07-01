const { Router } = require('express');
const unitsStates = require('../controllers/unitsStates');

require('regenerator-runtime');

const router = new Router();

router.get('/', unitsStates);

module.exports = router;
