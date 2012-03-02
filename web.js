var express = require('express');
var app = module.exports = express.createServer();
var clearcf = require(__dirname + '/lib/clearcf.js');

// Configuration
app.configure(function(){
	// app.set('views', __dirname + '/views');
	// app.set('view engine', 'coffee');
	// app.register('.coffee', require('coffeekup').adapters.express);
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	// app.use(express.static(__dirname + '/public'));
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
	res.redirect('https://github.com/webjay/clearcf');
});

app.post('/:distid/:keyaccess/:keysecret', function (req, res) {
	var distid = req.params.distid;
	var keyaccess = req.params.keyaccess;
	var keysecret = req.params.keysecret;
	var payload = JSON.parse(req.body.payload);
	var ccf = new clearcf();
	var files = ccf.parsePayload(payload);
	var xml = ccf.buildXML(files, payload.after);
	var date = new Date().toGMTString();
	var signature = ccf.createSignature(secret_key, date);
	ccf.sendRequest(distid, date, access_key, signature, xml);
});
