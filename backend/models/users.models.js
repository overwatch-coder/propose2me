const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        unique: true,
        required: true,
    }, isEmailVerified: {
        type: Boolean,
        default: false
    },
   
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

mongoose.set('strictPopulate', false);

const User = mongoose.model('User', userSchema);

module.exports = User;