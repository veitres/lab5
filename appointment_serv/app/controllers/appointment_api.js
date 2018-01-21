const express = require('express');
const router = express.Router();
const db = require('../models');

const valid = require('../valid');

module.exports = (app) => {
  app.use('/', router);
};

router.get('/status', (req, res, next) => {
	res.status(200).send({status: 'Running'});
});

router.get('/appointments', (req, res, next) => {
	console.log('***\n\n' + new Date() + ':\n' + 'Got request for appointments of docId ' + req.query.docId);
	
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
	
	
	db.Appointment.getFreeAppointmentsByDoc(docId,page,size, function (err, data) {
		console.log('err: ' + err + ' | docs: ' + data);
		if (err) {
			res.status(500).send({error: 'Internal service error'});
		} else {
			res.status(200).send(data);
		}
	});
});

router.get('/appointments/:id', (req, res, next) => {
	console.log('***\n\n' + new Date() + ':\n' + 'Got request for appointment ' + req.params.id);
	
	let id = req.params.id;
	valid.checkCorrectIntVal(id,
		function () {return res.status(400).send({error: "Appointment ID required"});},
		function () {return res.status(400).send({error: "Appointment ID is incorrect"});}
	);
	if (res.headersSent) return;
	
	
	db.Appointment.getAppointment(id, function (err, data) {
		console.log('err: ' + err + ' | docs: ' + data);
	
		if (err) {
			if (err == 'SequelizeEmptyResultError') {
				res.status(404).send({error: 'Appointment with id ' + id + ' not found'});
			} else {
				res.status(500).send({error: 'Internal service error'});
			}
		} else {
			res.status(200).send(data);
		}
	});
});

router.patch('/appointments/:id', (req, res, next) => {
	console.log('***\n\n' + new Date() + '\n: ' + 'Got request for make appointment ' + req.params.id + ' locked');
	
	let id = req.params.id;
	valid.checkCorrectIntVal(id,
		function () {return res.status(400).send({error: "Appointment ID required"});},
		function () {return res.status(400).send({error: "Appointment ID is incorrect"});}
	);
	if (res.headersSent) return;
	
	
	db.Appointment.setAppointmentLocked(id, function (err, data) {
		if (err) {
			console.log('Set err is: ' + err);
			return res.status(500).send({error: 'Internal service error'});
		}
		
		let result = data[0];
		if (!result) {
			db.Appointment.getAppointment(id, function (err, data) {
				if (err == 'SequelizeEmptyResultError') {
					res.status(404).send({error: 'Appointment with id ' + id + ' not found'});
				} else {
					res.status(409).send({error: 'Appointment with id ' + id + ' is already locked'});
				}
			});
		} else {
			res.status(200).send({result: result});
		}
	});
});

router.delete('/appointments/:id', (req, res, next) => {
	console.log('***\n\n' + new Date() + ':\n' + 'Got request for make appointment ' + req.params.id + ' unlocked');
	
	let id = req.params.id;
	valid.checkCorrectIntVal(id,
		function () {return res.status(400).send({error: "Appointment ID required"});},
		function () {return res.status(400).send({error: "Appointment ID is incorrect"});}
	);
	if (res.headersSent) return;
	
	
	db.Appointment.setAppointmentUnLocked(id, function (err, data) {
		if (err) {
			console.log('UnSet err is: ' + err);
			return res.status(500).send({error: 'Internal service error'});
		}
		
		let result = data[0];
		if (!result) {
			db.Appointment.getAppointment(id, function (err, data) {
				if (err == 'SequelizeEmptyResultError') {
					res.status(404).send({error: 'Appointment with id ' + id + ' not found'});
				} else {
					res.status(409).send({error: 'Appointment with id ' + id + ' is already unlocked'});
				}
			});
		} else {
			res.status(200).send({result: result});
		}
	});
});
