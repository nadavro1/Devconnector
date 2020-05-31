import React,{useEffect,Fragment} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Spinner  from "../layout/spinner"
import ProfileTop from './ProfileTop'
import ProfileAbout from './ProfileAbout'
import ProfileExperience from './ProfileExperience'
import ProfileEducation from './ProfileEducation'
import ProfileGithub from './ProfileGithub'
const {getProfile} = require('../../actions/profile');

const Profile = ({match,getProfile,profile:{loading,profile},auth}) => {
    useEffect(()=>{
        getProfile(match.params.id);
    },[getProfile,match.params.id])
    return (    
        <Fragment>
            {loading || profile==null?<Spinner/>:<Fragment>
            <Link to="/profiles" className="btn btn-light">Back To Profiles</Link>
            {auth.isAuthenticated && auth.loading===false && auth.user._id===profile.user._id &&
            (<Link className="btn btn-dark" to="/edit-profile">Edit Profile</Link>)}
            <div className="profile-grid my-1">
                <ProfileTop profile={profile}/>
                <ProfileAbout profile={profile}/>
                <div className="profile-exp bg-white p-2">
                <h2 className="text-primary">Experience</h2>
                {profile.experience.length>0? (<Fragment>
                    {
                        profile.experience.map(exp => <ProfileExperience key={exp._id} experience={exp}/>)
                    }
                </Fragment>):(<h4>No experience credentials</h4>)}
                </div>
                <div className="profile-edu bg-white p-2">
                    <h2 className="text-primary">Education</h2>
                    {profile.education.length>0? (<Fragment>
                        {
                            profile.education.map(edu => <ProfileEducation key={edu._id} edu={edu}/>)
                        }
                    </Fragment>):(<h4>No education credentials</h4>)}
                </div>
                <div>
                    {profile.githubusername && (<ProfileGithub username = {profile.githubusername}/>)}
                </div>
            </div>
            
            </Fragment>}
          
        </Fragment>
    )
}

Profile.propTypes = {
    profile:PropTypes.object.isRequired,
    auth:PropTypes.object.isRequired,
    getProfile:PropTypes.func.isRequired
}

const mapStateToProps=state=>({
    profile:state.profile,
    auth:state.auth
})
export default connect(mapStateToProps,{getProfile})(Profile)
