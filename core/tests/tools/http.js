var http=require('http');
var querystring=require('querystring');
module.exports = function(host, port) {
	var executRequest=function(){

	}
    return {
        "sendGet": function(url, data, cb) {
        	var queryData=querystring.stringify(data);
        	if(queryData){
        		url+='?'+queryData;
        	}
            var options = {
                host: host,
                port: port,
                path: url,
                method: 'GET'
            };

            var req = http.request(options, function(res) {
                var body='';
                res.setEncoding('utf8');

                res.on('data', function(chunk) {
                	body+=chunk;
                });
	            res.on('end', function () {
					cb(null,{'body':body,status:res.statusCode});			
				});
            });
            req.on('error', function(e) {
                cb(e);
            });
            req.end();
        },
        "sendPost": function(url, data, cb) {
        	var queryData=querystring.stringify(data);
        
            var options = {
                host: host,
                port: port,
                path: url,
                method: 'POST',
                headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': queryData.length
				}
            };

            var req = http.request(options, function(res) {
                var body='';
                res.setEncoding('utf8');

                res.on('data', function(chunk) {
                	body+=chunk;
                });
	            res.on('end', function () {
					cb(null,{'body':body,status:res.statusCode});			
				});
            });
            req.write(queryData);
            req.on('error', function(e) {
                cb(e);
            });
            req.end();

        }
    }
};