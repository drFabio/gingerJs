var id = require('pow-mongodb-fixtures').createObjectId;
module.exports={
	'tags':{
		'NodeJS':{
			'_id':id(),
			'name':'NodeJS',
			'active':true,
			'numHits':100,
			'slug':'nodejs',
			'url':'http://nodejs.org/'
		}
	}
}
