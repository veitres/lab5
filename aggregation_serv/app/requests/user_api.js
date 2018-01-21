const host = 'http://127.0.0.1:3002'
		
module.exports = {
    getUserById : function(id, callback) {
		//const host = 'http://127.0.0.1:3002'
		const url = host+'/users/' + id;
        const request = require('request');
		
		console.log('Sending request to users serv: GET ' + url);
		
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
	
	getUserAppointmentsById : function (id, page, size, callback) {
		//const host = 'http://127.0.0.1:3002'
		const url = host+'/users/' + id + '/appointments?page=' + page + '&size=' + size;
		const request = require('request');
		
		console.log('Sending request to users serv: GET ' + url);
		
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
	
	addUserAppointment : function (userId, appointmentId, callback) {
		//const host = 'http://127.0.0.1:3002'
		const url = host+'/users/' + userId + '/appointments?appointmentId=' + appointmentId;
		const request = require('request');
		
		console.log('Sending request to users serv: PATCH ' + url);
	
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
	
	deleteUserAppointment : function (userId, appointmentId, callback) {
		//const host = 'http://127.0.0.1:3002'
		const url = host+'/users/' + userId + '/appointments?appointmentId=' + appointmentId;
		const request = require('request');
		
		console.log('Sending request to users serv: DELETE ' + url);
	
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