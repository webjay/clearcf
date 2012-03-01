var express = require('express');
var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'coffee');
	app.register('.coffee', require('coffeekup').adapters.express);
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
	app.use(app.router);
});

// modes
app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
	app.use(express.errorHandler()); 
});

// listen
app.listen(process.env.PORT || 8008);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

app.get('/', function (req, res) {
});
