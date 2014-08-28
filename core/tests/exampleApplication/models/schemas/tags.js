module.exports={
	_isAuto:false,
	getStructure:function(schema){
		return {
			name: {type: String, required: true, trim: true, unique: true},
			active: {type: Boolean,default:true},
			numHits:{type:Number},
			slug:{type:String},
			url:{type:String}
		};
	},
	getValidators:function(){
		return {
				active: 'toBoolean',
				numHits: [//Several validators
					'isBase64',
					'isInt'
				],
				name: 'isAlpha',
				url: [
					{
						'isUrl': [//A validator with parameters 
									{
										'protocols': [
											'http',
											'https'
										]
									}
						]
					}
				]
		}
	}
}