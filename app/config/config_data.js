if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod_config');
}
else{

    module.exports = require('./db');

}
