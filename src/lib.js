import cp from 'child_process';
import fs from 'fs'

// eslint-disable-next-line import/prefer-default-export
export const runScript = (scriptName) => {
  cp.exec(`"${__dirname}/batchScripts/${scriptName}.bat"`);
  console.log(`"${__dirname}/batchScripts/${scriptName}.bat"`)
};
