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
				numHits:'isInt',
				name: ['isAlpha','isLowercase'],
				url: {
					'isURL': [//A validator with parameters 
						{
							'protocols': [
								'http',
								'https',

							],
							require_tld: true, 
							require_protocol: true,
							allow_underscores: false
						}	
					]
				}
				
		}
	}
}