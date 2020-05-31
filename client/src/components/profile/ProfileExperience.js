import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileExperience = ({experience:{title,company,location,from,to,current,description}}) => {
    return (
        <div>
            { company && <h3 className="text-dark">{company}</h3>}
            {location && <small>{location}</small>}
            {from && <p><Moment format="DD/MM/YYYY">{from}</Moment> -  {(!current)?
            (<Moment format="DD/MM/YYYY">{to}</Moment>):'Now'}
             </p>}
            {title && <p><strong>Position: </strong>{title}</p>}
            {description && <p> <strong>Description: </strong>{description} </p>}
        </div>
    )
}

ProfileExperience.propTypes = {
    experience: PropTypes.object.isRequired
}

export default ProfileExperience
