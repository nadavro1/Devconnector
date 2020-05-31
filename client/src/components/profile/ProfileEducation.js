import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileEducation = ({edu:{school,degree,fieldofstudy,from,to,current,description}}) => {
    return (
        <div>
            { school && <h3 className="text-dark">{school}</h3>}
            {from && <p><Moment format="DD/MM/YYYY">{from}</Moment> -  {(!current)?
            (<Moment format="DD/MM/YYYY">{to}</Moment>):'Now'}
             </p>}
             {degree && <p><strong>Degree: </strong>{degree}</p>}
             {fieldofstudy && <p><strong>Field of study: </strong>{fieldofstudy}</p>}
             {description && <p> <strong>Description: </strong>{description} </p>}
        </div>
    )
}

ProfileEducation.propTypes = {
    edu: PropTypes.object.isRequired
}

export default ProfileEducation
