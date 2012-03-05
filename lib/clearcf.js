var crypto = require('crypto');
var https = require('https');

module.exports = clearcf;

function clearcf () {}

clearcf.prototype.parsePayload = function (payload) {
	var files = [];
	var commitTypes = ['added', 'removed', 'modified'];
	for (i in payload.commits) {
		var commit = payload.commits[i];
		for (t in commitTypes) {
			var commitType = commitTypes[t];
			if (commitType in commit) {
				for (n in commit[commitType]) {
					var file = commit[commitType][n];
					if (files.indexOf(file) === -1) {
						files.push(file);
					}
				}
			}
		}
	}
	return files;
}

clearcf.prototype.buildXML = function (files, callref) {
	var xml = '<InvalidationBatch>';
	for (i in files) {
		xml += '<Path>/' + files[i] + '</Path>';
	}
	xml += '<CallerReference>' + callref + '</CallerReference>';
	xml += '</InvalidationBatch>';
	return xml;
}

clearcf.prototype.createSignature = function (secret_key, value) {
	return crypto.createHmac('sha1', secret_key).update(value).digest('base64');
}

clearcf.prototype.sendRequest = function (distid, date, access_key, signature, data) {
	var options = {
		host: 'cloudfront.amazonaws.com',
		port: 443,
		path: '/2010-11-01/distribution/' + distid + '/invalidation',
		method: 'POST',
		headers: {
			'Content-Type': 'text/xml; charset=UTF-8',
			'x-amz-date': date,
			'Authorization': 'AWS ' + access_key + ':' + signature,
			'Content-Length': data.length
		}
	};
	var p = https.request(options, function (res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('Response: ' + chunk);
		});
	});
	p.write(data);
	p.on('error', function (e) {
		console.error(e);
	});
	p.end();
}
