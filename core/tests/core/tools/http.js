var http=require('http');
module.exports = function(host, port) {
    return {
        "sendGet": function(url, data, cb) {
            var options = {
                host: host,
                port: port,
                path: url,
                method: 'GET'
            };

            var req = http.request(options, function(res) {
               // console.log('STATUS: ' + res.statusCode);
               // console.log('HEADERS: ' + JSON.stringify(res.headers));
                var body='';
                res.setEncoding('utf8');

                res.on('data', function(chunk) {
                	body+=chunk;
                });
	            res.on('end', function () {
					cb(null,{'body':body});			
				});
            });
            req.on('error', function(e) {
                cb(e);
            });
            req.end();
        },
        "sendPost": function(url, data, cb) {

        }
    }
};