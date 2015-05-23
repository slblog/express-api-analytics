var http = require('http');
var path = require('path');
var express = require('express');
var urlencoded = require('body-parser').urlencoded;
var metrics = require('./metrics');

// Create a simple Express application that parses incoming POST bodies
var app = express();
app.use(urlencoded({ extended: true }));

// Mount metrics collection middleware
app.use(metrics());

// In-memory data set
var HEROES = [
    {
        id: 0,
        alias: 'Captain America',
        name: 'Steve Rogers'
    },
    {
        id: 1,
        alias: 'Captain Marvel',
        name: 'Carol Danvers'
    }
];

// Return a list of super heroes
app.get('/heroes', function(request, response) {
    // Return full hero list as JSON
    response.send(HEROES);
});

// Get data about a specific hero
app.get('/heroes/:id', function(request, response) {
    var hero = HEROES[request.params.id];
    if (!hero) {
        return response.status(404).send({
            code: 404,
            message: 'No hero found with that ID - sorry :('
        });
    }

    response.send(hero);
});

// Add a hero to the in-memory list
app.post('/heroes', function(request, response) {
    var hero = {
        id: HEROES.length,
        alias: request.body.alias,
        name: request.body.name
    };
    HEROES.push(hero);

    response.send(hero);
});

// Start server
var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log('Express server listening on *:' + port);
});