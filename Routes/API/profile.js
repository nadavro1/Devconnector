const express= require('express');
const request= require('request');
const config= require('config');
const route = express.Router();
const auth = require('../../middleware/auth');
const user = require('../../models/User');
const Profile = require('../../models/profile');
const Post = require('../../models/Post');
const {check, validationResult}=require('express-validator');


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

route.post('/',[auth,[
    check('skills','Skills is required').not().isEmpty(),
    check('status','Status is required').not().isEmpty()
]],async(req,res)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
      } = req.body;
    const profileFields={};
    profileFields.user= req.user.id;
    if(company) profileFields.company=company;
    if(location) profileFields.location=location;
    if(website) profileFields.website=website;
    if(githubusername) profileFields.githubusername=githubusername;
    if(bio) profileFields.bio=bio;
    if(status) profileFields.status=status;
    if(skills){
        profileFields.skills= skills.split(',').map(skill=> skill.trim());
    }
    profileFields.social={};
    if(youtube) profileFields.social.youtube=youtube;
    if(twitter) profileFields.social.twitter=twitter;
    if(facebook) profileFields.social.facebook=facebook;
    if(linkedin) profileFields.social.linkedin=linkedin;
    if(instagram) profileFields.social.instagram=instagram;

    try {
        let profile = await Profile.findOne( {user:req.user.id});
        if(profile){ 
            // update
            profile = await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true});
            
        }else{
            //insert
            profile= new Profile(profileFields);
            await profile.save();
        }
        res.json(profile);
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server error');
    }
})

route.get('/',async (req,res)=>{
    try {
        profiles= await Profile.find().populate('user',["name","avatar"]);
        if(profiles){
             res.json(profiles);
        }else{
            res.status(400).json({msg:"Profiles are not found"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error')
    }
})

route.get('/user/:user_id',async (req,res)=>{
    try {
        let profile= await Profile.findOne({user:req.params.user_id}).populate('user',["name", "avatar"]);
        if(profile){
            return res.json(profile);
        }
        res.status(400).json({msg:"Profile not found"});
    } catch (error) {
        console.log(error);
        if(error.name == "CastError"){
            return res.status(400).json({msg:"Profile not found"});
        }
        res.status(500).send("Server error");
    }
})

route.delete('/',auth,async (req,res)=>{
    try {
        //remove posts
        await Post.deleteMany({user:req.user.id});
        //remove profile
        await Profile.findOneAndRemove({user:req.user.id});
        // remove user
        await  User.findOneAndRemove({_id:req.user.id});
        res.json({msg:"Deleted user"})
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error')
    }
})
// add experience
route.put('/experience',[auth , [
    check('title', "Please enter title").not().isEmpty(),
    check('from', "Please enter from").not().isEmpty()
]] ,async (req,res)=>{
    try {
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const {
           title,
           company,
           location,
           from,
           to,
           current,
           description
        } = req.body;

        const newExp = {
             title,
             company,
             location,
             from,
             to,
             current,
             description
        };
        let profile = await Profile.findOne({user:req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message)
    }
})

// delete experience
route.delete('/experience/:exp_id',auth, async (req,res)=>{
    try {
        const profile= await Profile.findOne({user:req.user.id});
        if (!profile) {
            return res.status(400).json({msg:'Profile not found'})
        }
        const indexOf = profile.experience.map(exp => exp.id).indexOf(req.params.exp_id);
        profile.experience.splice(indexOf,1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
    
})
// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
route.put(
    '/education',
    [
      auth,
      [
        check('school', 'School is required')
          .not()
          .isEmpty(),
        check('degree', 'Degree is required')
          .not()
          .isEmpty(),
        check('fieldofstudy', 'Field of study is required')
          .not()
          .isEmpty(),
        check('from', 'From date is required and needs to be from the past')
          .not()
          .isEmpty()
          .custom((value, { req }) => (req.body.to ? value < req.body.to : true))
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body;
  
      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.education.unshift(newEdu);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );
// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

route.delete('/education/:edu_id', auth, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
      foundProfile.education = foundProfile.education.filter(
        edu => edu._id.toString() !== req.params.edu_id
      );
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  });

  //get github repos
route.get('/github/:git_user', (req,res)=>{
    try{
    const option = {
        uri:`https://api.github.com/users/${req.params.git_user}/repos?per_page=5&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
        method:'GET',
        headers:{'user-agent':'node.js'}
    }
    // return res.send(option.uri);
    request(option,(error,Response,body)=>{
        if(error) console.log(error.message)
        if (Response.statusCode!=200){
           return res.status(404).json({msg:'No GitHub profile found'});
        }
        res.json(JSON.parse(body));
    });
    }
    catch(err){
        console.log(err.message)
        res.status(500).send('server error');
    }
})
module.exports = route;