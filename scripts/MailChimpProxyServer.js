#!/usr/bin/env node --harmony
'use strict';
var 
	express = require('express'),
	connect = require('connect'),
	bodyParser = require('body-parser'),
	chalk = require('chalk'),
	app = express();
// add node's body parser to middelware
app.use(bodyParser.json());	
	
var 
	MailChimpAPI = require('mailchimp').MailChimpAPI,
	apiKey = '27505fe88068079febf4c461990296dc-us4',
	listId = '6276927180';
	
function monkeyRegister(req,res,notify) {
	api.call('lists', 'subscribe', { id: listId, email: { email: req.params.email}, merge_vars: req.body}, function (error, data) {
		console.log('Mailchimp has responded to: ' + req.params.email);
		if (error) {
			// MailChimp returns a 214 error when the user already exists in the list
			if (error.code === 214) {
				res.json(409, error.message);
			} else {
				res.json(403, error.message);				
			}
			console.log(error.message);
		}
		else {
			console.log(JSON.stringify(data)); // Do something with your data!		
			res.json(200, data);
		}
	});
}
	
// initialise MailChimp API
try { 
    var api = new MailChimpAPI(apiKey, { version : '2.0' });
} catch (error) {
    console.log(error.message);
}
// define proxy services
app.post('/register/:email', function(req,res) {
	monkeyRegister(req,res,true);
});


app.post('/moreInfo/:email', function(req,res) {
	monkeyRegister(req,res,false);
});

app.listen(4400, function() {
	// console.log(chalk.green('Listening on port %d', app.address().port));
	console.log(chalk.green('MailChimp proxy service started.'));
});