module.exports={
	parent:'ginger.bootstraps.Element',
	_defaulAppNamespace:'models',
	_defaultAppParent:'ginger.mvc.AbstractModel',
	_defaultCRUDParent:'ginger.mvc.AbstractCRUDModel',
	init : function(engine,params) {
		this._super(engine,params);
		this._eventFactory=engine.getBootstrap('EventEmitterFactory');
	},
	handleAutoSchemaCrud:function(schemaNames){
		schemaNames.forEach(function(s){
			if(this.hasElement(s)){
				this.changeObjectParent(s,this._defaultCRUDParent);
			}
			else{
				this.setEmptyAppClass(s,this._defaultCRUDParent);
			}
			this.mergeObjectPojo(s,{_schemaName:s});
		},this);
	},
	create : function (name, var_args) {
		var obj=this._super.apply(this,arguments);
		if(obj.hasEvents){
			obj=this._eventFactory.makeObjectEventEmitter(obj);
		}
		return obj;
	}
}