/**
 * This is the abstract configuration for  Ginger you can overwrite it by AssinINg a config to yur engine
 */
module.exports={
	//Components configurations
	'components':{
		'Express':{
			'port':3000,
			'host':'0.0.0.0'
		},
		'SocketIO':{
			'port':3040
		},
		'DataBase':{
			'mongo':{
				'uri':'mongodb://localhost/ginger'
			}
		},
		'Session':{
			'secret':'Change_this!'
		},
		'Log':{}
	},
	'gateways':{
		'HTTP':{},
		'JSONRPC':{'prefix':'JSONRPC'},
		'SocketIO':{}
	},
	'errors':[
		'NotFound',
		'Validate',
		'InvalidParams',
		'InvalidRequest',
		'InternalError'
	],
	'gatewayDir':__dirname+'/../gateway/',
	'componentDir':__dirname+'/../components/',
	'bootstrapDir':__dirname+'/../bootstraps/',
	'abstractGatewayPath':__dirname+'/../gateway/AbstractGateway.js',
	'abstractModelPath':__dirname+'/../mvc/AbstractModel.js',
	'abstractControllerPath':__dirname+'/../mvc/AbstractController.js',
	'bootstrapPath':__dirname+'/../Bootstrap.js'
};