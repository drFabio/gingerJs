/**
 * This is the abstract configuration for  Ginger you can overwrite it by AssinINg a config to yur engine
 */
module.exports={
	'gatewaysDir':__dirname+'/../gateways/',
	'componentsDir':__dirname+'/../components/',
	'bootstrapsDir':__dirname+'/../bootstraps/',
	'abstractGatewayPath':__dirname+'/../gateway/AbstractGateway.js',
	'abstractModelPath':__dirname+'/../mvc/AbstractModel.js',
	'abstractControllerPath':__dirname+'/../mvc/AbstractController.js',
};