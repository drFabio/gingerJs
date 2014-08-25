var mongoose=require('mongoose');
var _=require('lodash');
var DEFAULT_LIST_LIMIT=5;
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
			var mongoConfig=this._params['mongo'];
			var uri=this._buildConection(mongoConfig.url,mongoConfig.port,mongoConfig.base);
			mongoose.connect(uri);
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
	_buildConection:function(url,port,base){
		return url+':'+port+'/'+base;

	},
	getSchemaClass:function(schemaName){
		return this._schemaFactory.create(schemaName);
	},
	update:function(schemaName,data,searchData,cb){
		var Schema=this.getSchemaClass(schemaName);

		Schema.findOneAndUpdate(searchData,data,cb)
	},

	create:function(schemaName,data,cb){
		var self=this;
		var Schema=this.getSchemaClass(schemaName);
		var schemaObj=new Schema(data);
		schemaObj.save(function(err){
			self._getPlainObjectCb(cb)(err,schemaObj);
		});
	},
	_getPlainObjectCb:function(cb){
		return function(err,data){
			if(err){
				return cb(err);
			}
			if(_.isEmpty(data)){
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
	readRawById:function(schemaName,id,cb,fields,options){
		var Schema=this.getSchemaClass(schemaName);
		var search=Schema.findById(id);
		this._executeSearch(search,cb,fields,options);
	},
	readRaw:function(schemaName,searchData,cb,fields,options){
		var Schema=this.getSchemaClass(schemaName);
		var search=Schema.find(searchData);
		this._executeSearch(search,cb,fields,options);
	},
	readRawOne:function(schemaName,searchData,cb,fields){
		var Schema=this.getSchemaClass(schemaName);
		var search=Schema.findOne(searchData);
		this._executeSearch(search,cb,fields);
	},
	_executeSearch:function(search,cb,fields,options){
		if(!_.isEmpty(fields)){
			search.select(fields);
		}
		if(!_.isEmpty(options)){
			search.setOptions(options);
		}
		var self=this;
		var searchCb=function(err,data){
			if(err){
				if(err.name=='CastError'){
					 /**
					  * @todo move this to a error element
					  */
					err=self._engine.getError('NotFound');
				}
				cb(err);
				return;
			}
			if(!data){
				err=self._engine.getError('NotFound');

			}
			cb(err,data);
		}
		search.exec(searchCb);

	},
	readById:function(schemaName,id,cb,fields){
		
		this.readRawById(schemaName,id,this._getPlainObjectCb(cb),fields);
	},
	read:function(schemaName,searchData,cb,fields,options){
		
		this.readRaw(schemaName,searchData,this._getPlainObjectCb(cb),fields,options);
	},
	readOne:function(schemaName,searchData,cb,fields){
		
		this.readRawOne(schemaName,searchData,this._getPlainObjectCb(cb),fields);
	},
	destroy:function(schemaName,searchData,cb){
		var Schema=this.getSchemaClass(schemaName);
		Schema.remove(searchData,cb);
	},
	_addFunctionToClose:function(){
	 	var self=this
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
	
	},
	list:function(schemaName,search,limit,page,fields,cb){
		if(parseInt(limit)===-1){
			limit=false;
		}
		else if(!limit || typeof(limit)=='undefined'){
			limit=DEFAULT_LIST_LIMIT;
		}
		if(!page || typeof(page)=='undefined'){
			page=0;
		}
		var options={sort:{name:1}};
		if(limit){
			options.limit=limit;
			options.skip=limit*page;
		}

		this.read(schemaName,search,cb,fields,options);
	}
	 /**
	  * 	listForSchema:function(schemaName,search,limit,page,language,cb){
		if(parseInt(limit)===-1){
			limit=false;
		}
		else if(!limit || typeof(limit)=='undefined'){
			limit=DEFAULT_LIST_LIMIT;
		}
		if(!language){
			language=this.getDefaultLanguage();
		}
		if(!page || typeof(page)=='undefined'){
			page=0;
		}
		if(!search){
			search={};
		}
		var options={sort:{name:1}};
		if(limit){
			options.limit=limit;
			options.skip=limit*page;
		}

		var searchData={enabled:true,language:language};
		if(search.string){
			searchData.name=new RegExp('^'+search.string+'.*', "i");
		}
		var searchOptions=search.options;
		if(searchOptions){
			searchData=_.extend(searchData,searchOptions);
		}


		this._dataBase.read(schemaName,searchData,cb,null,options);

	}
	  */
}
