var express = require('express');
var aws = require('../aws')();
var util = require('util');
var fs = require('fs');
var router = express.Router();

aws.setup();

/* GET home page. */
router.get('/', function(req, res, next) {
  aws.search(req).then(function(result){ res.render('index', {total: result.hits.found, facets: result.facets, urlPrefix: '/api/search?'}); }).catch(function(error){ res.json(error); });
});

router.get('/api/search', function(req, res, next) {
  aws.search(req).then(function(result){ res.render('results', {hits: result.hits.hit, total: result.hits.found, previousPageStart: result.hits.start-10, nextPageStart: result.hits.start+10,  facets: result.facets, urlPrefix: req._parsedOriginalUrl._raw+'&'}); }).catch(function(error){ res.json(error); });
});

router.get('/api/suggest', function(req, res, next) {
  aws.suggest(req.query.q).then(function(result){ res.json(result.suggest.suggestions); }).catch(function(error){ res.json(error); });
});

router.post('/api/upload', function(req, res, next) {
  fs.readFile(req.files.file.path, function(err, data) {
  	if (err){
  		res.json(err);
  	}
  	else{
  		aws.upload(data).then(function(result){ res.json(result); }).catch(function(error){ res.json(error); });
  	}
  });
});

module.exports = router;
