const cp = require("child_process");


const batFile = "test.bat"
cp.exec(`"${__dirname}/batFiles/${batFile}"`);