var Post 	= require("../models/post"),
	Comment = require("../models/comment")

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
	req.flash("error", "Please login first.")
	res.redirect("/login")
}

middlewareObj.checkPostOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Post.findById(req.params.id, function(err, foundPost){
			if(err){
				res.redirect("back")
			} else {
				if(foundPost.author.id.equals(req.user._id)) {
					next()
				} else {
					req.flash("error", "You don't have permission to do so.")
					res.redirect('back')
				}
			}
		})
	} else {
		req.flash("error", "Please login first.")
		res.redirect("/login")
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect("back")
			} else {
				if(foundComment.author.id.equals(req.user._id)) {
					next()
				} else {
					req.flash("error", "You don't have permission to do so.")
					res.redirect("back")
				}
			}
		})
	} else {
		req.flash("error", "Please login first.")
		res.redirect("/login")
	}
}

module.exports = middlewareObj