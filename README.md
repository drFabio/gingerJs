#GingerJs
    A HMVC,fully configurable and overwritable Node JS framework.
    See the example application on tests for a overview of how it works

#Configuration
	The config/defaultApp.js gives an overview of how the ginger configuration is made. You can select gateways,put general data and configure components by it.

#Structures

##The engine
    The engine is the main structure to access the components, it is commanded by a config file.

##Models
---
###General Models
    General models are the business logic of the application.
###CRUD Models
    Crud models use schemas to make create,read,update and delete actions on a database
###Schemas
	Schemas are the representation of a mongo database using mongoose

##Controllers
---
###General Controllers
	General controllers receive requests from the gateway and respond to them
###CRUD Controllers
	Crud controllers have default methos fore create,read,update and delete

##Gateways
	Gateways are the way that a request enter an application.
###JSON RPC 
	The json RPC takes a JSONRPC 2.0 request, mask it as an express request and send it to controller.
	By default the way the routes are made are:
		For each Controller a post route is created.
		This post route listen for a method param and send it to the controller action if it exists
###HTTP (Not fully implemented)
	THe HTTP Gateway receives comon HTTP request and send it.
	By default the way the routes are made are:
		For each controller and for each action a route on the form controller/action is created
###SocketIo (Not Implemented)

##Bootstraps
	Bootstraps are basic factories with one exception the app bootStrap
###App Bootstrap
	The app bootstrap loop trough folders initializing the app architecture.It finds controllers,models,schemas ,components and modules.Create authomatic crud controllers and crud models if needed and initialize components.

##Modules
	Every module have the same folder structure as the application
##Components
---
Components are general single purpose structures
###Middlewares
	Middlewares can run before a request , they are express middlewares.
###Routers
	Routers are associated with each gateway and can change  how it handles it's urls, which verbs it should use and etc.
###Default components
####Session
	Session by default set sessions and the cookie parser for expres
####Log
	The log component is a facade for the jsnlog component
####SocketIO (Not Implemented)
####Database
	The database Compoenent connects to a mongo database using mongoose, creates schema structures and is the final part for executing crud or general DB operations
####Authentication
	The authentication component sets up the passport package
####Authorization
	The authorization component executes rule for access to routes, these things can be configured on the config file
####Express
	THe express component initializes and sets up a new express listening port

