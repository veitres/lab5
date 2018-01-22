const express = require('express');
const router = express.Router();
const request = require('request');

const userReq = require('../requests/user_api');
const docReq = require('../requests/doc_api');
const appointmentReq = require('../requests/appointment_api');
const authReq = require('../requests/auth_api');

const valid = require('../valid');

const amqp = require('amqplib/callback_api');
var ampqConn = null;

const queueCheckInterval = 50000;

module.exports = (app) => {
  app.use('/', router);
};

var queue = 'appointments_to_free';
function addAppointmentIdToQueue(id) {
  amqp.connect('amqp://localhost', function(err, conn){
    conn.createChannel(function(err, ch){

	  console.log('Appointment ID: ' + id + ' added to queue [' + queue + ']');
      ch.assertQueue(queue, {durable : false});
      ch.sendToQueue(queue, Buffer.from(id));
      
	  setTimeout(function() {
		  ch.close(); 
		  conn.close();
	  },500);
	  
    });
  });
}

function receiveAppointmentIdFromQueue(){
	amqp.connect('amqp://localhost', function(err, conn){
		conn.createChannel(function(err, ch){
			ch.assertQueue(queue, {durable : false});
			ch.get(queue, {noAck : true},
				function(err, appointmentId){	
					console.log('QErr: ' + err + ' QId: ' + appointmentId);
					if (!appointmentId) {
						return;
					} else {
						setTimeout( receiveAppointmentIdFromQueue, 10);
					}
					
					appointmentId = appointmentId.content;
					console.log('FromQueue: ' + appointmentId);
			
					appointmentReq.setAppointmentUnLocked(appointmentId, function(err, responseCode, body){
						if (err || responseCode == 500) {
							addAppointmentIdToQueue(appointmentId);
						} else {
							console.log('Apppointment Id '+ appointmentId + ' processed with result: ('+responseCode+') ' + body);
						}
					});
				}
			);
		});
	});
}

// setInterval(function(){
	// appointmentReq.getStatus(function(err, responseCode, body){
		// if (responseCode == 200) receiveAppointmentIdFromQueue();
	// });
// }, queueCheckInterval);


router.get('/users/:id', (req, res, next) => {
	console.log('***\n\n' + new Date() + '\n: ' + 'asking Users serv for user ' + req.params.id);
	
	let id = req.params.id;
	valid.checkCorrectIntVal(id,
		function () {return res.status(400).send({error: "User ID required"});},
		function () {return res.status(400).send({error: "User ID is incorrect"});}
	);
	if (res.headersSent) return;
	
	
	
	let authHeader = req.get('authorization');
	if (typeof (authHeader) == 'undefined') return res.status(401).send({error: "No auth token specified"});
	if (res.headersSent) return;	
	
	let authToken = authHeader.split(' ')[1];
	console.log('\n-\nAuth token:' + authToken + ';');
	authReq.check(id, authToken, function (err, responseCode, body) {
		body = JSON.parse(body);
		if (err || typeof(body.errCode) != 'undefined') {
			console.log('AuthFailed');
			if (!res.headersSent) return res.status(body.errCode).send(body.error);
		}
	});
	if (res.headersSent) return;
	console.log('AuthSuccsess');
	
	
	if (res.headersSent) return;
	userReq.getUserById(id, function(err, responseCode, body){
		if (!res.headersSent) return res.status(responseCode).send(JSON.parse(body));
	});
});

