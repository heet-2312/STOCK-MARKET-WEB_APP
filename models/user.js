var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");
mongoose.set("useUnifiedTopology",true);
mongoose.connect("mongodb://localhost/final",{
	useNewUrlParser:true});
var UserSchema= new mongoose.Schema({
	username:String,
	password:String,
	stocks:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "List"
		}
	]
});

UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",UserSchema);