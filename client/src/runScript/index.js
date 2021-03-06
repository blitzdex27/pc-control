import { test, shutdown, restart, update } from './scriptLib';

const runScript = (scriptName) => {
  let status = null;
  switch (scriptName) {
    case 'test':
      test();
      status = 'Testing';
      break;
    case 'shutdown':
      shutdown();
      status = 'Shutting down';
      break;
    case 'restart':
      restart();
      status = 'Restarting';
      break;
    case 'update':
      update();
      status = 'Updating';
      break;

    default:
      status = null;
  }
  return status;
};
export default runScript;
