var Ginger=require(__dirname+'/../../Ginger.js');
ginger=new Ginger();
ginger.setAppPath(__dirname);
var cb=function(err,data){
	if(err){
		throw err;
	}
}
ginger.up(cb);