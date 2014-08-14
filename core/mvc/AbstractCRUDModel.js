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
		this._dataBase.update(this._schemaName,data,search,cb)

	},
	read:function(search,fields,cb){
		if(!cb){
			cb=fields;
		}

		this._dataBase.read(this._schemaName,search,fields,cb)
	},
	readOne:function(search,fields,cb){
		if(!cb){
			cb=fields;
		}

		this._dataBase.readOne(this._schemaName,search,fields,cb)
	},
	destroy:function(search,cb){
		this._dataBase.destroy(this._schemaName,search,cb)
	}
};