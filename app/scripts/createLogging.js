let fs = require('fs');

let dir = '../log';
let fileName = '../log/log.json';

// Create log directory.
fs.mkdir(dir, { recursive: true }, (err) => {
    if(err) throw err;
});

// Create log.json file for logging data
fs.writeFile(fileName, '', (err) => {
    if(err) throw err;
    console.log("log file created!");
});
