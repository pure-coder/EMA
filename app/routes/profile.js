const express = require('express');
// set router so routes can be used
const router = express.Router();

// Require passport to control access to routes
const passport_pt = require('passport');
const passport_client = require('passport');
const passport_both = require('passport');

// @route  GET profile/test
// @desc   Test profile route
// @access Public route
router.get('/test/:id/hello', (req, res) => res.json({msg: "Profile Works"}));

// @route  GET profile/test
// @desc   Test profile route
// @access Public route
router.get('/personal-trainer/:id/profile',  passport_pt.authenticate('pt_rule', {session: false}),
    (req, res, next) => {
        res.json({msg: "Personal Trainer Profile Works"})
});

//Export router so it can work with the main restful api server
module.exports = router;