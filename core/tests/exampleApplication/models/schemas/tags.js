module.exports=function(Schema,validators){
	return {
		'structure':{
		    name: {type: String, required: true, trim: true, unique: true},
		    active: {type: Boolean,default:true},
		    numHits:{type:Number},
		    slug:{type:String},
		    url:{type:String}
		},
		'behaviour':{
			'auto':false
		},
		'validators':{
			active:'toBoolean',
			numHits:['isBase64','isInt'], //Several validators
			name:'isAlpha',
			url:[	{'isUrl':[{'protocols':['http','https']},  //A validator with parameters 
					'mimimi']}]

		}
	 
	}
}