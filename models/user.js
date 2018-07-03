var mongoose 				= require('mongoose'),
	passportLocalMongoose 	= require('passport-local-mongoose')

var userSchema = new mongoose.Schema({
	username: String,
	firstname: String,
	lastname: String,
	password: String,
	image: String,
	email: String
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)