const express = require('express');
const router = express.Router();
const db = require('../models');

const crypto = require('crypto');

const valid = require('../valid');
const interserverAuth = require('./../interserver');

var aggregationServAuth = {appId: "aggr", appSecret: "aggrKey", token: null, tokenDate: null};
module.exports = (app) => {
  app.use('/', router);
};

router.get('/auth', (req, res, next) => {
	console.log('***\n\n' + new Date() + ':\n' + 'Got request for auth');
	
	let appId = req.query.appId;
	
	let appSecret = req.query.appSecret;
	
	if (appId != aggregationServAuth.appId || appSecret != aggregationServAuth.appSecret)
	{
		res.status(401).send({error: 'appId or appSecret incorrect'});
	} else {
		aggregationServAuth.token = crypto.randomBytes(32).toString('base64');
		aggregationServAuth.tokenDate = Date.now();
		res.status(200).send({token: aggregationServAuth.token});
	}
});

router.get('/users/:id', (req, res, next) => {
	console.log('***\n\n' + new Date() + '\n: ' + 'Got request for user ' + req.params.id);
	
	let authHeader = req.get('authorization');
	let checkErr = interserverAuth.authCheck(authHeader, aggregationServAuth);
	if (checkErr) {
		return res.status(401).send({error: checkErr});
	}
	
	let id = req.params.id;
	valid.checkCorrectIntVal(id,
		function () {return res.status(400).send({error: "User ID required"});},
		function () {return res.status(400).send({error: "User ID is incorrect"});}
	);
	if (res.headersSent) return;
	
	
	db.User.getUserBaseInfo(id, function (err, data) {
		if (err) {
			if (err == 'SequelizeEmptyResultError') {
				res.status(404).send({error: 'User with id ' + id + ' not found'});
			} else {
				res.status(500).send({error: 'Internal service error'});
			}
		} else {
			res.status(200).send(data);
		}
	});
});

router.get('/users/:id/appointments', (req, res, next) => {
	console.log('***\n\n' + new Date() + '\n: ' + 'Got request for user ' + req.params.id + ' appointments');
	
	let authHeader = req.get('authorization');
	let checkErr = interserverAuth.authCheck(authHeader, aggregationServAuth);
	if (checkErr) {
		return res.status(401).send({error: checkErr});
	}
	
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
	
	
	db.User.getUserAppointmentsArray(id, function (err, data) {
		if (err) {
			if (err == 'SequelizeEmptyResultError') {
				return res.status(404).send({error: 'User with id ' + id + ' not found'});
			} else {
				return res.status(500).send({error: 'Internal service error'});
			}
		}
		
		data = data.toJSON();
		data.count = data.appointments.length;
		console.log('getUserAppointmentsArray (full): ' + data.appointments);
		
		data.appointments = data.appointments.slice(page*size, (page+1)*size);
		console.log('getUserAppointmentsArray (paged): ' + data.appointments);
		
		data.rows = [];
		
		data.appointments.forEach(function(appointmentId) {
			data.rows.push({id: appointmentId});
		});
		
		delete data.appointments;
		res.status(200).send(data);
	});
});

router.patch('/users/:id/appointments', (req, res, next) => {
	console.log('***\n\n' + new Date() + '\n: ' + 'Got request to add appointment ' + req.query.appointmentId + ' for user ' + req.params.id);
	
	let authHeader = req.get('authorization');
	let checkErr = interserverAuth.authCheck(authHeader, aggregationServAuth);
	if (checkErr) {
		return res.status(401).send({error: checkErr});
	}
	
	let id = req.params.id;
	valid.checkCorrectIntVal(id,
		function () {return res.status(400).send({error: "User ID required"});},
		function () {return res.status(400).send({error: "User ID is incorrect"});}
	);
	if (res.headersSent) return;
	
	
	let appointmentId = req.query.appointmentId;
	valid.checkCorrectIntVal(appointmentId,
		function () { return res.status(400).send({error: "\'appointmentId\' parameter required"}); },
		function () { return res.status(400).send({error: "\'appointmentId\' parameter incorrect"}); }
	);
	if (res.headersSent) return;
	
	
	db.User.addToUserAppointmentsArray(id, appointmentId, function (err, data) {
		if (err) {
			if (err == 'SequelizeEmptyResultError') {
				return res.status(404).send({error: 'User with id ' + id + ' not found'});
			} else if (err == 'AppointmentExisted') {
				return res.status(409).send({error: 'User with id ' + id + ' already has appointment ' + appointmentId});
			} else {
				return res.status(500).send({error: 'Internal service error'});
			}
		}
		
		let result = data[0];
		if (!result) {
			res.status(500).send({error: 'Unexpected service error'});
		} else {
			res.status(200).send({result: result});
		}
	});
});

router.delete('/users/:id/appointments', (req, res, next) => {
	console.log('***\n\n' + new Date() + '\n: ' + 'Got request to delete appointment ' + req.query.appointmentId + ' for user ' + req.params.id);
	
	let authHeader = req.get('authorization');
	let checkErr = interserverAuth.authCheck(authHeader, aggregationServAuth);
	if (checkErr) {
		return res.status(401).send({error: checkErr});
	}
	
	let id = req.params.id;
	valid.checkCorrectIntVal(id,
		function () {return res.status(400).send({error: "User ID required"});},
		function () {return res.status(400).send({error: "User ID is incorrect"});}
	);
	if (res.headersSent) return;
	
	
	let appointmentId = req.query.appointmentId;
	valid.checkCorrectIntVal(appointmentId,
		function () { return res.status(400).send({error: "\'appointmentId\' parameter required"}); },
		function () { return res.status(400).send({error: "\'appointmentId\' parameter incorrect"}); }
	);
	if (res.headersSent) return;
	
	
	db.User.deleteFromUserAppointmentsArray(id, appointmentId, function (err, data) {
		if (err) {
			if (err == 'SequelizeEmptyResultError') {
				return res.status(404).send({error: 'User with id ' + id + ' not found'});
			} else if (err == 'AppointmentNotFound') {
				return res.status(409).send({error: 'User with id ' + id + ' has no appointment ' + appointmentId});
			} else {
				return res.status(500).send({error: 'Internal service error'});
			}
		}
		
		let result = data[0];
		if (!result) {
			res.status(500).send({error: 'Unexpected service error'});
		} else {
			res.status(200).send({result: result});
		}
	});
});