const express = require('express');
const path = require('path');
const fs = require('fs');


const updateUnitRoute = require('./routes/updateUnitRoute');

require('regenerator-runtime');

const app = express();

app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const unitsStatePath = path.resolve(__dirname, '..', 'data', 'units.json');

app.get('/', (req, res) => {
  res.sendFile('/');
});

app.get('/units-states', (req, res) => {
  const units = fs.readFileSync(unitsStatePath, 'UTF-8');
  res.json(JSON.parse(units));
});

app.use('/update-unit', updateUnitRoute);

module.exports = app;
