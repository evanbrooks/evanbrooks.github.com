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

var compressor = require('node-minify');

new compressor.minify({
    type: 'gcc',
    fileIn: ['js/jquery.wait.min.js', 'js/drag.js', 'js/clerestory.js', 'js/iscroll-lite.js', 'js/js.js'],
    fileOut: 'evn.min.js',
    callback: function(err){
        console.log(err);
    }
});


// Access files in the same directory this file is in
// --------------------------------------------------
application.use(express.static(__dirname));


var port = 2455;
application.listen(port);
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
