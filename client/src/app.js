import express from 'express';
import runScript from './runScript';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  console.log('listening');
  res.json({ status: 'online' });
});

app.post('/command', (req, res) => {
  runScript(req.bodyaction);

  res.json({ success: true });
});

export default app;
