const app = require('./app');

require('regenerator-runtime');

const port = 5000;

app.listen(port, () => {
  process.stdout.write(`Listening at port ${port}`);
});
