const schedule = require('node-schedule');
const ActivationTokens = require('../models/AcitvationTokens');

module.exports = function() {
//     let rule = new schedule.RecurrenceRule();
// //rule.hour = 24;
//     rule.minute = new schedule.Range(0, 1, 0);

    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    schedule.scheduleJob("1 * * * * *", function () {
        // $lt = means less than < (so will find documents less than the value given)
        ActivationTokens.remove({"TokenData.ExpirationDate": {$lt: now }})
            .then(results => {
                console.log(results);
            })
    })
}