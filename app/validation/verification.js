module.exports = function(Client){
    // Create a random 88 character token
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 88; i > 0; --i){
        token += chars[Math.round(Math.random() * (chars.length - 1))];
    }

    console.log(token)

    // Create client token expiration date to expire in a week (hours in a week is 168)
    let expiration = new Date();
    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    //expiration.setHours(expiration.getHours() + 168);
    expiration.setHours(expiration.getHours() -1);
    expiration.setMinutes(expiration.getMinutes() - expiration.getTimezoneOffset());


    console.log(now);
    console.log(expiration);
    // check expiration is working correctly
    console.log(expiration >= now);

}