module.exports={
	parent:'ginger.bootstraps.Element',
	_defaulAppNamespace:'models',
	_defaultAppParent:'ginger.mvc.AbstractModel',
	_defaultCRUDParent:'ginger.mvc.AbstractCRUDModel',
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
	}
}
/*
	changeObjectParent:function(name,newParent){
		var element=this.getElementByName(name);
		var namespace=element.namespace;
		var pojo=this._classFactory.getClassPojo(namespace);
		if(_.isEmpty(pojo)){
			throw new Error(name+' was not found!,searched on the '+namespace+'  namespace');
		}

		if(!this._isParentTheDefault(pojo.parent)){
			return false;
		}
		pojo.parent=newParent;
		element.pojo=pojo;
		this._overwrideElementData(name,element);
		this._classFactory.setClassPojo(namespace,pojo,true);
		return true;
	},
 */