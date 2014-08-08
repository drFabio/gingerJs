var mongoose=require('mongoose');
module.exports={
	_isConnected:false,
	_isClosed:false,
	init: function(engine,params) {
		this._engine=engine;
		this._params=params;
		console.log('CHamei DB');
		if(!this._isConnected){
			this._isConnected=true;
			this._isClosed=false;
			mongoose.connect(this._params['mongo'].uri);
			console.log('Conectei db');
			this._addFunctionToClose();

			// CONNECTION EVENTS
			// When successfully connected
			mongoose.connection.on('connected', function () {
			  console.log('Mongoose default connection open to ');
			});

			// If the connection throws an error
			mongoose.connection.on('error',function (err) {
				throw err;
			});

		}

	},

	create:function(data,cb){

	},
	_addFunctionToClose:function(){
	 	var self=this;
	 	var func=function(cb){
	 		self.end();
	 		cb();
	 	}
		this._engine.addFunctionToCloseQueue(func);
	},
	end:function(){
		console.log("CHAMEI FINAL DE DB");
		if(this._isConnected && !this._isClosed){

			this._isConnected=false;

			mongoose.connection.close();
			this._isClosed=true;
			console.log("FECHEI DB");
		}
		else{
			console.log("N CONSEGUI FECHAR DB!s");
		}
	}
}
