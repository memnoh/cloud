module.exports = function(){
	var conf = require('./conf');
	var async = require('async');
	var aws = require('aws-sdk');
	var searchDomain = null;
	var promise = require('bluebird');

	function setup(){
		aws.config.update(conf.aws.credentials);
		searchDomain = new aws.CloudSearchDomain({endpoint: conf.aws.cloudsearch.searchEndpoint});
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

	return {
		setup: setup,
		suggest: suggest,
		search: search
	}
}