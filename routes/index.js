var express 	= require("express"),
	router		= express.Router(),
	User		= require("../models/user"),
	passport	= require("passport")


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}

// LANDING
router.get("/", function(req, res){
	res.redirect("/posts")
})

// REGISTER
router.get("/register", function(req, res){
	res.render("register")
})

router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message)
			res.redirect("/register")
		} else {
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to my blog, " + req.body.username + "!")
				res.redirect("/posts")
			})
		}
	})
})

// LOGIN
router.get("/login", function(req, res){
	res.render("login")
})

router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/posts",
		failureRedirect: "/login",
		failureFlash: true
	}), function(req, res){
})

// LOGOUT
router.get("/logout", function(req, res){
	req.logout()
	res.redirect("/")
})

module.exports = router;