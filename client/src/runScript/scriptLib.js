import cp from 'child_process';

export const test = () => {
  cp.exec('start www.google.com');
};

export const shutdown = () => {
  cp.exec('shutdown /s');
};

export const restart = () => {
  cp.exec('restart /r');
};

export const update = () => {
  cp.exec('nircmd.exe exec hide update.bat');
};
