var dbName='gingerTests';
module.exports={
	"name":"Example",
	'components':{
	'DataBase':{
			'mongo':{
				'url':'mongodb://localhost',
				'port':'27017',
				'base':dbName
			}
		}
	}
}