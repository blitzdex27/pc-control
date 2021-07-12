const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

const otherMountedUnitsRoute = require('./routes/otherMountedUnitsRoute');
const updateUnitSlot = require('./controllers/updateUnitSlot');

const updateUnitRoute = require('./routes/updateUnitRoute');
const unitsStatesRoute = require('./routes/unitsStatesRoute');

require('regenerator-runtime');

const app = express();

app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const unitsStatePath = path.resolve(__dirname, '..', 'data', 'units.json');

const clientPort = 1010;

app.get('/', (req, res) => {
  res.sendFile('/');
});

app.use('/units-states', unitsStatesRoute);

app.get('/run-command', async (req, res) => {
  try {
    const { ip, cmd } = req.query;

    const response = await fetch(
      `http://${ip}:${clientPort}/run-command/?cmd=${encodeURIComponent(cmd)}`
    );
    const json = await response.json();
    console.log(json);
    res.json(json);
  } catch (e) {
    console.error(e.message);
  }
});

app.get('/take-screenshot', async (req, res) => {
  // const { ip } = req.query;
  const ip = '192.168.1.4';
  console.log('taking scnshot');
  const response = await fetch(`http://${ip}:${clientPort}/take-screenshot`);
  // console.log(response)
  const blob = await response.blob();
  const stream = await blob.stream();
  console.log(blob);

  // fs.writeFileSync(path.resolve(__dirname, '..', 'scnshot.jpg'), response);
  // const file = fs.createReadStream(blob)
  // res.sendFile(path.resolve(__dirname, '..', 'scnshot.jpg'));
  stream.pipe(res);
});

app.use('/update-unit', updateUnitRoute);
app.use('/other-units', otherMountedUnitsRoute);
app.use('/update-unit-slot', updateUnitSlot);

app.use((res, req, next) => next(new Error('Not found')));

app.use((error, req, res, next) => {
  res.status(404).send(`
  <div>
  <h1>Error!</h1>
  <p>Something went wrong</p>
  </div>
  `);
});

module.exports = app;
