const request = require('request');
const interserverAuth = require('./../interserver');

const host = 'http://127.0.0.1:3004'
var servAuth = {appId: "aggr", appSecret: "aggrKey", token: null};

module.exports = {
    authenticate : function(account, callback){
        const url = host+'/authenticate';
		
		console.log(account);
		//account = JSON.stringify(account);
		console.log('Sending request to auth serv: POST ' + url +' body: '+ account);
		request.post(url, {method: 'POST', uri: url, auth: {bearer: servAuth.token}, json: true, body: account}, function(errors, response, body){
			if(errors) {
				console.log('error from request: ' + errors);
				if (errors.code == 'ECONNREFUSED')
					callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			} else {
				if (response.statusCode == 401) {
					interserverAuth.reAuth(host, url, servAuth, function () {
						console.log('Sending token now:'+servAuth.token+';');
						request.post(url, {method: 'POST', uri: url, auth: {bearer: servAuth.token}, json: true, body: account}, function(errors, response, body){
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
	
	check : function (userId, token, callback) {
		const url = host+'/check/'+userId;
		// json: true,
		console.log('Sending request to auth serv: GET ' + url);
		request.post(url, {method: 'POST', uri: url, auth: {bearer: servAuth.token}, json: true, body: {token: token}}, function(errors, response, body){
			if(errors) {
				console.log('error from request: ' + errors);
				if (errors.code == 'ECONNREFUSED')
					callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			} else {
				if (response.statusCode == 401) {
					interserverAuth.reAuth(host, url, servAuth, function () {
						console.log('Sending token now:'+servAuth.token+';');
						request.post(url, {method: 'POST', uri: url, auth: {bearer: servAuth.token}, json: true, body: {token: token}}, function(errors, response, body){
							if(errors) {
								console.log('error from request: ' + errors);
								if (errors.code == 'ECONNREFUSED')
									callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
							} else {
								console.log('response: ' + body);
								console.dir(body);
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