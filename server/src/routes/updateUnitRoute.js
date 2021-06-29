const { Router } = require('express');
const path = require('path');
const fs = require('fs');

require('regenerator-runtime');

const router = new Router();

const isProd = path.parse(process.argv[1]).name === 'main'

const unitsStatePath = path.resolve(__dirname, `../${isProd ? '' : '..'}`, 'data', 'units.json');


router.put('/', async (req, res, next) => {
  const { action, slot, pcname, ipadd } = req.query;
  const units = JSON.parse(fs.readFileSync(unitsStatePath));
  const slotInt = parseInt(slot, 10);

  if (action === 'modify') {
    const newUnit = {
      slot: slotInt,
      pcName: pcname,
      status: { online: false, action: null, mounted: false },
      ip: ipadd,
    };

    if (units.find((unit) => unit.slot === slotInt)) {
      const toModifyIndex = units.findIndex((unit) => unit.slot === slotInt);
      units.splice(toModifyIndex, 1, newUnit);
    } else {
      units.push(newUnit);
    }

    fs.writeFileSync(unitsStatePath, JSON.stringify(units, null, 2));

    res.status(200).send({ status: 'updated' });
  } else if (action === 'remove') {
    const updatedUnits = units.filter(
      (unit) => unit.slot !== parseInt(slot, 10)
    );
    fs.writeFileSync(unitsStatePath, JSON.stringify(updatedUnits, null, 2));
    res.status(200).send({ status: 'updated' });
  } else if (action === 'shutdown') {
    const ip = units.find((unit) => unit.slot === parseInt(slot, 10));
    const url = `http://${ip}/command/?action=shutdown`;
    const result = await fetch(url);
    const json = await result.parse();
    if (json.success) {
      units.forEach((unit) => {
        if (unit.slot === slot) {
          // eslint-disable-next-line no-param-reassign
          unit.status.action = 'Shutdown';
        }
      });
      fs.writeFileSync(unitsStatePath, units);
      res.status(200).send({ status: 'shutting down' });
    } else {
      res.send(502, { status: 'cannot contact the client computer unit' });
    }
  } else {
    res.send(400, { status: 'bad request' });
  }
});

module.exports = router;
