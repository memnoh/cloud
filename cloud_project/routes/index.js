var express = require('express');
var aws = require('../aws')();
var util = require('util');
var router = express.Router();

aws.setup();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/describeMyDomain', function(req, res, next) {
  aws.describeDomain('cloud-project').then(function(result){ res.end(util.inspect(result, false, null)); }).catch(function(error){ res.end(error.toString()); });
});

module.exports = router;
