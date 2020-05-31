
import React,{useEffect, Fragment} from 'react'
import {Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getCurrentProfile, deleteAccount} from '../../actions/profile'
import Spinner from '../layout/spinner.js'
import DashboardActions from './DashboardActions'
import Experience from './Experience'
import Education from './Education'
const Dashboard= ({getCurrentProfile,auth:{user},profile:{profile,loading},deleteAccount})=> {
    useEffect( () => {
         getCurrentProfile();
    }, [getCurrentProfile])
    return loading ? <Spinner/>:<Fragment>
        <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome {user && user.name}
      </p>
      {profile===null?(
        <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
          ):<DashboardActions/>}
        {profile!==null && profile.experience!==null ?
         (<Experience experience = {profile.experience}/>)
         : ''}
        {profile!==null && profile.education!==null ?
        <Education education = {profile.education}/>
        : ''}
        <div>
          <button className="btn btn-danger" onClick={() => deleteAccount()}>
          <i className="fas fa-user"> Delete My Account</i>
          </button>
        </div>
    </Fragment>
   
}

Dashboard.propTypes = {
  deleteAccount: PropTypes.func.isRequired
}
const mapStateToProps=state=>({
    profile: state.profile,
    auth: state.auth
    
})
export default connect(mapStateToProps,{getCurrentProfile, deleteAccount})(Dashboard)

