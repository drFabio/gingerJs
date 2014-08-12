var mongoose=require('mongoose');
module.exports={
	_isConnected:false,
	_isClosed:false,
	init: function(engine,params) {
		this._engine=engine;
		this._params=params;
		this._schemaFactory=engine.getBootstrap('SchemaFactory');
		if(!this._isConnected){
			this._isConnected=true;
			this._isClosed=false;
			mongoose.connect(this._params['mongo'].uri);
			this._addFunctionToClose();

			// CONNECTION EVENTS
			// When successfully connected
			mongoose.connection.on('connected', function () {
			});

			// If the connection throws an error
			mongoose.connection.on('error',function (err) {
				throw err;
			});
		}

	},
	getSchemaClass:function(schemaName){
		return this._schemaFactory.create(schemaName);
	},
	update:function(schemaName,data,searchData,cb){
		var Schema=this.getSchemaClass(schemaName);

		Schema.findOneAndUpdate(searchData,data,cb)
	},
	create:function(schemaName,data,cb){
		var Schema=this.getSchemaClass(schemaName);
		var schemaObj=new Schema(data);
		schemaObj.save(function(err){
			
			cb(err,schemaObj);
		});
	},
	read:function(schemaName,searchData,cb){
		var Schema=this.getSchemaClass(schemaName);
		Schema.find(searchData,cb);
	},
	destroy:function(schemaName,searchData,cb){
		var Schema=this.getSchemaClass(schemaName);
		Schema.remove(searchData,cb);
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
		if(this._isConnected && !this._isClosed){

			this._isConnected=false;

			mongoose.connection.close();
			this._isClosed=true;
		}
	
	}
}
