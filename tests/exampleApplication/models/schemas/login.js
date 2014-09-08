module.exports={
	getStructure:function(schema){
		return {
		    email: {type: String, required: true, trim: true, unique: true},
		    active: {type: Boolean,default:true},
		    name: {type: String, required: true},
		    password: {type: String, required: true, trim: true}
		}
	}
}