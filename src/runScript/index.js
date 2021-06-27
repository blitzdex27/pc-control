import { test, shutdown, restart } from './scriptLib';

const runScript = (scriptName) => {
  switch (scriptName) {
    case 'test':
      test();
      break;
    case 'shutdown':
      shutdown();
      break;
    case 'restart':
      restart();
      break;

    default:
      test();
  }
};
export default runScript;
