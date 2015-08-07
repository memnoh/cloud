module.exports = function(){
	var conf = require('./conf');
	var async = require('async');
	var aws = require('aws-sdk');
	var promise = require('bluebird');

	function setup(){
		aws.config.update(conf.aws.credentials);
	}

	return {
		setup: setup,
	}
}