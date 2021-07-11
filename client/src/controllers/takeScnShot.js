import path from 'path';
import cp from 'child_process';

export default (req, res) => {
  const takeScnShot = cp.spawn('nircmd.exe', ['savescreenshot', 'scnshot.jpg']);

  takeScnShot.on('close', () => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'scnshot.jpg'));
  });
};
