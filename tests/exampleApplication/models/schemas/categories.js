module.exports= {
	getStructure:function(schema){
		return {
			name: {type: String, required: true, trim: true, unique: true},
			enabled:{type:Boolean},
			user:{type:schema.ObjectId,ref:'login'}
		}
	}
}