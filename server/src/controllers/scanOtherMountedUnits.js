const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

const clientPort = 1010;

const isProd = path.parse(process.argv[1]).name === 'main';

const unitsStatePath = path.resolve(
  __dirname,
  `../${isProd ? '' : '..'}`,
  'data',
  'units.json'
);

const unSlottedUnitsPath = path.resolve(
  __dirname,
  `../${isProd ? '' : '..'}`,
  'data',
  'unSlottedUnits.json'
);

const fetchMountedUnit = (ip) =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve({ status: 'offline', pcName: '', ip }), 1000);

    const f = async () => {
      let response;
      try {
        response = await fetch(`http://${ip}:${clientPort}`);

        const json = await response.json();
        return json;
      } catch (e) {
        // console.log('\nError[fetch]:', ip, e.message);
      }
    };

    f()
      .then((json) => resolve({ ...json, ip }))
      .catch((e) => console.log('\nError[fCatch]', e.message));
  });

const limit = 254;
let ipList = [];

for (let i = 2; i <= limit; i += 1) {
  ipList.push(`192.168.1.${i}`);
}

const existingIpList = JSON.parse(fs.readFileSync(unitsStatePath)).map(
  (unit) => unit.ip
);

ipList = ipList.filter((ip) => !existingIpList.includes(ip));

module.exports = async (req, res) => {
  let responses;
  try {
    responses = await Promise.all(ipList.map((ip) => fetchMountedUnit(ip)));

    responses = responses.filter(
      (response) => response.status === 'online' && true
    );

    const unSlottedUnits = [];

    responses.forEach((response) => {
      const unSlottedUnit = {
        slot: null,
        pcName: response.pcName,
        status: {
          online: true,
          action: null,
          mounted: true,
        },
        ip: response.ip,
      };
      unSlottedUnits.push(unSlottedUnit);
    });

    fs.writeFileSync(
      unSlottedUnitsPath,
      JSON.stringify(unSlottedUnits, null, 2)
    );

    res.json(unSlottedUnits);
  } catch (e) {
    res.json([]);
    // console.log('eer', e.message);
  }
};
