const request = require('request');
const interserverAuth = require('./../interserver');

const host = 'http://127.0.0.1:3003'
var appointmentServAuth = {appId: "aggr", appSecret: "aggrKey", token: null};

module.exports = {
    getStatus : function(callback) {
		const url = host+'/status/';

		console.log('Requesting appointments serv status: GET ' + url);
		
		request.get(url, {method: 'GET', uri: url}, function(errors, response, body){
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
	
	getAppointmentsByDocId : function(docId, page, size, callback){
		
        //const host = 'http://127.0.0.1:3003'
		const url = host+'/appointments?docId=' + docId + '&page=' + page + '&size=' + size;
		
		console.log('Sending request to appointments serv: GET ' + url);
		
		request.get(url, {method: 'GET', uri: url, auth: {bearer: appointmentServAuth.token}}, function(errors, response, body){
			if(errors) {
				console.log('error from request: ' + errors);
				if (errors.code == 'ECONNREFUSED')
					callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			} else {
				if (response.statusCode == 401) {
					interserverAuth.reAuth(host, url, appointmentServAuth, function () {
						console.log('Sending token now:'+appointmentServAuth.token+';');
						request.get(url, {method: 'GET', uri: url, auth: {bearer: appointmentServAuth.token}}, function(errors, response, body){
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
	
	getAppointmentById : function(id, callback){
		
        //const host = 'http://127.0.0.1:3003'
        const url = host+'/appointments/' + id;
        
		console.log('Sending request to appointments serv: GET ' + url);
		
		request.get(url, {method: 'GET', uri: url, auth: {bearer: appointmentServAuth.token}}, function(errors, response, body){
			if(errors) {
				console.log('error from request: ' + errors);
				if (errors.code == 'ECONNREFUSED')
					callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			} else {
				if (response.statusCode == 401) {
					interserverAuth.reAuth(host, url, appointmentServAuth, function () {
						console.log('Sending token now:'+appointmentServAuth.token+';');
						request.get(url, {method: 'GET', uri: url, auth: {bearer: appointmentServAuth.token}}, function(errors, response, body){
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
	
	setAppointmentLocked : function(id, callback){
		
        //const host = 'http://127.0.0.1:3003'
        const url = host+'/appointments/' + id;
       
		console.log('Sending request to appointments serv: PATCH ' + url);
		
		request.patch(url, {method: 'PATCH', uri: url, auth: {bearer: appointmentServAuth.token}}, function(errors, response, body){
			if(errors) {
				console.log('error from request: ' + errors);
				if (errors.code == 'ECONNREFUSED')
					callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			} else {
				if (response.statusCode == 401) {
					interserverAuth.reAuth(host, url, appointmentServAuth, function () {
						console.log('Sending token now:'+appointmentServAuth.token+';');
						request.patch(url, {method: 'PATCH', uri: url, auth: {bearer: appointmentServAuth.token}}, function(errors, response, body){
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
	
	setAppointmentUnLocked : function(id, callback){
		
        //const host = 'http://127.0.0.1:3003'
        const url = host+'/appointments/' + id;
      
		console.log('Sending request to appointments serv: DELETE ' + url);
		
		request.delete(url, {method: 'DELETE', uri: url, auth: {bearer: appointmentServAuth.token}}, function(errors, response, body){
			if(errors) {
				console.log('error from request: ' + errors);
				if (errors.code == 'ECONNREFUSED')
					callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			} else {
				if (response.statusCode == 401) {
					interserverAuth.reAuth(host, url, appointmentServAuth, function () {
						console.log('Sending token now:'+appointmentServAuth.token+';');
						request.delete(url, {method: 'DELETE', uri: url, auth: {bearer: appointmentServAuth.token}}, function(errors, response, body){
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