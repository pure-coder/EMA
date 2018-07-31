const express = require('express');
// set router so routes can be used
const router = express.Router();

// Require passport to control access to routes
const passport = require('passport');

// @route  GET profile/test
// @desc   Test profile route
// @access Private route
router.get('/personal_trainer',  passport.authenticate('pt_rule', {session: false}),
    (req, res, next) => {
        const errors = {};
        res.json({msg: "Personal Trainer Profile Works"})
});

//Export router so it can work with the main restful api server
module.exports = router;