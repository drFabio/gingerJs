module.exports=function(Schema){
	return {
		'structure':{
		    title: {type: String, required: true, trim: true, unique: true},
		    content: {type: String},
		    at: {type: Date, default:Date.now,required: true},
		},
		'behaviour':{
			'auto':false
		},
	}
}