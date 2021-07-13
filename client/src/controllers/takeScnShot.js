import path from 'path';
import cp from 'child_process';
import fs from 'fs';

const isProd = path.parse(process.argv[1]).name === 'main';

const imgPath = path.resolve(__dirname, `../${isProd ? '' : '..'}`, 'scn.jpg');

export default (req, res) => {
  console.log('taking scnshot?');
  const takeScnShot = cp.spawn('nircmd.exe', ['savescreenshot', 'scn.jpg']);

  takeScnShot.on('close', () => {
    const file = fs.createReadStream(imgPath);
    // console.log(file);
    file.pipe(res);
  });
};
