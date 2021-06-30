const app = require('./app');

require('regenerator-runtime');

const port = 5000;
process.clientsPort = 1010

app.listen(port, () => {
  process.stdout.write(`Listening at port ${port}`);
});
