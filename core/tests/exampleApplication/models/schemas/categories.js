module.exports= function(Schema){
	return {
		name: {type: String, required: true, trim: true, unique: true}
	}
}