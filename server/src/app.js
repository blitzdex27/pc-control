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
  const { slot, cmd } = req.query;
  console.log(slot, cmd);
  const units = JSON.parse(fs.readFileSync(unitsStatePath));
  console.log(units);
  const { ip } = units.find((unit) => unit.slot === parseInt(slot, 10));
  console.log(ip);
  const response = await fetch(
    `http://${ip}:${clientPort}/run-command/?cmd=${cmd}`
  );
  const json = await response.json();
  console.log(json);
  res.json(json);
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
