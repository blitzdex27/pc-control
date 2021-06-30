const { Router } = require('express');
const unitsStates = require('../controllers/unitsStates');

const router = new Router();

router.get('/', unitsStates);

module.exports = router;
