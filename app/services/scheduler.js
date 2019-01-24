const schedule = require('node-schedule');
const ActivationTokens = require('../models/AcitvationTokens');

module.exports = function () {
//     let rule = new schedule.RecurrenceRule();
// //rule.hour = 24;
//     rule.minute = new schedule.Range(0, 1, 0);

    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    // Run scheduler every 24 hours to remove expired tokens (0-23 for hour ranges)
    schedule.scheduleJob("* 23 * * * *", function () {
        // $lt = means less than < (so will find documents less than the value given)
        ActivationTokens.remove({"TokenData.ExpirationDate": {$lt: now}})
            .then(results => {
                console.log('Remove expired token');
                console.log(results);
            }).catch(err => {
            console.log(err);
        })
    })
};