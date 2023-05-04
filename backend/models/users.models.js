const mongoose = require('mongoose');
const Post = require('./posts.models');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

mongoose.set('strictPopulate', false);

const User = mongoose.model('user', userSchema);

module.exports = User;