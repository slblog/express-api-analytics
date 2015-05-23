var expressMetrics = require('strong-express-metrics');
var Keen = require('keen-js');
var config = require('./config');

// Create a Keen API client
var client = new Keen({
    projectId: config.keen.projectId,
    writeKey: config.keen.masterKey
});

// Create a custom record function for metrics
expressMetrics.onRecord(function(data) {
    client.addEvent('apiRequest', data, function(err, response) {
        if (err) {
            console.error('Problem sending data to Keen IO: ' + err);
        }
    });
});

// Create middleware function that will record API metrics
module.exports = function(options) {
    return expressMetrics(function(request, response) {
        var metrics = {
            // Our API isn't currently authenticated, these are made up
            client: {
                id: 'apiuser',
                username: 'apiuser'
            },

            // Custom tracking data goes here
            data: {}
        };

        // Capture the user agent on every request
        metrics.data.userAgent = request.headers['user-agent'];
        return metrics;
    });
};