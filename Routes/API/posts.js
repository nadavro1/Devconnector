const express= require('express');
const route = express.Router();
const {check, validationResult}=require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Post');
// add  post

route.post('/', [auth,[
check('text','please add text').not().isEmpty() 
]] ,async (req,res)=>{
    try {
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user: req.user.id
        });
        const post = await newPost.save();
        res.send(post);
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server error');
    }
})

// get all posts

route.get('/',auth,async (req,res)=>{
    try {
        const posts = await Post.find().sort({date:-1});
        if(!posts){
            return res.status(404).json({msg:'Posts are not found'})
        }
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
    
})

// get post by id
route.get('/:id',auth,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'post is not found'})
        }
        // if(req.user.id != post.user){
        //     return res.status(401).json({msg:'Its not your post!'})
        // }
        res.json(post);
    } catch (error) {
        console.log(error);
        if(error.name == "CastError"){
            return res.status(400).json({msg:"post not found"});
        }
        res.status(500).send('Server error');
    }
    
})

// delete post
route.delete('/:id',auth,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'post is not found'})
        }
        if(req.user.id != post.user){
            return res.status(401).json({msg:'Its not your post!'})
        }
        await post.remove();
        res.send("Deleted post: "+ post);
    } catch (error) {
        console.log(error);
        if(error.name == "CastError"){
            return res.status(400).json({msg:"post not found"});
        }
        res.status(500).send('Server error');
    }
    
})
// like on post
route.put('/like/:id',auth,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'post is not found'})
        }

        if(post.likes.filter(like => like.user == req.user.id).length > 0){
            return res.status(401).json({msg: 'You have already liked this post!'})
        }

        post.likes.unshift({user:req.user.id});
        await post.save();
        res.json(post);
    } catch (error) {
        console.log(error);
        if(error.name == "CastError"){
            return res.status(400).json({msg:"post not found"});
        }
        res.status(500).send('Server error');
    }
});

// unlike on post
route.put('/unlike/:id',auth,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'post is not found'})
        }

        if(post.likes.filter(like => like.user == req.user.id).length == 0){
            return res.status(401).json({msg: 'You have never liked this post!'})
        }
       
        const indexOf = post.likes.map(like => like.user).indexOf(req.user.id);
        post.likes.splice(indexOf,1);
        await post.save();
        res.json(post);
    } catch (error) {
        console.log(error);
        if(error.name == "CastError"){
            return res.status(400).json({msg:"post not found"});
        }
        res.status(500).send('Server error');
    }
})

// add comment to a post
route.post('/comment/:post_id', [auth,[
    check('text','please add text').not().isEmpty() 
    ]] ,async (req,res)=>{
        try {
            const errors= validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array()});
            }
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.post_id);
            if(!post){
                return res.status(404).json({msg:'post is not found'})
            }
            const newComment = {
                text:req.body.text,
                name:user.name,
                avatar:user.avatar,
                user: req.user.id
            };
            post.comments.unshift(newComment);
            await post.save();
            res.send(post);
        } catch (error) {
            console.log(error.message)
            res.status(500).send('Server error');
        }
    })
    // delete comment from post
route.delete('/comment/:post_id/:comment_id',auth,async (req,res)=>{
    try {
        const post = await Post.findById(req.params.post_id);
        if(!post){
            return res.status(404).json({msg:'post is not found'})
        }
        const comment = post.comments.filter(comment => comment._id == req.params.comment_id)[0];
        if(!comment){
            return res.status(404).json({msg:'comment is not found'})
        }
        if(req.user.id != comment.user){
            return res.status(401).json({msg:'Its not your comment!'})
        }
        const indexOf = post.comments.map(comment => comment._id).indexOf(req.params.comment_id);
        post.comments.splice(indexOf,1);
        await post.save()
        res.send(post);
    } catch (error) {
        console.log(error);
        if(error.name == "CastError"){
            return res.status(400).json({msg:"post not found"});
        }
        res.status(500).send('Server error');
    }
    
})
module.exports = route;