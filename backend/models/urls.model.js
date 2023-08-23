const mongoose = require('mongoose')

const UrlSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    url: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Url = mongoose.model('Url', UrlSchema);

module.exports = Url;