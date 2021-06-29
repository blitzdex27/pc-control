require('regenerator-runtime');
import app from './app';

const port = 1010;

app.listen(port, '192.168.1.15', () => {
  process.stdout.write(`Listening to port ${port}`);
});
