'use strict';
process.env.NODE_ENV = 'development';

var chai        = require('chai'),
    chaiHttp    = require('chai-http'),
    server      = require('./../../../app.js'),
    should      = chai.should();


chai.use(chaiHttp);
	
const expect = require('chai').expect;

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
	
	let user2appointment1 = { id :2 };
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