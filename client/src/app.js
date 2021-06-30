import express from 'express';
import runScript from './runScript';
import { runCommand, parseToJSObject } from './cmdLib';

require('regenerator-runtime')

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let pcName;

runCommand('set').then(({ stdout, stderr }) => {
  pcName = parseToJSObject(stdout).COMPUTERNAME;
  console.log(pcName);
});

app.get('/', (req, res) => {
  console.log('listening');

  res.json({ status: 'online', pcName });
});

app.get('/command', (req, res) => {
  const status = runScript(req.query.action);
  console.log('shutting down?');
  if (status) {
    console.log('shutting down');
    res.json({ success: true });
  } else {
    res.status(400);
  }
});

app.get('/run-command', async (req, res) => {
  const { stdout, stderr } = await runCommand(req.query.cmd);
  res.json({ stdout, stderr });
});

export default app;
