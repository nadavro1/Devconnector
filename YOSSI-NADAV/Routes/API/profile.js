const express= require('express');
const route = express.Router();
const auth = require('../../middleware/auth');
const user = require('../../models/User');
const Profile = require('../../models/profile');

route.get('/me',auth,async (req,res)=>{
    try {
        const profile = await Profile.findOne( {user:req.user.id}).populate('user',['name','avatar']);
        if(!profile){ 
            return res.status(400).json({msg: 'Profile not found'})
        }
        res.json(profile);
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server error');
    }
})




module.exports = route;