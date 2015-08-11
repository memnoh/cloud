module.exports = function(){
	var conf = require('./conf');
	var async = require('async');
	var aws = require('aws-sdk');
  var fs = require('fs');
	var searchDomain = null;
	var documentDomain= null;
	var promise = require('bluebird');

	function setup(){
		aws.config.update(conf.aws.credentials);
		searchDomain = new aws.CloudSearchDomain({endpoint: conf.aws.cloudsearch.searchEndpoint});
		documentDomain = new aws.CloudSearchDomain({endpoint: conf.aws.cloudsearch.searchEndpoint});
	}

	function suggest(query){
		var params = {
			query: query,
			suggester: 'title_autocomplete',
			size: 10
		};
		var def = promise.defer();
		searchDomain.suggest(params, function(err, data){
			if(err) {
		      def.reject(err);
		    } else {
		      def.resolve(data);
		    }
		});
		return def.promise;
	}

	function search(req){
		var params = {};
		params.size = req.query.limit || 10;
  		params.start = req.query.start || 0;
  		params.partial = true;
  		params.highlight = {
  			'title': {'format': 'text', 'max_phrases': 5, 'pre_tag': '<mark>', 'post_tag': '</mark>'},
  			'plot': {'format': 'text', 'max_phrases': 5, 'pre_tag': '<mark>', 'post_tag': '</mark>'}
  		};
  		params.highlight = JSON.stringify(params.highlight);
  		params.facet = {
  			'genres': {'sort': 'count'},
  			'rating': {'sort': 'count'},
  			'year': {'sort': 'count'}
  		}
  		params.facet = JSON.stringify(params.facet);
  		params.queryParser = 'simple';
  		var def = promise.defer();

  		if(typeof req.query.q === "undefined" || req.query.q==""){
  			params.queryParser = 'structured';
  			params.query = '(matchall)';
  		}
  		else{
  			params.query = req.query.q;
  		}
  		if(typeof req.query.filter !== "undefined" && req.query.filter!=""){
  			req.query.filter = [].concat(req.query.filter).filter(function(item){return item!="";});
  			var filters = req.query.filter.map(function(obj){
  				var filterField = obj.split(':')[0];
  				var filterValue = obj.split(':')[1];
  				return "(term field=" + filterField + "'" + filterValue +"'" + ")";
  			});
  			var filterString = '(and ' + filters.join(' ') + ')';
  			params.filterQuery = filterString; 
  		}

  		console.log(params);
		searchDomain.search(params, function(err, data) {
		    if(err) {
		      def.reject(err);
		    } else {
		      def.resolve(data);
		    }
 		 });
 		 return def.promise;
	}

	function addMovie(req) {
console.log("addMovie function");
	var def = promise.defer();
  fs.readFile(req.file.path, function(err, data) {
  //fs.readFile(req.file.file.path, function(err, data) {
  //fs.readFile(req.files.file.path, function(err, data) {
    if (err){
		   def.reject(err);
    } 
    else{
          console.log("upload");


var def = promise.defer();
    var params = {
        contentType: "application/json", 
        documents: JSON.stringify(data)
    };


    documentDomain.uploadDocuments(params, function(err, data) {
        if(err) {
          def.reject(err);
        } else {
          def.resolve(data);
        }
     });
         console.log('data '+data);
        //console.log('movie '+movie);
        def.resolve(data);
        //console.log(movie);
    }
});
  console.log('done');
  return def.promise;
}

	/*function upload(req){
console.log("upload function");
console.log(movie);


var def = promise.defer();
		var params = {
  			contentType: "application/json", 
  			documents: JSON.stringify(movie)
		};


		documentDomain.uploadDocuments(params, function(err, data) {
		    if(err) {
		      def.reject(err);
		    } else {
		      def.resolve(data);
		    }
 		 });
		//console.log(movie);
 		return def.promise;
}*/
		return {
		setup: setup,
		suggest: suggest,
		search: search,
    addMovie: addMovie
}}