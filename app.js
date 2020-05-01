var express=require("express");
var app=express();
var mongoose=require("mongoose");
mongoose.set("useUnifiedTopology",true);
var mongoDB='mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB,{
	useNewUrlParser:true});
var passport=require("passport");
var bodyParser=require("body-parser");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");



var List=require("./models/list");
var User=require("./models/user");


var ejs=require('ejs');
app.use(require("express-session")({
	secret:"kambooo-mmm",
	resave:false,
	saveUninitialized:false
}));

app.use(bodyParser.urlencoded({extended:true}));

app.use(passport.initialize());
app.use(passport.session());
app.set("view engine","ejs");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){
	res.render("home");
});



app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	req.body.username
	req.body.password
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			res.render('register');
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/for");
		});
	});
});


//LOGIN ROUTES
//render login form
app.get("/login",function(req,res){
	res.render("login");
});

//LOGIN LOGIC
//middleware
app.post("/login",passport.authenticate("local",{
		successRedirect:"/for",
		failureRedirect:"/"
	}),function(req,res){
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
	   return next();
	   }
	//alert("This is alert box!");  // display string message
	res.redirect("/");
}

var request=require('request');

var data1;
var size1;
var data;
var data2;
var size2;
request('https://financialmodelingprep.com/api/v3/stock/losers',function(error,response,body){
	if(!error && response.statusCode==200){
		data1=JSON.parse(body);
		size1=data1["mostLoserStock"].length;
		//console.log(data1);
		//console.log(size1);
	}
});

request('https://financialmodelingprep.com/api/v3/stock/actives',function(error,response,body){
		if(!error && response.statusCode==200){
			data=JSON.parse(body);
			size=data["mostActiveStock"].length;
			//console.log(data);
			//console.log(size);
			//res.render("forver",{data1:data1});
		}
	});

request('https://financialmodelingprep.com/api/v3/stock/gainers',function(error,response,body){
		if(!error && response.statusCode==200){
			data2=JSON.parse(body);
			//size1=data1["mostLoserStock"].length;
			//console.log(data1);
			//console.log(data2);
		}
	});
app.get("/for",isLoggedIn,function(req,res){
			res.render("forver",{data1:data1,data:data,data2:data2});
		});

app.get("/market",isLoggedIn,function(req,res){
	var query=req.query.search;
	var url="https://financialmodelingprep.com/api/v3/stock/real-time-price/"+query;
	request(url,function(error,response,body){
	if(!error && response.statusCode==200){
		var data=JSON.parse(body);
		//console.log(data);
		res.render("search",{data:data});
	}
 });
});


app.get("/dashboard",isLoggedIn,function(req,res){
	var y=req.user.username;
	User.findOne({username:y}).populate("stocks").exec(function(err,user){
		if(err){
			//console.log(err);
		}else{
			//console.log(user);
			res.render("show",{user:user});
		}
	});
	
});

app.post("/dashboard",isLoggedIn,function(req,res){
	var stockname=req.body.stockname;
	var price=req.body.price;
	var quantity=req.body.quantity;
	//console.log(price);
	//console.log(stockname);
	//console.log(quantity);
	var x=req.user.username;
	List.create({
		stockname:stockname,
		quantity:quantity,
		price:price
	},function(err,stock){
		User.findOne({username:x},function(err,founduser){
			if(err){
				//console.log(err);
			}else{
				//console.log(x);
				//console.log(123);
				founduser.stocks.push(stock);
				founduser.save(function(err,data){
					if(err){
						//console.log(err);
					}else{
						//console.log(data);
					}
				});
			}
		});
	});
	res.redirect("/dashboard");
});



app.listen(3000,function(){
	console.log("whatever it takes");
});