var express 	= require("express"),
	router		= express.Router({mergeParams: true}),
	Post		= require("../models/post"),
	Comment 	= require("../models/comment"),
	middleware	= require("../middleware")

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
	Post.findById(req.params.id, function(err, foundPost){
		if(err){
			console.log(err)
		} else{
			Comment.create(req.body.comment, function(err, createdComment){
				var author = {
					id: req.user_id,
					username: req.user.username
				}
				if(err){
					console.log(err)
				} else{
					createdComment.author.id = req.user._id;
					createdComment.author.username = req.user.username;
					createdComment.save()
					foundPost.comments.push(createdComment)	
					foundPost.save()	
					res.redirect("/posts/" + foundPost._id)
				}
			})
		}
	})
})

// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if (err) {
			console.log(err)
		} else {
			res.send("worked!")
			res.render("comments/edit", {post_id: req.params.id, comment: foundComment})	
		}
	})
})

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, editedComment) {
		if(err) {
			console.log(err)
		} else {
			res.redirect("/posts/" + req.params.id)
		}
	})
})

// DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err) {
			console.log(err)
		} else {
			res.redirect("/posts/" + req.params.id)
		}
	})
})

module.exports = router;