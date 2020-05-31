import React,{Fragment} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {logout} from '../../actions/auth';

const  Navbar  = ({isAuthenticated,loading,logout}) => {
    const authLinks = (
        <ul>
            <li>
                <Link to='/dashboard'>
                    <i className='fas fa-user' />{' '}
                    <span className='hide-sm'>Dashboard</span>
                </Link>
            </li>
            <li>
                <Link to='/profiles'>
                    <i className='fas fa-user' />{' '}
                    <span className='hide-sm'>Developers</span>
                </Link>
            </li>
            <li>
                <Link to='/posts'>
                    <i className='fas fa-user' />{' '}
                    <span className='hide-sm'>Posts</span>
                </Link>
            </li>
            <li>
                <a href="#!" onClick={logout}>
                    <i className='fas fa-sign-out-alt'/>{' '}
                    <span className='ide-sm'>Logout</span>
                </a>
            </li>
        </ul>
    )
    const guestLinks = (
        <ul>
            {/* <li><Link to="profiles.html">Developers</Link></li> */}
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li>
                <Link to='/profiles'>
                    <i className='fas fa-user' />{' '}
                    <span className='hide-sm'>Developers</span>
                </Link>
            </li>
        </ul>
    )
    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
            </h1>
            {!loading && (<Fragment>{isAuthenticated?authLinks:guestLinks}</Fragment>)}
        </nav>
    )
}

const mapStateToProps=state=>{
    return {
        isAuthenticated:state.auth.isAuthenticated,
        loading: state.auth.loading
    }
}

export default connect(mapStateToProps,{logout})(Navbar)
