const express = require('express');
const router = express.Router();

//controller imports
const { 
    getAllPosts, 
    getSinglePost, 
    createPost, 
    updatePost, 
    deletePost, 
    allPosts 
} = require('../controllers/posts.controller');

//middleware imports
const { authenticateUser } = require('../middleware/userAuth');

//get all posts regardless of the user
router.get('/all', allPosts);

//middle to protect authenticated routes
router.use(authenticateUser);

router.get('/', getAllPosts);
router.get('/:id', getSinglePost);
router.post('/', createPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;