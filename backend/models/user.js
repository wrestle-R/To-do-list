const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema =new Schema({
    fullName : String,
    nickname : String,
    email: {
        type : String,
        unique : true
    },
    password: String,
    time_created_at : String,
})



const UserModel = mongoose.model('User' , userSchema)

module.exports = UserModel