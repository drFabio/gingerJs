var mongoose=require('mongoose');
module.exports={
	_isConnected:false,
	_isClosed:false,
	init: function(engine,params) {
		this._engine=engine;
		this._params=params;
		if(!this._isConnected){
			this._isConnected=true;
			this._isClosed=false;
			//mongoose.connect(this._params['mongo']);
		}

	},

	create:function(data,cb){

	},
	end:function(){
		if(this._isConnected && !this._isClosed){

			this._isConnected=false;

			//mongoose.connection.close();
			this._isClosed=true;
		}
	}
}
