var mongoose = require("mongoose")

var commentSchema = new mongoose.Schema({
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
		fullname: String,
		image: String
	},
	date: {type: Date, default: Date.now},
	body: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
})

module.exports = mongoose.model("Comment", commentSchema)

