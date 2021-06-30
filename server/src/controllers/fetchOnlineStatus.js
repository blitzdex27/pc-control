const fetch = require('node-fetch');
const { performance } = require('perf_hooks');

module.exports = (unit, clientPort) =>
  new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Timedout: 0.01s').message), 100);
    const t0 = performance.now();
    try {
      const unitC = { ...unit };

      const f = async () => {
        const response = await fetch(`http://${unitC.ip}:${clientPort}`);
        const json = await response.json();
        return json;
      };

      f()
        .then((json) => {
          if (json) {
            unitC.status.online = true;
          } else {
            unitC.status.online = false;
          }
          const t1 = performance.now();
          const perf = (t1 - t0) / 1000;
          console.log(unit.ip, perf.toFixed(2), 'seconds');
          resolve(unit);
        })
        .catch((error) => {
          const t1 = performance.now();
          const perf = (t1 - t0) / 1000;
          console.log('\n', unit.ip, perf.toFixed(2), 'seconds');
          reject(error.message);
        });
    } catch (error) {
      const t1 = performance.now();
      const perf = (t1 - t0) / 1000;
      console.log(unit.ip, perf.toFixed(2), 'seconds');
      reject(error);
    }
  });
