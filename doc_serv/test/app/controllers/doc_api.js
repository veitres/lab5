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
