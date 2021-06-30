const { Router } = require('express');
const path = require('path');
const fs = require('fs');

const router = new Router();

const isProd = path.parse(process.argv[1]).name === 'main';

const dataPath = path.resolve(__dirname, `../${isProd ? '' : '..'}`, 'data');
const unitsPath = path.resolve(dataPath, 'units.json');
const unSlottedUnitsPath = path.resolve(dataPath, 'unSlottedUnits.json');

/**
 * Patch by giving ip and slot query value
 */
router.put('/', (req, res) => {
  const units = JSON.parse(fs.readFileSync(unitsPath));
  const unSlottedUnits = JSON.parse(fs.readFileSync(unSlottedUnitsPath));

  const { ip, slot } = req.query;

  const toBeSlottedInd = unSlottedUnits.findIndex((unit) => unit.ip === ip);
  const [toBeSlottedUnit] = unSlottedUnits.splice(toBeSlottedInd, 1);

  toBeSlottedUnit.slot = slot;

  units.push(toBeSlottedUnit);

  fs.writeFileSync(unitsPath, JSON.stringify(units, null, 2));
  fs.writeFileSync(
    unSlottedUnitsPath,
    JSON.stringify(unSlottedUnitsPath, null, 2)
  );

  res.status(200).json({ success: true });
});

module.exports = router;
