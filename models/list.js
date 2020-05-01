var mongoose=require("mongoose");
mongoose.set("useUnifiedTopology",true);
mongoose.connect("mongodb://localhost/final",{
    useNewUrlParser:true});
    
var stockSchema=new mongoose.Schema({
    stockname:String,
    quantity:Number,
    price:Number
});

module.exports=mongoose.model("List",stockSchema);