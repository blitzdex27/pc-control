import express from 'express';
import runScript from './runScript';

const app = express();

app.get('/', (req, res) => {
  console.log('listening')
  res.json({ status: 'online' });
});

app.get('/command/:action', (req, res) => {
  const status = runScript(req.params.action);
  res.json({ status });
});

export default app;
