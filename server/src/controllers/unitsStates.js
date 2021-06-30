const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const isProd = path.parse(process.argv[1]).name === 'main';

const dataPath = path.resolve(__dirname, `../${isProd ? '' : '..'}`, 'data');
const unitsPath = path.resolve(dataPath, 'units.json');
const unSlottedUnitsPath = path.resolve(dataPath, 'unSlottedUnits.json');

module.exports = async (req, res) => {
  const units = JSON.parse(fs.readFileSync(unitsPath));
  const unSlottedUnits = JSON.parse(fs.readFileSync(unSlottedUnitsPath));

  const updUnits = await Promise.all(
    units.map((unit) => {
      const { ip } = unit;
      const unitC = { ...unit };

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          unitC.status.online = false;
          resolve(unitC);
        }, 2000);

        fetch(`http://${ip}:${process.clientsPort}`)
          .then((response) => response.json())
          .then((json) => {
            resolve({ ...unitC, ...json });
          });
      });
    })
  );

  res.json({ updUnits, unSlottedUnits });
};
