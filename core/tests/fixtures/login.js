var id = require('pow-mongodb-fixtures').createObjectId;
module.exports= {
	'login':{
		'user1':{
			'email':'blackjackdevel@gmail.com',
			'active':true,
			'name':'bar',
			'password':'foo',
			'_id':id()

		}
	}
};