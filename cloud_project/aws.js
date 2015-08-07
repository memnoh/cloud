module.exports = function(){
	var conf = require('./conf');
	var async = require('async');
	var aws = require('aws-sdk');
	var promise = require('bluebird');

	function setup(){
		aws.config.update(conf.aws.credentials);
	}

	function describeDomain(domainName){
		var cloudsearch = new aws.CloudSearch();
		var def = promise.defer();
		var params = {DomainNames: [domainName]};
		cloudsearch.describeDomains(params, function(err, data){
			if (err){
				def.reject(err);
			}
			else{
				def.resolve(data);
			}
		});
		return def.promise;
	}

	return {
		setup: setup,
		describeDomain: describeDomain
	}
}