const host = 'http://127.0.0.1:3001'

module.exports = {
    getDocById : function(id, callback){
		//const host = 'http://127.0.0.1:3001'
        const url = host+'/doctors/' + id;
        const options = {method: 'GET', uri: url};
        const request = require('request');
		
		console.log('Sending request to doctors serv: GET ' + url);
		
		request.get(url, options, function(errors, response, body){
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
	
	getSpecs : function(page, size, callback) {
		
        //const host = 'http://127.0.0.1:3001'
        const url = host+'/specs?page=' + page + '&size=' + size;
        const options = {method: 'GET', uri: url};
        const request = require('request');
		
		console.log('Sending request to doctors serv: GET ' + url);
		
		request.get(url, options, function(errors, response, body){
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
	
	getDoctorsBySpecId : function(specId, page, size, callback) {
		
        //const host = 'http://127.0.0.1:3001'
        const url = host+'/doctors?spec=' + specId + '&page=' + page + '&size=' + size;
        const options = {method: 'GET', uri: url};
        const request = require('request');
		
		console.log('Sending request to doctors serv: GET ' + url);
		
		request.get(url, options, function(errors, response, body){
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