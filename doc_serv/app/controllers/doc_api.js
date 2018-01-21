const express = require('express');
const router = express.Router();
const db = require('../models');

const valid = require('../valid');

module.exports = (app) => {
  app.use('/', router);
};

router.get('/specs', (req, res, next) => {
	console.log('***\n\n' + new Date() + '\n: ' + 'Got request for specialities');
	
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
	
	
	db.Spec.getAllSpecs(page,size, function (err, data) {
		if (err) {
			res.status(500).send({error: 'Internal service error'});
		} else {
			res.status(200).send(data);
		}
	});
});

router.get('/doctors', (req, res, next) => {
	console.log('***\n\n' + new Date() + '\n: ' + 'Got request for doctors with spec=' + req.query.spec);
	
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
	
	
	db.Doctor.getDoctorsBySpec(spec, page, size, function (err, data) {
		if (err) {
			res.status(500).send({error: 'Internal service error'});
		} else {
			res.status(200).send(data);
		}
	});
});

router.get('/doctors/:id', (req, res, next) => {
	console.log('***\n\n' + new Date() + '\n: ' + 'Got request for doctor with id=' + req.params.id);
	
	let id = req.params.id;
	valid.checkCorrectIntVal(id,
		function () {return res.status(400).send({error: "Doctor ID required"});},
		function () {return res.status(400).send({error: "Doctor ID is incorrect"});}
	);
	if (res.headersSent) return;
	
	
	db.Doctor.getDoctorWithSpec(id, function (err, data) {
		if (err) {
			if (err == 'SequelizeEmptyResultError') {
				res.status(404).send({error: 'Doctor with id ' + id + ' not found'});
			} else {
				res.status(500).send({error: 'Internal service error'});
			}
		} else {
			res.status(200).send(data);
		}
	});
});


