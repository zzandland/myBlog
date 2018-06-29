var express 	= require("express"),
	router		= express.Router({mergeParams: true}),
	Post		= require("../models/post"),
	Comment 	= require("../models/comment"),
	middleware	= require("../middleware")

// CREATE
router.post("/", function(req, res){
	Post.findById(req.params.id, function(err, foundPost){
		if(err){
			console.log(err)
		} else{
			Comment.create(req.body.comment, function(err, createdComment){
				if(err){
					console.log(err)
				} else{
					if(req.user) {
						var author = {
							id: req.user._id,
							username: req.user.username,
							image: req.user.image	
						}
						createdComment.author = author;
						createdComment.save()
					} else {
						var author = {
							username: req.body.username,
							image: "https://d30y9cdsu7xlg0.cloudfront.net/png/138927-200.png"
						}
						createdComment.author = author;
						createdComment.save()	
					}
					
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