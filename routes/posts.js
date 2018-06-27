var express		= require("express"),
	router 		= express.Router(),
	Post 		= require("../models/post"),
	Comment 	= require("../models/comment"),
	middleware	= require("../middleware")

// INDEX
router.get("/", function(req, res){
	Post.find({}, function(err, posts){
		if(err){
			console.log(err)
		} else{
			res.render("posts/index", {posts: posts})
		}
	})
}) 

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("posts/new")
})

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
	var	author	= {
			id: req.user._id,
			username: req.user.username
		}
	req.body.post.author = author
	Post.create(req.body.post, function(err, newPost){
		if(err){
			console.log(err)
		} else{
			res.redirect("posts")
		}
	})
})

// SHOW
router.get("/:id", function(req, res){
	Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
		if(err){
			console.log(err)
		} else{
			res.render("posts/show", {post: foundPost})
		}
	})
}) 

// EDIT
router.get("/:id?/edit", middleware.checkPostOwnership, function(req, res){
	Post.findById(req.params.id, function(err, foundPost){
		if(err){
			console.log(err)
		} else{
			res.render("posts/edit", {post: foundPost})
		}
	})
})

// REPLACE
router.put("/:id", middleware.checkPostOwnership, function(req, res){
	Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, editPost){
		if(err){
			console.log(err)
		} else{
			res.redirect("/posts/" + req.params.id)
		}
	})
})

// DELETE
router.delete("/:id", middleware.checkPostOwnership, function(req, res){
	Post.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err)
		} else{
			res.redirect('/posts')
		}
	})
})

module.exports = router