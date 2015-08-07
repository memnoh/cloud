var conf = {}
conf.aws = {};

conf.aws.credentials = {};
conf.aws.credentials.region = 'eu-west-1';
conf.aws.credentials.accessKeyId = 'secret';
conf.aws.credentials.secretAccessKey = 'secret';

conf.aws.cloudsearch = {};
conf.aws.cloudsearch.doamin = 'cloud-project';
conf.aws.cloudsearch.domainARN = 'arn:aws:cloudsearch:eu-west-1:134271979164:domain/cloud-project';
conf.aws.cloudsearch.searchEndpoint = 'search-cloud-project-n2dfaszjj3s3nvkoxpy24kevsi.eu-west-1.cloudsearch.amazonaws.com';
conf.aws.cloudsearch.documentEndpoint = 'doc-cloud-project-n2dfaszjj3s3nvkoxpy24kevsi.eu-west-1.cloudsearch.amazonaws.com';

module.exports = conf;