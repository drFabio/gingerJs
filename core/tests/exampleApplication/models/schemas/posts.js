module.exports={
	_isAuto:false,
	getStructure:function(schema){
		return {
			title: {type: String, required: true, trim: true, unique: true},
			content: {type: String},
			at: {type: Date, default:Date.now,required: true},
		};
	}
}

