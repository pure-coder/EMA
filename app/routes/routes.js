const ptModel = require('../models/PersonalTrainer');
const clientModel = require('../models/Clients');
const client_progressionModel = require('../models/Client_progression');

// Test to see if an object is empty
function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}



// routes/routes.js
module.exports = function(app, log) {

    /////////////////// GET FOR /index //////////////////
    app.get('/index', (req, res, next) => {
        res.send('Hello this is the index page!')
    });

    /////////////////// GET FOR /Personal_trainer //////////////////
    var Personal_trainer = '/personal_trainer'
    app.get(Personal_trainer, (req, res, next) => {
        res.send('This is the personal trainer page')
    });

    //
    // /////////////////// POST FOR /Personal_trainer //////////////////
    // app.post(Personal_trainer, (req, res, next) => {
    //     const pt = new ptModel(req.body);
    //     let email = req.body.email
    //     ptModel.find({Email : email}, function (err, docs) {
    //         if (docs.length){
    //             console.log('document exists already');
    //             res.redirect('/index')
    //             return
    //         }else{
    //             pt.save(function(err){
    //                 if ( err && err.code !== 11000 ) {
    //                     console.log(err.message);
    //                     //console.log(err.code);
    //                     res.redirect('/index')
    //                     return;
    //                 }
    //                 //duplicate key
    //                 else if ( err && err.code === 11000 ) {
    //                     console.log('error', 'User already exists');
    //                     res.redirect('/index')
    //                     return;
    //                 }
    //                 else{
    //                     console.log('saved successfully')
    //                     res.redirect('/index')
    //                 }
    //             })
    //         }
    //     });
    // });
    //

    // /////////////////// PUT FOR /Personal_trainer //////////////////
    // app.put(Personal_trainer, (req, res, next) =>{ ////////////////////////////
    // // update via email [change this to id from session when set up]
    //     ptModel.findOne({'Email': req.body.Email}, function (err, result){
    //         if(err) console.log(err);
    //         //upsert - creates object if it doesn't exist
    //         ptModel.findOneAndUpdate(result.id, req.body, {upsert:true}, function(err, doc){
    //             if (err) return res.send(err);
    //             return res.send("successfully saved");
    //         });
    //     })
    // }); // Personal_trainer put
    //
    // /////////////////// DELETE FOR /Personal_trainer //////////////////
    // // update via email [change this to id from session when set up]  ////////////////////////////////
    // app.delete(Personal_trainer, (req, res, next) =>{
    //     ptModel.findOne({'Email': req.body.Email}, function (err, result){
    //         if(err) console.log(err);
    //         ptModel.findByIdAndRemove(result.id, function(err, doc){
    //             if (err) return res.send(err);
    //             return res.send("successfully deleted");
    //         });
    //     })
    // }); // Personal_trainer put

    /////////////////// GET FOR /Client //////////////////
    var Client = '/client'
    app.get(Client, (req, res, next) => {
        res.send('This is the client page')
    });

    //
    // /////////////////// POST FOR /Client //////////////////
    // app.post(Client, (req, res, next) => {
    //     const cm = new clientModel(req.body);
    //     let email = req.body.email
    //     // clientModel.find({Email : email}, function (err, docs) {
    //     //     if (docs.length){
    //     //         console.log('document exists already');
    //     //         res.redirect('/index')
    //     //         return
    //     //     }else{
    //             cm.save(function(err){
    //                 if ( err && err.code !== 11000 ) {
    //                     console.log(err.message);
    //                     //console.log(err.code);
    //                     res.redirect('/index')
    //                     return;
    //                 }
    //                 //duplicate key
    //                 else if ( err && err.code === 11000 ) {
    //                     console.log('error', 'User already exists');
    //                     res.redirect('/index')
    //                     return;
    //                 }
    //                 else{
    //                     clientModel.findOneAndUpdate(result.id, req.body, {upsert:true}, function(err, doc){
    //                         if (err) return res.send(err);
    //                         return res.send("successfully saved");
    //                     });
    //                     console.log('saved successfully')
    //                     res.redirect('/index')
    //                 }
    //             })
    //         //}
    //     // });
    // });
    //
    //
    // /////////////////// PUT FOR /Client //////////////////
    // app.put(Client, (req, res, next) =>{ ////////////////////////////
    //     // update via email [change this to id from session when set up]
    //     clientModel.findOne({'Email': req.body.Email}, function (err, result){
    //         if(err) console.log(err);
    //         //upsert - creates object if it doesn't exist
    //         clientModel.findOneAndUpdate(result.id, req.body, {upsert:true}, function(err, doc){
    //             if (err) return res.send(err);
    //             return res.send("successfully saved");
    //         });
    //     })
    // }); // Client put
    //
    // /////////////////// DELETE FOR /Client //////////////////
    // // update via email [change this to id from session when set up]  ////////////////////////////////
    // app.delete(Client, (req, res, next) =>{
    //     clientModel.findOne({'Email': req.body.Email}, function (err, result){
    //         if(err) console.log(err);
    //         clientModel.findByIdAndRemove(result.id, function(err){
    //             if (err) return res.send(err);
    //             return res.send("successfully deleted");
    //         });
    //     })
    // }); // Client put

    /////////////////// GET FOR /Client_Progression //////////////////
    var Client_Progression = '/client_progression'
    app.get(Client_Progression, (req, res, next) => {
        res.send('This is the client progression page')
    });
    //
    //
    // /////////////////// POST FOR /Client_Progression //////////////////
    // app.post('/client_progression', (req, res, next) => {
    //     const cpm = new client_progressionModel(req.body);
    //
    //
    //     client_progressionModel.find({Client_id : req.body.Client_id}, function (err, docs) {
    //         if (docs.length){
    //             console.log('document exists already');
    //             res.redirect('/client_progression')
    //             return
    //         }else{
    //             cpm.save(function(err){
    //                 if ( err && err.code !== 11000 ) {
    //                     console.log(err.message);
    //                     //console.log(err.code);
    //                     res.redirect('/index')
    //                     return;
    //                 }
    //                 //duplicate key
    //                 else if ( err && err.code === 11000 ) {
    //                     console.log('error', 'User already exists');
    //                     res.redirect('/index')
    //                     return;
    //                 }
    //                 else{
    //                     console.log('saved successfully')
    //                     res.redirect('/index')
    //                 }
    //             })
    //         }
    //     });
    // });
    //
    //
    // // /////////////////// PUT FOR /Client_Progression //////////////////
    // // app.put(Client_Progression, (req, res, next) =>{ ////////////////////////////
    // //      update via email [change this to id from session when set up]
    // //     client_progressionModel.findOne({'Email': req.body.Email}, function (err, result){
    // //         if(err) console.log(err);
    // //         //upsert - creates object if it doesn't exist
    // //         client_progressionModel.findOneAndUpdate(result.id, req.body, {upsert:true}, function(err, doc){
    // //             if (err) return res.send(err);
    // //             return res.send("successfully saved");
    // //         });
    // //     })
    // // }); // Client_Progression put
    //
    // /////////////////// DELETE FOR /Client_Progression //////////////////
    // // update via email [change this to id from session when set up]  ////////////////////////////////
    // app.delete(Client_Progression, (req, res, next) =>{
    //     client_progressionModel.findOne({'Client_id': req.body.Client_id}, function (err, result){
    //         if(err) console.log(err);
    //         client_progressionModel.findByIdAndRemove(result.id, function(err){
    //             if (err) return res.send(err);
    //             return res.send("successfully deleted");
    //         });
    //     })
    // }); // Client_Progression put


}; // module exports function
