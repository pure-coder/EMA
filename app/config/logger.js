const bunyan = require('bunyan');

let bunyanOpts = {
    name: 'fitness_app',
    streams: [
        {
            level: 'debug',
            stream: process.stdout       // log INFO and above to stdout
        },
        {
            level: 'info',
            path: './log/log.json'  // log ERROR and above to a file
        }
    ]
};

module.exports = {
    logger: bunyan.createLogger(bunyanOpts),
};
