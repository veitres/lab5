'use strict';
process.env.NODE_ENV = 'development';

var chai        = require('chai'),
    chaiHttp    = require('chai-http'),
    server      = require('./../../../app.js'),
    should      = chai.should();


chai.use(chaiHttp);
	
const expect = require('chai').expect;

describe('specs get requests', () => {
	let spec3 = {id: 3, spec: "Психиатор"};
	it ('request /specs?page=1&size=2 returns one page of one elem, but says there 3 specs', function(done){
		chai.request(server)
		.get('/specs?page=1&size=2')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.rows.length.should.be.eql(1);
		res.body.rows[0].should.be.eql(spec3);
		res.body.count.should.be.eql(3);
		done();
		});
	});
});

describe('doctors get reqs', () => {
	let docBar = {"id":1,"fio":"Барабулька Александр Вадимович"};
	it ('request of spec 1 doctors /doctors?spec=1 returns one page of one elem', function(done){
		chai.request(server)
		.get('/doctors?spec=1')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.rows.length.should.be.eql(1);
		res.body.rows[0].should.be.eql(docBar);
		res.body.count.should.be.eql(1);
		done();
		});
	});
	
	let docBarFull = {"id":1,"fio":"Барабулька Александр Вадимович","spec":"Травмотолог"};
	it ('request of doctor1 /doctors/1 returns doc info with inserted text spec', function(done){
		chai.request(server)
		.get('/doctors/1')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(docBarFull);
		done();
		});
	});
});



describe('users', () => {
	let user2short = { id: 2, fio: "Петренко Александра Васильевна"};
	it ('request /users/2 returns user 2 short info', function(done){
		chai.request(server)
		.get('/users/2')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(user2short);
		done();
		});
	});
	
	let user2appointment1 = { id :2, date: "2018-01-17T12:45:00.000Z", doc: { id: 1, fio: "Барабулька Александр Вадимович", spec: "Травмотолог"}};
	it ('request GET /users/2/appointments?page=0&size=1 returns user 2 appointments, showing only first but says there 2 of them', function(done){
		chai.request(server)
		.get('/users/2/appointments?page=0&size=1')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.rows.length.should.be.eql(1);
		res.body.rows[0].should.be.eql(user2appointment1);
		res.body.count.should.be.eql(2);
		done();
		});
	});
	
	it ('request GET /users/4/appointments returns void result', function(done){
		chai.request(server)
		.get('/users/4/appointments')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.rows.length.should.be.eql(0);
		res.body.count.should.be.eql(0);
		done();
		});
	});
	
	it ('request PATCH /users/4/appointments?appointmentId=7 returns result 1', function(done){
		chai.request(server)
		.patch('/users/4/appointments?appointmentId=7')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.result.should.be.eql(1);
		done();
		});
	});
	
	it ('request PATCH /users/3/appointments?appointmentId=7 returns result 0 because appointment isnot free', function(done){
		chai.request(server)
		.patch('/users/3/appointments?appointmentId=7')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.result.should.be.eql(0);
		done();
		});
	});
	
	it ('request DELETE /users/4/appointments?appointmentId=7 returns result 1', function(done){
		chai.request(server)
		.delete('/users/4/appointments?appointmentId=7')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.result.should.be.eql(1);
		done();
		});
	});
});


describe('appointments', () => {
	let appointment1 = {id: 1, date: "2018-01-17T12:30:00.000Z"};
	
	it ('request /appointments?docId=1&page=0&size=1 should return one elem but says there 2 (there are 3 in base, but app2 is not free)', function(done){
		chai.request(server)
		.get('/appointments?docId=1&page=0&size=1')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.rows.length.should.be.eql(1);
		res.body.rows[0].should.be.eql(appointment1);
		res.body.count.should.be.eql(2);
		done();
		});
	});
});