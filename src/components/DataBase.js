var mongoose=require('mongoose');
var _=require('lodash');
var async=require('async');
var DEFAULT_LIST_LIMIT=5;
module.exports={
	init: function(engine,params) {
		this._isConnected=false;
		this._isClosed=false;
		this._engine=engine;
		this._params=params;
		this._schemaFactory=engine.getBootstrap('SchemaFactory');
		this._mongoose=mongoose;

	},
	getMongoose:function(){
		return this._mongoose;
	},
	up:function(cb){
		if(this._isConnected){
			cb();
			return;
		}
		this._isConnected=true;
		this._isClosed=false;
		var mongoConfig=this._params['mongo'];
		var uri=this._buildConection(mongoConfig.url,mongoConfig.port,mongoConfig.base);
		mongoose.connect(uri,function(err,data){
			cb(err);
		});
		this._addFunctionToClose();

	},
	_buildConection:function(url,port,base){
		return url+':'+port+'/'+base;

	},
	getSchema:function(schemaName){
		return this._schemaFactory.create(schemaName);
	},
	getSchemaDbObject:function(schemaName){
		return this._schemaFactory.createSchema(schemaName);
	},
	update:function(schemaName,data,searchData,cb){
		try{ 
			this._validateDataToSave(schemaName,data,'update');
			var Schema=this.getSchemaDbObject(schemaName);
			options = { multi: true };

			Schema.update(searchData,data,options,cb);
		}
		catch(err){
			cb(err);
		}
	},
	updateOne:function(schemaName,data,searchData,cb){
		try{
			this._validateDataToSave(schemaName,data,'update');
			var Schema=this.getSchemaDbObject(schemaName);
			Schema.findOneAndUpdate(searchData,data,cb);
		}
		catch(err){
			cb(err);
		}
	},
		
	updateById:function(schemaName,id,data,cb){
		try{
			this._validateDataToSave(schemaName,data,'update');
			var plainCb=this._getPlainObjectCb(cb,true);
			this.updateRawById(schemaName,data,id,plainCb);
		}
		catch(err){
			cb(err);	
		}

	},
	updateRawById:function(schemaName,data,id,cb){
		var Schema=this.getSchemaDbObject(schemaName);
		var self=this;
		Schema.findByIdAndUpdate(id,data, function (err, schemaObj) {
			if (err) {

				cb(err);
				return;
			}
			cb(null,schemaObj);
		});

	},
	_validateDataToSave:function(schemaName,data,context){
		var Schema=this.getSchema(schemaName);
		Schema.validate(data);
	},
	insert:function(schemaName,data,cb){
		var SchemaDbObject=this.getSchemaDbObject(schemaName);
		SchemaDbObject.collection.insert(data,cb);
	},
	create:function(schemaName,data,cb){
		var self=this;
		try{
			this._validateDataToSave(schemaName,data,'create');
			var SchemaDbObject=this.getSchemaDbObject(schemaName);
			var schemaObj=new SchemaDbObject(data);
			schemaObj.save(function(err){
				self._getPlainObjectCb(cb)(err,schemaObj);
			});
		}
		catch(err){
			cb(err);
		}
	},
	_getPlainObjectCb:function(cb,notFoundIfEmpty){
		var self=this;
		return function(err,data){
			if(err){
				return cb(self._getErroFromMongooseError(err));
			}
			if(_.isEmpty(data)){
				if(notFoundIfEmpty){

					return cb(self._engine.getError('NotFound'));
				}
				return cb(null,data);
			}
			if(Array.isArray(data)){
				var ret=[];
				data.forEach(function(d){
					ret.push(d.toObject());
				});
				cb(null,ret);
			}

			if(data.toObject){
				return cb(null,data.toObject());
			}
		}
	},
	readRawById:function(schemaName,id,cb,fields,options,populate){
		var query=this._engine.getQuery(null,fields,options,populate);
		var Schema=this.getSchemaDbObject(schemaName);
		var search=Schema.findById(id);
		this._executeSearch(search,query,cb);
	},
	readRaw:function(schemaName,searchData,cb,fields,options,populate){
		var query=this._engine.getQuery(searchData,fields,options,populate);
		var Schema=this.getSchemaDbObject(schemaName);
		var search=Schema.find(query.getSearch());
		this._executeSearch(search,query,cb);
	},
	readRawOne:function(schemaName,searchData,cb,fields,options,populate){
		var query=this._engine.getQuery(searchData,fields,options,populate);
		var Schema=this.getSchemaDbObject(schemaName);
		var search=Schema.findOne(query.getSearch());
		this._executeSearch(search,query,cb);
	},
	_getErroFromMongooseError:function(err){
		switch(err.name){
			case 'CastError':
				return this._engine.getError('InvalidParams',err.message,null,err.errors);
			break;
			default:
				return this._engine.getError('Internal',err.message,null,err.errors);
			break;
		}

	},
	_executeSearch:function(search,query,cb){
		var fields=query.getFields();
		if(!_.isEmpty(fields)){
			search.select(fields);
		}
		var options=query.getOptions();
		if(!_.isEmpty(options)){
			search.setOptions(options);
		}
		var populate=query.getPopulate();
		if(!_.isEmpty(populate)){
			if(Array.isArray(populate)){
				populate.forEach(function(p){
					search.populate(p);
				});
			}
			else{
				switch(typeof(populate)){
					case 'object':
						for(var k in populate){
							if(_.isEmpty(populate[k])){
								search.populate(k);
							}
							else{
								search.populate(k,populate[k]);
							}
						}
					break;
					case 'string':
						search.populate(populate);
					break;
				}
			}
		};
		var self=this;
		var searchCb=function(err,data){
			if(err){
				cb(err);
				return;
			}
				cb(err,data);
		}
		search.exec(searchCb);

	},
	readById:function(schemaName,id,cb,fields,options,populate){
		
		this.readRawById(schemaName,id,this._getPlainObjectCb(cb,true),fields,options,populate);
	},
	read:function(schemaName,searchData,cb,fields,options,populate){
		
		this.readRaw(schemaName,searchData,this._getPlainObjectCb(cb),fields,options,populate);
	},
	readOne:function(schemaName,searchData,cb,fields,options,populate){
		
		this.readRawOne(schemaName,searchData,this._getPlainObjectCb(cb,true),fields,options,populate);
	},
	destroy:function(schemaName,searchData,cb){
		var Schema=this.getSchemaDbObject(schemaName);
		Schema.remove(searchData,cb);
	},
	destroyById:function(schemaName,id,cb){
		var Schema=this.getSchemaDbObject(schemaName);
		Schema.findByIdAndRemove(id,cb);
	},
	
	_addFunctionToClose:function(){
	 	var self=this
 	 	var func=function(cb){
	 		self.end(cb);
	 	}
		this._engine.addFunctionToCloseQueue(func);
	},
	end:function(cb){
		if(this._isConnected && !this._isClosed){

			this._isConnected=false;

			mongoose.connection.close();
			this._isClosed=true;
		}
		cb();
	
	},
	list:function(schemaName,search,limit,page,fields,options,cb,populate){

		if(parseInt(limit)===-1 || limit==='false' || limit===false){
			limit=this._params.maxAllowedLimit;
		}
		else if(!limit || typeof(limit)=='undefined'){
			limit=DEFAULT_LIST_LIMIT;
		}
		if(!page || typeof(page)=='undefined'){
			page=0;
		}
		if(limit){
			if(!options){
				options={};
			}
			options.limit=limit;
			options.skip=limit*page;
		}
		var self=this;
		var read=function(asyncCb){
			self.read(schemaName,search,asyncCb,fields,options,populate);

		};
		var total=function(asyncCb){
			self.count(schemaName,search,asyncCb);
		};
		async.parallel({
			'total':total,
			'results':read
		},cb);

	},
	count:function(schemaName,search,cb){
		var Schema=this.getSchemaDbObject(schemaName);
		if(search){
			Schema.count(search,cb);
		}
		else{
			Schema.count(cb);
		}
	},
	ObjectId:function(value){
		if(!value){
			return mongoose.Types.ObjectId();
		}
		if(typeof(value)=='object'){
			return value;
		}
		return	mongoose.Types.ObjectId(value);
	}
}
