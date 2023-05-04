const Post = require("../models/posts.models");

const retrieveMessage = async (req, res) => {
    const query = req.params?.query;
    if(!query) return res.status(400).json({success: false, message: 'Cannot retrieve message without a query param'});

    try {
        //get message/post id and user id from the req params
        const id = query.split('-')[0];
        const user = query.split('-')[1];

        if(!id || !user) return res.status(400).json({success: false, message: 'Error retrieving message. missing query param!'})
        
        //retrieve the sender's message
        const retrievedMessage = await Post.findOne({$and: [{_id: id}, {user: user}]}).exec();

        if(!retrievedMessage) return res.status(404).json({success: false, message: "No message available!"});
    
        res.status(200).json({success: true, message: retrievedMessage});
    } catch (error) {
        res.status(500).json({success: false, message: "No message available!"});
    }
};

module.exports = {
    retrieveMessage
}