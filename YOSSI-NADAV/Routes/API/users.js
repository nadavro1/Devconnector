const express= require('express');
const route = express.Router();
const {check, validationResult}=require('express-validator');
const User=require('../../models/User')
const gravatar= require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config= require('config');

route.post('/',
[
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password','Please enter password with 6 or more characters').isLength({min:6})
],
async (req,res)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {name, email, password, avatar,date}= req.body;

    try {
        let user= await User.findOne({email});
        if (user) {
            return res.status(400).json({errors: [{msg: "User already exists"}]})
        }
        const avatar= gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })
        const salt= await bcrypt.genSalt(10);

        user.password= await bcrypt.hash(password, salt);

        await user.save();

        const payload={
            user:{
                id:user.id
            }
        }

        jwt.sign(payload,
            config.get('jwtSecret'),
            {expiresIn:36000},
            (err,token)=>{
                if (err) throw err;
                res.json({token});
            }
        )
    } catch (error) {
       console.error(error.message);
       return res.status(500).send('Server error'); 
    }
    

    
})

route.get('/',async(req,res)=>{
    try {
        const user = await User.find()
        if(!user) res.send('User not found')
        res.send(user);
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server error');
    }
})

module.exports = route;