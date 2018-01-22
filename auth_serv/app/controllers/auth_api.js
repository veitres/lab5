const express = require('express');
const router = express.Router();
const db = require('../models');

const crypto = require('crypto');

const interserverAuth = require('./../interserver');

var aggregationServAuth = {appId: "aggr", appSecret: "aggrKey", token: null, tokenDate: null};

const tokenLiveTime = 86400; // 24 hours
const inactiveTokenLiveTime = 60; // 30 min


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

router.post('/authenticate', (req, res, next) => {
	console.log('***\n\n' + new Date() + ':\n' + 'Got request for authenticate');
	
	let authHeader = req.get('authorization');
	let checkErr = interserverAuth.authCheck(authHeader, aggregationServAuth);
	if (checkErr) {
		return res.status(401).send({error: checkErr});
	}
	
	let login = req.body.login;
	console.log('login:'+login+';');
	if (typeof(login) == 'undefined') return res.status(400).send({error: "Login not specified"});
	
	let password = req.body.password;
	console.log('pass:'+password+';');
	if (typeof(password) == 'undefined') return res.status(400).send({error: "Password not specified"});
	
	db.Account.findAccountAndCheckPassword(login, password, function (err, account) {
		if (err) {
			if (err == 'SequelizeEmptyResultError') {
				return res.status(404).send({error: "User with such login not found"});
			} else if (err == 'Incorrect password') {
				return res.status(401).send({error: "Wrong password"});
			} else {
				return res.status(500).send({error: "Service unavailable"});
			}
		} else {
			db.UIToken.createToken(account.id, function (tokenErr, token) {
				if (tokenErr) {
					return res.status(500).send({error: "Service unavailable"});
				} else {
					return res.status(200).send({user: account.id, token: token.token});
				}
			});
		}
	});
});

router.get('/check/:id', (req, res, next) => {
	console.log('***\n\n' + new Date() + ':\n' + 'Got request for token check');
	
	let authHeader = req.get('authorization');
	let checkErr = interserverAuth.authCheck(authHeader, aggregationServAuth);
	if (checkErr) {
		return res.status(401).send({error: checkErr});
	}
	
	let userId = req.params.id;
	if (typeof(userId) == 'undefined') return res.status(400).send({error: "userId not specified", errCode:400});
	
	let token = req.query.token;
	if (typeof(token) == 'undefined') return res.status(400).send({error: "token not specified", errCode:400});
	
	db.UIToken.findToken(token, function (err, dbToken) {
		if (err) {
			if (err == 'SequelizeEmptyResultError') {
				return res.status(200).send({error: "Token not found", errCode:401});
			} else {
				console.log("dbErr:"+err);
				return res.status(500).send({error: "Service unavailable", errCode:500});
			}
		} else {
			if (dbToken.userId != userId) {
				return res.status(200).send({error: "Trying affect another user", errCode:403});
			} else if ((Date.now() - dbToken.created)/1000 > tokenLiveTime) {
				return res.status(200).send({error: 'Token Life Time Expericied', errCode:401});
			} else if ((Date.now() - dbToken.lastUsed)/1000 > inactiveTokenLiveTime) {
				return res.status(200).send({error: 'Token Inactive Time Expericied', errCode:401});
			} else {
				db.UIToken.updateLastUsed(token, function (err, data) {
					return res.status(200).send(dbToken);
				});
			}
		}
	});
});