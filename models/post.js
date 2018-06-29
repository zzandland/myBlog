var mongoose = require("mongoose")

var postSchema = new mongoose.Schema({
	title: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
		image: String,
		email: String
	},
	image: String,
	date: {type: Date, default: Date.now},
	body: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]	
})

module.exports = mongoose.model("Post", postSchema)