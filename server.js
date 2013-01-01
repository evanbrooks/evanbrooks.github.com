// Express is the basic web server
// -------------------------------

var express = require('express');
var application = express();

// Other setup
// -------------------------------

var url = require("url");						// for parsing URLs

// If we don't go to any directory and just visit the port
// -------------------------------------------------------

// application.get('/', function(request, response) {
//     response.send('Hello Express!!');
// });

// Access files in the same directory this file is in
// --------------------------------------------------
application.use(express.static(__dirname));


var port = 2455;
application.listen(port);
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
