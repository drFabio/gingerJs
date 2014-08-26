var _=require('lodash');
module.exports= {
	parent:'ginger.mvc.AbstractModel',
	init: function(engine) {
		this._super(engine);
		this._dataBase=engine.getComponent('DataBase');

	},
	create:function(data,cb){

		this._dataBase.create(this._schemaName,data,cb)
	},
	update:function(data,search,cb){
		search=this._buildSearch(search);
		this._dataBase.update(this._schemaName,data,search,cb)
	},
	updateById:function(id,data,cb){
		this._dataBase.updateById(this._schemaName,id,data,cb)
	},
	read:function(search,cb,fields){
		this._dataBase.read(this._schemaName,search,cb,fields)
	},
	readOne:function(search,cb,fields){
		search=this._buildSearch(search);
		this._dataBase.readOne(this._schemaName,search,cb,fields)
	},
	readById:function(id,cb,fields){
		this._dataBase.readById(this._schemaName,id,cb,fields)
	},
	destroy:function(search,cb){
		search=this._buildSearch(search);
		this._dataBase.destroy(this._schemaName,search,cb)
	},
	list:function(search,limit,page,fields,cb){
		search=this._buildSearch(search);
		this._dataBase.list(this._schemaName,search,limit,page,fields,cb);
	},
	save:function(data,cb){
		if(this._hasPrimaryKey(data)){
			var pk=this._getPrimaryKey(data);
			delete data[this._getPrimaryKeyField()];
			this.updateById(pk,data,cb);
		}
		else{
			this.create(data,cb);
		}
	},
	_buildSearch:function(search){
		return search;
	},
	_getPrimaryKeyField:function(){
		return '_id';
	},
	_getPrimaryKey:function(data){
		return data[this._getPrimaryKeyField()];
	},
	_hasPrimaryKey:function(data){
		var pk=this._getPrimaryKey(data);
		return !_.isEmpty(pk);
	}
};