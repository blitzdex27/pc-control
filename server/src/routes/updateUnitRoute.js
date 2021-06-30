const { Router } = require('express');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

require('regenerator-runtime');

const router = new Router();

const isProd = path.parse(process.argv[1]).name === 'main';
const dataPath = path.resolve(__dirname, `../${isProd ? '' : '..'}`, 'data');
const unitsPath = path.resolve(dataPath, 'units.json');
const unSlottedUnitsPath = path.resolve(dataPath, 'unSlottedUnits.json');

const clientPort = 1010;

router.put('/', async (req, res, next) => {
  try {
    const { action, slot, newslot, ip } = req.query;
    let units = JSON.parse(fs.readFileSync(unitsPath));
    const slotInt = parseInt(slot, 10);
    const newSlotInt = parseInt(newslot, 10);

    if (action === 'modify') {
      console.log('modify');
      let unSlottedUnits = JSON.parse(fs.readFileSync(unSlottedUnitsPath));

      const [unitFromSlotted] = units.filter((unit) => unit.ip === ip);
      if (unitFromSlotted) {
        console.log('slotted', unitFromSlotted);
        unitFromSlotted.slot = newSlotInt;
        units = units.filter((unit) => unit.slot !== newSlotInt);
        units.push(unitFromSlotted);
      }

      const [unitFromUnSlotted] = unSlottedUnits.filter(
        (unit) => unit.ip === ip
      );
      if (unitFromUnSlotted) {
        unitFromUnSlotted.slot = newSlotInt;
        units = units.filter((unit) => unit.slot !== newSlotInt);
        console.log('unslotted', unitFromUnSlotted);
        units.push(unitFromUnSlotted);

        const toDel = unSlottedUnits.findIndex((unit) => unit.ip === ip);
        unSlottedUnits.splice(toDel, 1);
        console.log('uUnits', unSlottedUnits);
      }

      fs.writeFileSync(unitsPath, JSON.stringify(units, null, 2));
      fs.writeFileSync(
        unSlottedUnitsPath,
        JSON.stringify(unSlottedUnits, null, 2)
      );

      return res.status(200).send({ status: 'updated' });
    }

    if (action === 'remove') {
      const updatedUnits = units.filter((unit) => unit.slot !== slotInt);
      fs.writeFileSync(unitsPath, JSON.stringify(updatedUnits, null, 2));
      return res.status(200).send({ status: 'updated' });
    }

    if (action === 'shutdown') {
      console.log('\nshutting down');
      const selUnit = units.find((unit) => unit.slot === slotInt);
      const url = `http://${selUnit.ip}:${clientPort}/command/?action=shutdown`;
      // const result = await pcAction(url);

      const result = await fetch(url);
      const json = await result.json();
      console.log(json);

      if (json.success) {
        units.forEach((unit) => {
          if (unit.slot === slot) {
            // eslint-disable-next-line no-param-reassign
            unit.status.action = 'Shutdown';
          }
        });
        fs.writeFileSync(unitsPath, JSON.stringify(units, null, 2));
        res.status(200).send({ status: 'shutting down' });
      } else {
        res.send(502, { status: 'cannot contact the client computer unit' });
      }
    } else {
      res.status(400).send({ status: 'bad request' });
    }
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
