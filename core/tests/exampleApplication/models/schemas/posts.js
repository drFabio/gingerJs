module.exports=function(Schema){
	return {
	    email: {type: Schema.String, required: true, trim: true, unique: true},
	    active: {type: Boolean},
	    name: {type: String, required: true},
	    password: {type: String, required: true, trim: true}
	}
}