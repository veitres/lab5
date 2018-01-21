const request = require('request');
const interserverAuth = require('./../interserver');

const host = 'http://127.0.0.1:3002'
var servAuth = {appId: "aggr", appSecret: "aggrKey", token: null};

module.exports = {
    getUserById : function(id, callback) {
		const url = host+'/users/' + id;
        
		console.log('Sending request to users serv: GET ' + url);
		
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
	
	getUserAppointmentsById : function (id, page, size, callback) {
		const url = host+'/users/' + id + '/appointments?page=' + page + '&size=' + size;
		
		console.log('Sending request to users serv: GET ' + url);
		
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
	
	addUserAppointment : function (userId, appointmentId, callback) {
		const url = host+'/users/' + userId + '/appointments?appointmentId=' + appointmentId;
		
		console.log('Sending request to users serv: PATCH ' + url);
	
		request.patch(url, {method: 'PATCH', uri: url, auth: {bearer: servAuth.token}}, function(errors, response, body){
			if(errors) {
				console.log('error from request: ' + errors);
				if (errors.code == 'ECONNREFUSED')
					callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			} else {
				if (response.statusCode == 401) {
					interserverAuth.reAuth(host, url, servAuth, function () {
						console.log('Sending token now:'+servAuth.token+';');
						request.patch(url, {method: 'PATCH', uri: url, auth: {bearer: servAuth.token}}, function(errors, response, body){
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
	
	deleteUserAppointment : function (userId, appointmentId, callback) {
		const url = host+'/users/' + userId + '/appointments?appointmentId=' + appointmentId;
		
		console.log('Sending request to users serv: DELETE ' + url);
	
		request.delete(url, {method: 'DELETE', uri: url, auth: {bearer: servAuth.token}}, function(errors, response, body){
			if(errors) {
				console.log('error from request: ' + errors);
				if (errors.code == 'ECONNREFUSED')
					callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			} else {
				if (response.statusCode == 401) {
					interserverAuth.reAuth(host, url, servAuth, function () {
						console.log('Sending token now:'+servAuth.token+';');
						request.delete(url, {method: 'DELETE', uri: url, auth: {bearer: servAuth.token}}, function(errors, response, body){
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