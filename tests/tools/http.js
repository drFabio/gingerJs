var http=require('http');
var querystring=require('querystring');
var request=require('request');
request = request.defaults({jar: true})
module.exports = function(host, port) {
	var baseURL='http://'+host;
	if(port){
		baseURL+=':'+port;
	}
	var executRequest=function(){

	}
    return {
        "sendGet": function(url, data, cb) {
        	var queryData=querystring.stringify(data);
        	if(queryData){
        		url+='?'+queryData;
        	}
        	url=baseURL+url;
           


            var req = request.get(url, function(err,data) {
            	if(err){
            
            		cb(err);
            		return;
            	}
				cb(null,{'body':data.body,status:data.statusCode});			
            });
           
        },
        "sendJSONRpc":function(url,method,id,data,cb){
             var postData={
                    'method':method,
                    'id':id
                    
                };
                for(var x in data){
                    postData['params'+x]=data[x];
                }
				url=baseURL+url;
				var r=request.post({uri:url,json:true}, function(err,httpResponse,body) {
					if(err){
						cb(err);
						return;
					}

					if(body.error){
               			cb(body.error);
	               		return;
	               	}
	               	cb(null,body.result);


				});
				r.form(postData);
        },
        "sendPost": function(url, postData, cb) {

	     	url=baseURL+url;
         	var r=request.post(url, function(err,httpResponse,body) {
				if(err){
					cb(err);
					return;
				}
				cb(null,{'body':body,status:httpResponse.statusCode});			
         	
            });
            r.form(postData);

        }
    }
};