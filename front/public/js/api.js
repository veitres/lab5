class API {

    constructor() {
        this.host = "http://127.0.0.1:3000";
    }

    requestData(method, httpMethod, params) {
        const url = this.host + '/' + method;
        const httpRequest = {
            method: httpMethod,
			headers: {
				'Content-type': 'application/json',
				'Access-Control-Request-Method': httpMethod
			},
			mode: 'cors',
			body: null
        };
		
        if(httpMethod === 'POST' && typeof params !== 'undefined') {
			httpRequest.body = JSON.stringify(params);
        }

        return fetch(url, httpRequest).then(
			function(response) {
				return response.json();
			},
			function(response) {
				document.getElementsByClassName("error")[0].innerHTML = 'Connection issues: ' + response;
				console.log('Connection issues: ', response);
				return response;
			}
		);
    }

}

const api = new API();