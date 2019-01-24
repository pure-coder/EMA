const bunyan = require('bunyan');

module.exports = {
    logger: bunyan.createLogger({name: "fitness_app"}),
};