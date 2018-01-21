const host = 'http://127.0.0.1:3003'

module.exports = {
    getStatus : function(callback) {
		const url = host+'/status/';
		const request = require('request');

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
		const request = require('request');

		console.log('Sending request to appointments serv: GET ' + url);
		
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
	
	getAppointmentById : function(id, callback){
		
        //const host = 'http://127.0.0.1:3003'
        const url = host+'/appointments/' + id;
        const request = require('request');

		console.log('Sending request to appointments serv: GET ' + url);
		
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
	
	setAppointmentLocked : function(id, callback){
		
        //const host = 'http://127.0.0.1:3003'
        const url = host+'/appointments/' + id;
        const request = require('request');
		
		console.log('Sending request to appointments serv: PATCH ' + url);
		
		request.patch(url, {method: 'PATCH', uri: url}, function(errors, response, body){
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
	
	setAppointmentUnLocked : function(id, callback){
		
        //const host = 'http://127.0.0.1:3003'
        const url = host+'/appointments/' + id;
        const request = require('request');
		
		console.log('Sending request to appointments serv: DELETE ' + url);
		
		request.delete(url, {method: 'DELETE', uri: url}, function(errors, response, body){
			if(errors) {
				console.log('error from request: ' + errors);
				if (errors.code == 'ECONNREFUSED')
					callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			} else {
				console.log('response: ' + body);
				callback(null, response.statusCode, body);
			}
		});
    }
}