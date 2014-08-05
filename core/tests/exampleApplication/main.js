var Ginger=require(__dirname+'/../../Ginger.js');
ginger=new Ginger();
var cb=function(err,data){
	if(err){
		throw err;
	}
}
ginger.up(cb);