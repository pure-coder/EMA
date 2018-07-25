const express = require('express');
// set router so routes can be used
const router = express.Router();

// @route  GET progression/test
// @desc   Test progression route
// @access Public route
router.get('/test', (req, res) => res.json({msg: "Progression Works"}));

//Export router so it can work with the main restful api server
module.exports = router;