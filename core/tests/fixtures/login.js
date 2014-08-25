var id = require('pow-mongodb-fixtures').createObjectId;
module.exports= {
	'login':{
		'user1':{
			'email':'email@gmail.com',
			'active':true,
			'name':'bar',
			'password':'foo',
			'_id':id()

		},
		'user2':{
			'email':'othermail@gmail.com',
			'active':true,
			'name':'bar',
			'password':'foo',
			'_id':id()

		}
	}
};