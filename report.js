var Keen = require('keen-js');
var AsciiTable = require('ascii-table');
var config = require('./config');

// Create a Keen API client
var client = new Keen({
    projectId: config.keen.projectId,
    readKey: config.keen.masterKey
});

// Create a count query
var count = new Keen.Query('count', {
    event_collection: 'apiRequest',
    group_by: 'data.userAgent'
});

// Run the query and print the results in a nice ASCII table
client.run(count, function(err, response) {
    if (err) {
        return console.error('Problem retrieving analytics events:' + err);
    }

    // Create ASCII table and heading
    var table = new AsciiTable('API Requests by User Agent');
    table.setHeading('User Agent', 'Requests');

    // Sort results by count and add them to the table
    response.result.sort(function(a, b) {
        if (a.result < b.result) return 1;
        if (a.result > b.result) return -1;
        return 0;
    }).forEach(function(queryResult) {
        table.addRow(queryResult['data.userAgent'], queryResult.result);
    });

    // Print the table
    console.log(table.toString());
});