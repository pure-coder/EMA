const PersonalTrainerModel = require('..models/PersonalTrainer');

async function getAllClients() {
    return PersonalTrainerModel.find({}).sort({created: -1});
}


async function getOne(clientID) {
    return PersonalTrainerModel.findOne({_id: clientID})
}

module.exports = {
    getAllClients,
    getOne,

}