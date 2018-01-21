const request = require('request');
const interserverAuth = require('./../interserver');

const host = 'http://127.0.0.1:3001'
var servAuth = {appId: "aggr", appSecret: "aggrKey", token: null};

module.exports = {
    getDocById : function(id, callback){
        const url = host+'/doctors/' + id;
		
		console.log('Sending request to doctors serv: GET ' + url);
		
		request.get(url, {method: 'GET', uri: url, auth: {bearer: servAuth.token}}, function(errors, response, body){
			if(errors) {
				console.log('error from request: ' + errors);
				if (errors.code == 'ECONNREFUSED')
					callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			} else {
				if (response.statusCode == 401) {
					interserverAuth.reAuth(host, url, servAuth, function () {
						console.log('Sending token now:'+servAuth.token+';');
						request.get(url, {method: 'GET', uri: url, auth: {bearer: servAuth.token}}, function(errors, response, body){
							if(errors) {
								console.log('error from request: ' + errors);
								if (errors.code == 'ECONNREFUSED')
									callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
							} else {
								console.log('response: ' + body);
								callback(null, response.statusCode, body);
							}
						});
					},
					function () {
						callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
					});
				} else {
					console.log('response: ' + body);
					callback(null, response.statusCode, body);
				}
			}
		});
    },
	
	getSpecs : function(page, size, callback) {
        const url = host+'/specs?page=' + page + '&size=' + size;
		
		console.log('Sending request to doctors serv: GET ' + url);
		
		request.get(url, {method: 'GET', uri: url, auth: {bearer: servAuth.token}}, function(errors, response, body){
			if(errors) {
				console.log('error from request: ' + errors);
				if (errors.code == 'ECONNREFUSED')
					callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			} else {
				if (response.statusCode == 401) {
					interserverAuth.reAuth(host, url, servAuth, function () {
						console.log('Sending token now:'+servAuth.token+';');
						request.get(url, {method: 'GET', uri: url, auth: {bearer: servAuth.token}}, function(errors, response, body){
							if(errors) {
								console.log('error from request: ' + errors);
								if (errors.code == 'ECONNREFUSED')
									callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
							} else {
								console.log('response: ' + body);
								callback(null, response.statusCode, body);
							}
						});
					},
					function () {
						callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
					});
				} else {
					console.log('response: ' + body);
					callback(null, response.statusCode, body);
				}
			}
		});
	},
	
	getDoctorsBySpecId : function(specId, page, size, callback) {
        const url = host+'/doctors?spec=' + specId + '&page=' + page + '&size=' + size;
		
		console.log('Sending request to doctors serv: GET ' + url);
		
		request.get(url, {method: 'GET', uri: url, auth: {bearer: servAuth.token}}, function(errors, response, body){
			if(errors) {
				console.log('error from request: ' + errors);
				if (errors.code == 'ECONNREFUSED')
					callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			} else {
				if (response.statusCode == 401) {
					interserverAuth.reAuth(host, url, servAuth, function () {
						console.log('Sending token now:'+servAuth.token+';');
						request.get(url, {method: 'GET', uri: url, auth: {bearer: servAuth.token}}, function(errors, response, body){
							if(errors) {
								console.log('error from request: ' + errors);
								if (errors.code == 'ECONNREFUSED')
									callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
							} else {
								console.log('response: ' + body);
								callback(null, response.statusCode, body);
							}
						});
					},
					function () {
						callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
					});
				} else {
					console.log('response: ' + body);
					callback(null, response.statusCode, body);
				}
			}
		});
	}
}