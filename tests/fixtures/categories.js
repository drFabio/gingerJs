var id = require('pow-mongodb-fixtures').createObjectId;
var logins=require(__dirname+'/login').login;
module.exports= {
	'categories':{
		'forDevelopers':{
			name:'for users',
			enabled:true,
			user:logins.user1._id.toString(),
			_id:id()
		},
		'forClients':{
			name:'for clients',
			enabled:true,
			user:logins.user2._id.toString(),
			_id:id()
		}
	}
}