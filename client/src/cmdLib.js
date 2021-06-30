import cp from 'child_process';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const exec = promisify(cp.exec);

export const runCommand = async (cmd) => {

  try {
    const { stdout, stderr } = await exec(cmd);

    return { stdout, stderr };
  } catch(e) {
    return {stdout:'', stderr: e.message}
  }

};

export const parseToJSObject = (stdoutString) => {
  const strArr = stdoutString.split('\n');

  const obj = {};

  strArr.forEach((str) => {
    const [prop, value] = str.split('=');
    obj[prop] = value;
  });
  return obj;
};
