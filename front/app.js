/* global require */
/* global __dirname */
/* global module */
/* global process */

const express = require('express');
const app = express();
const main = './public/';

const routes = [
	'/',
	'/menu',
	'/signin',
	'/signup',
	'/about',
	'/rules',
	'/play',
	'/multiplayer',
	'/scores',
	'/logout',
	'/404'
];

routes.forEach(r => {
	app.use(r, express.static(main));
});

app.use(function(req, res, next) {
	res.status(404).redirect('/404');
});
  

app.use('/css', express.static('./public/css'));
app.use('/img', express.static('./public/img'));


// view engine setup
var path = require('path');
app.set('views', path.normalize(__dirname + '/') + 'views/templates');
app.set('view engine', 'ejs');

module.exports = app;
