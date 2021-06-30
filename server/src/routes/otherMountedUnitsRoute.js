const { Router } = require('express');

const scanOtherMounteddUnits = require('../controllers/scanOtherMountedUnits');

require('regenerator-runtime');

const router = new Router();

router.get('/', scanOtherMounteddUnits);

module.exports = router;