router.get('/users/:id/appointments', (req, res, next) => {
	console.log('***\n\n' + new Date() + '\n: ' + 'asking Users serv for appointments of user ' + req.params.id);
	
	let id = req.params.id;
	valid.checkCorrectIntVal(id,
		function () {return res.status(400).send({error: "User ID required"});},
		function () {return res.status(400).send({error: "User ID is incorrect"});}
	);
	if (res.headersSent) return;
	
	let page = req.query.page;
	valid.checkCorrectIntVal(page,
		function () { page = 0; },
		function () { return res.status(400).send({error: "\'page\' parameter incorrect"}); }
	);
	if (res.headersSent) return;
	
	let size = req.query.size;
	valid.checkCorrectIntVal(size,
		function () { size = 20; },
		function () { return res.status(400).send({error: "\'size\' parameter incorrect"}); }
	);
	if (res.headersSent) return;
	

	
	let authHeader = req.get('authorization');
	if (typeof (authHeader) == 'undefined') return res.status(401).send({error: "No auth token specified"});
	if (res.headersSent) return;	
	
	let authToken = authHeader.split(' ')[1];
	console.log('\n-\nAuth token:' + authToken + ';');
	authReq.check(id, authToken, function (err, responseCode, body) {
		body = JSON.parse(body);
		if (err || typeof(body.errCode) != 'undefined') {
			console.log('AuthFailed');
			if (!res.headersSent) return res.status(body.errCode).send(body.error);
		}
	});
	if (res.headersSent) return;
	console.log('AuthSuccsess');
	
	
	
	userReq.getUserAppointmentsById(id, page, size, function(err, responseCode, body){
		if (err || responseCode != 200)
			res.status(responseCode).send(JSON.parse(body));
		else {
			let result = JSON.parse(body);
			let counter = 0;
			
			// sending result if forEach never started
			if (result.rows.length == 0) {
				console.log('No need to send any reqs');
				if (!res.headersSent) return res.status(200).send(result);
			}
			
			//rendering appointments ids to full info
			result.rows.forEach(function (item, index) {
				appointmentReq.getAppointmentById(item.id, function (errors, responseCode, body) {
					if (errors || responseCode != 200) {
						// sending result if appointments server not answered
						console.log('fixing appointment connect error. Counter: ' + (counter+1));
						if (++counter == result.rows.length && !res.headersSent) return res.status(200).send(result);
					} else {
						result.rows[index] = JSON.parse(body);
						
						//transforming docId into full doc info
						docReq.getDocById(result.rows[index].docId, function (error, responseCode, body) {
							if(error || responseCode != 200) {
								console.log('Cannot reach doc serv');
							} else {
								result.rows[index].doc = JSON.parse(body); // adding new doc field into result by body of request
								delete result.rows[index].docId;		   // removing used docId form result
							}
					
							// sending result if all necessary requests were send to appointment serv
							if (++counter == result.rows.length && !res.headersSent) return res.status(200).send(result);
						});
					}
				});
			});
		}
	});
});

router.patch('/users/:id/appointments', (req, res, next) => {
	console.log('***\n\n' + new Date() + '\n: ' + 'asking Appointment serv to lock appointment' + req.query.appointmentId);
	
	let id = req.params.id;
	valid.checkCorrectIntVal(id,
		function () {return res.status(400).send({error: "User ID required"});},
		function () {return res.status(400).send({error: "User ID is incorrect"});}
	);
	if (res.headersSent) return;
	
	let appointmentId = req.query.appointmentId;
	valid.checkCorrectIntVal(appointmentId,
		function () {return res.status(400).send({error: "appointmentId parameter required"});},
		function () {return res.status(400).send({error: "appointmentId parameter is incorrect"});}
	);
	if (res.headersSent) return;
	
	
	
	let authHeader = req.get('authorization');
	if (typeof (authHeader) == 'undefined') return res.status(401).send({error: "No auth token specified"});
	if (res.headersSent) return;	
	
	let authToken = authHeader.split(' ')[1];
	console.log('\n-\nAuth token:' + authToken + ';');
	authReq.check(id, authToken, function (err, responseCode, body) {
		body = JSON.parse(body);
		if (err || typeof(body.errCode) != 'undefined') {
			console.log('AuthFailed');
			if (!res.headersSent) return res.status(body.errCode).send(body.error);
		}
	});
	if (res.headersSent) return;
	console.log('AuthSuccsess');
	
	
		
	appointmentReq.setAppointmentLocked(appointmentId, function(err, responseCode, body){
		if (err || responseCode != 200) 
			res.status(responseCode).send(JSON.parse(body));
		else {
			console.log('asking User serv to add appointment' + appointmentId + ' for user ' + id);
			
			userReq.addUserAppointment(id, appointmentId, function(err, responseCode, body){
				if (err || responseCode != 200) {
					console.log('Got ' + responseCode + ' from User server, so asking Appointment serv to revert appointment' + appointmentId);
					appointmentReq.setAppointmentUnLocked(appointmentId, function(err, responseCode, body){});
					res.status(responseCode).send(JSON.parse(body));
				} else {
					res.status(200).send(JSON.parse(body));
				}
			});
		}
	});
});

router.delete('/users/:id/appointments', (req, res, next) => {
	console.log('***\n\n' + new Date() + '\n: ' + 'asking User serv to delete appointment' + req.query.appointmentId + ' for user ' + req.params.id);
	
	let id = req.params.id;
	valid.checkCorrectIntVal(id,
		function () {return res.status(400).send({error: "User ID required"});},
		function () {return res.status(400).send({error: "User ID is incorrect"});}
	);
	if (res.headersSent) return;
	
	
	let appointmentId = req.query.appointmentId;
	valid.checkCorrectIntVal(appointmentId,
		function () {return res.status(400).send({error: "appointmentId parameter required"});},
		function () {return res.status(400).send({error: "appointmentId parameter is incorrect"});}
	);
	if (res.headersSent) return;
	
	
	
	let authHeader = req.get('authorization');
	if (typeof (authHeader) == 'undefined') return res.status(401).send({error: "No auth token specified"});
	if (res.headersSent) return;	
	
	let authToken = authHeader.split(' ')[1];
	console.log('\n-\nAuth token:' + authToken + ';');
	authReq.check(id, authToken, function (err, responseCode, body) {
		body = JSON.parse(body);
		if (err || typeof(body.errCode) != 'undefined') {
			console.log('AuthFailed');
			if (!res.headersSent) return res.status(body.errCode).send(body.error);
		}
	});
	if (res.headersSent) return;
	console.log('AuthSuccsess');
	
	
	
	userReq.deleteUserAppointment(id, appointmentId, function(err, responseCode, body){
		if (err || responseCode != 200) 
			res.status(responseCode).send(JSON.parse(body));
		else {
			appointmentReq.setAppointmentUnLocked(appointmentId, function(err, responseCode, body){
				if (err || responseCode != 200) {
					addAppointmentIdToQueue(appointmentId);
					res.status(202).send({result: 1});
				} else {
					res.status(200).send(JSON.parse(body));
				}
			});
		}
	});
});

