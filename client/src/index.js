require('regenerator-runtime');
import app from './app';

const port = 1010;

app.listen(port, () => {
  process.stdout.write(`Listening to port ${port}`);
});
