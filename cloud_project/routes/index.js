var express = require('express');
var aws = require('../aws')();
var util = require('util');
var router = express.Router();

aws.setup();

/* GET home page. */
router.get('/', function(req, res, next) {
  aws.search(req).then(function(result){ res.render('index', {total: result.hits.found, facets: result.facets}); }).catch(function(error){ res.json(error); });
});

router.get('/api/search', function(req, res, next) {
  aws.search(req).then(function(result){ res.render('results', {hits: result.hits.hit, total: result.hits.found, facets: result.facets}); }).catch(function(error){ res.json(error); });
});

router.get('/api/suggest', function(req, res, next) {
  aws.suggest(req.query.q).then(function(result){ res.json(result.suggest.suggestions); }).catch(function(error){ res.json(error); });
});

module.exports = router;
