module.exports={
	parent:'ginger.bootstraps.Element',
	_defaulAppNamespace:'controllers',
	_defaultAppParent:'ginger.mvc.AbstractController',
	_defaultCRUDParent:'ginger.mvc.AbstractCRUDController',

	_debugController:true,
	handleAutoSchemaCrud:function(schemaNames){
		schemaNames.forEach(function(s){
			if(this.hasElement(s)){
				this.changeObjectParent(s,this._defaultCRUDParent);
			}
			else{
				this.setEmptyAppClass(s,this._defaultCRUDParent);
			}
		},this);
	},
	init : function(engine,params) {
		this._super(engine,params);
		if(!this._params.actionSuffix){
			this._params.actionSuffix='Action';
		}
	},
	_buildIndexData:function(name,namespace,POJO,isApp,isEngine){
		if(!POJO.modelName){
			POJO.modelName=name;
		}	
		var data=this._super(name,namespace,POJO,isApp,isEngine);
		return data;
	}
}
