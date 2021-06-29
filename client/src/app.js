import express from 'express';
import runScript from './runScript';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  console.log('listening');
  res.json({ status: 'online' });
});

app.get('/command', (req, res) => {
  const status = runScript(req.bodyaction);
  console.log('shutting down?');
  if (status) {
    console.log('shutting down');
    res.json({ success: true });
  } else {
    res.status(400);
  }
});

export default app;