router.get('/appointments', (req, res, next) => {
	console.log('***\n\n' + new Date() + '\n: ' + 'asking Appointments serv for appointments of docId ' + req.params.docId);
	
	let docId = req.query.docId;
	valid.checkCorrectIntVal(docId,
		function () {return res.status(400).send({error: "docId parameter required"});},
		function () {return res.status(400).send({error: "docId parameter is incorrect"});}
	);
	if (res.headersSent) return;
	
	
	let page = req.query.page;
	valid.checkCorrectIntVal(page,
		function () { page = 0; },
		function () { return res.status(400).send({error: "\'page\' parameter incorrect"}); }
	);
	if (res.headersSent) return;
	
	
	let size = req.query.size;
	valid.checkCorrectIntVal(size,
		function () { size = 20; },
		function () { return res.status(400).send({error: "\'size\' parameter incorrect"}); }
	);	
	if (res.headersSent) return;
	
	
	appointmentReq.getAppointmentsByDocId(docId, page, size, function(err, responseCode, body){
		res.status(responseCode).send(JSON.parse(body));
	});
});

router.get('/specs', (req, res, next) => {
	console.log('***\n\n' + new Date() + '\n: ' + 'asking Doc serv for specs');
	
	let page = req.query.page;
	valid.checkCorrectIntVal(page,
		function () { page = 0; },
		function () { return res.status(400).send({error: "\'page\' parameter incorrect"}); }
	);
	if (res.headersSent) return;
	
	
	let size = req.query.size;
	valid.checkCorrectIntVal(size,
		function () { size = 20; },
		function () { return res.status(400).send({error: "\'size\' parameter incorrect"}); }
	);
	if (res.headersSent) return;
	
	
	docReq.getSpecs(page, size, function(err, responseCode, body){
		res.status(responseCode).send(JSON.parse(body));
	});
});

router.get('/doctors', (req, res, next) => {
	console.log('***\n\n' + new Date() + '\n: ' + 'asking Doc serv for doctors of spec: ' + req.query.spec);
	
	let spec = req.query.spec;
	valid.checkCorrectIntVal(spec,
		function () {return res.status(400).send({error: "spec parameter required"});},
		function () {return res.status(400).send({error: "spec parameter is incorrect"});}
	);
	if (res.headersSent) return;
	
	
	let page = req.query.page;
	valid.checkCorrectIntVal(page,
		function () { page = 0; },
		function () { return res.status(400).send({error: "\'page\' parameter incorrect"}); }
	);
	if (res.headersSent) return;
	
	
	let size = req.query.size;
	valid.checkCorrectIntVal(size,
		function () { size = 20; },
		function () { return res.status(400).send({error: "\'size\' parameter incorrect"}); }
	);	
	if (res.headersSent) return;
	
	
	docReq.getDoctorsBySpecId(spec, page, size, function(err, responseCode, body){
		res.status(responseCode).send(JSON.parse(body));
	});
});

router.get('/doctors/:id', (req, res, next) => {
	console.log('***\n\n' + new Date() + '\n: ' + 'asking Doc serv for info on doc ' + req.params.id);
	
	let id = req.params.id;
	valid.checkCorrectIntVal(id,
		function () {return res.status(400).send({error: "Doctor ID required"});},
		function () {return res.status(400).send({error: "Doctor ID is incorrect"});}
	);
	if (res.headersSent) return;
	
	
	docReq.getDocById(id, function (err, responseCode, body) {
		res.status(responseCode).send(JSON.parse(body));
	});
});

router.post('/authenticate', (req, res, next) => {
	console.log('***\n\n' + new Date() + ':\n' + 'Got request for authenticate');
	
	let login = req.body.login;
	if (typeof(login) == 'undefined') return res.status(400).send({error: "Login not specified"});
	
	let password = req.body.password;
	if (typeof(password) == 'undefined') return res.status(400).send({error: "Password not specified"});
	
	console.log(typeof (req.body));
	console.dir(req.body);
	authReq.authenticate(req.body, function (err, responseCode, body) {
		res.status(responseCode).send(body);
	});
});