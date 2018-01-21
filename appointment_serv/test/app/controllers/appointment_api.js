'use strict';
process.env.NODE_ENV = 'development';

var chai        = require('chai'),
    chaiHttp    = require('chai-http'),
    server      = require('./../../../app.js'),
    should      = chai.should();

chai.use(chaiHttp);
	
const expect = require('chai').expect;

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
	
	let appointment1Full = {id: 1, docId: 1, date: "2018-01-17T12:30:00.000Z"};
	it ('request GET /appointments/1 should return full info on appointment 1', function(done){
		chai.request(server)
		.get('/appointments/1')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(appointment1Full);
		done();
		});
	});
	
	let resultPassed = {result: 1};
	let resultNotPassed = {result: 0};
	it ('request PATCH /appointments/1 should set app1 isnot free and return 1 as proof of changes', function(done){
		chai.request(server)
		.patch('/appointments/1')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(resultPassed);
		done();
		});
	});
	
	it ('trying again should make nothing and return 0 as proof of nochanges', function(done){
		chai.request(server)
		.patch('/appointments/1')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(resultNotPassed);
		done();
		});
	});
	
	it ('request DELETE /appointments/1 should set app1 free and return 1 as proof of changes', function(done){
		chai.request(server)
		.delete('/appointments/1')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(resultPassed);
		done();
		});
	});
});