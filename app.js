var express			= require("express"),
	mongoose		= require("mongoose"),
	bodyParser		= require('body-parser'),
	methodOverride	= require('method-override'),
	expressSanitizer= require('express-sanitizer'),
	expressSession	= require('express-session'),
	flash			= require('connect-flash'),
	passport		= require('passport'),
	LocalStrategy	= require('passport-local'),
	passportLocalMongoose 	= require('passport-local-mongoose'),
	Post    		= require("./models/post"),
	Comment   	 	= require("./models/comment"),
	User			= require('./models/user'),
	app				= express()

// ROUTES
var	postRoutes		= require("./routes/posts"),
	commentRoutes	= require("./routes/comments"),
	indexRoutes		= require("./routes/index")

app.set("view engine", "ejs")
// var url = ("mongodb://localhost/myBlog" || "mongodb://zzandland:Ks1000104861@ds119171.mlab.com:19171/myblog")
mongoose.connect("mongodb://zzandland:Ks1000104861@ds119171.mlab.com:19171/myblog")
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.use(expressSanitizer())
app.use(flash())

app.use(expressSession({
	secret: "Secret is my name David",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
	res.locals.currentUser 	= req.user;
	res.locals.error		= req.flash("error")
	res.locals.success		= req.flash("success")
	next()
})

app.use("/", indexRoutes)
app.use("/posts", postRoutes)
app.use("/posts/:id/comments", commentRoutes)

// LISTEN
app.listen(process.env.PORT || 3000, function(){
	console.log('Server Initiated.')
})