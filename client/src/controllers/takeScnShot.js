import path from 'path';
import cp from 'child_process';
import fs from 'fs';

export default (req, res) => {
  console.log('taking scnshot?');
  const takeScnShot = cp.spawn('nircmd.exe', ['savescreenshot', 'scnshot.jpg']);

  takeScnShot.on('close', () => {
    const file = fs.createReadStream(
      path.resolve(__dirname, '..', '..', 'scnshot.jpg')
    );
    console.log(file);
    file.pipe(res);
  });
};
