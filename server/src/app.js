const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const fetchOnlineStatus = require('./controllers/fetchOnlineStatus');

const updateUnitRoute = require('./routes/updateUnitRoute');

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

app.get('/units-states', async (req, res) => {
  const units = JSON.parse(fs.readFileSync(unitsStatePath, 'UTF-8'));

  try {
    const updatedUnits = await Promise.all(
      units.map((unit) => fetchOnlineStatus(unit, clientPort))
    );

    console.log(updatedUnits);
  } catch (error) {
    console.log('error', error);
  }

  res.json(units);
});

app.get('/run-command', async (req, res) => {
  const { slot, cmd } = req.query;
  console.log(slot, cmd)
  const units = JSON.parse(fs.readFileSync(unitsStatePath));
  console.log(units);
  const {ip} = units.find((unit) => unit.slot === parseInt(slot, 10));
  console.log(ip);
  const response = await fetch(
    `http://${ip}:${clientPort}/run-command/?cmd=${cmd}`
  );
  const json = await response.json();
    console.log(json)
  res.json(json);
});

app.use('/update-unit', updateUnitRoute);

app.use((res, req, next) => {
  res.send(`
  <h1>Error!</h1>
  <p>Something went wrong</p>
  `);
});

module.exports = app;
