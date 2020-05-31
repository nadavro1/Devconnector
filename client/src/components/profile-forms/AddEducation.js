import React, { Fragment,useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter,Link} from 'react-router-dom'
import {addEducation} from '../../actions/profile';

export const AddEducation = ({addEducation,history}) => {
    const [formData,setFormData]=useState({
        school:'',
        degree:'',
        from:'',
        current:false,
        to:'',
        description:'',
        fieldofstudy:''
    })

    const [disableTo,setDisableTo]= useState(false);

   const  {
        school,
        degree,
        from,
        current,
        to,
        description,
        fieldofstudy
    } = formData;

    const onChange= (e)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    }
    const onSubmit=(e)=>{
        e.preventDefault();
        addEducation(formData,history);
    }

    useEffect(()=>{
        if(disableTo) setFormData({...formData,to:''}) 
    },[disableTo,formData])
    return (
        <Fragment>
     <h1 className="large text-primary">
        Add Your Education
      </h1>
      <p className="lead">
        <i className="fas fa-graduation-cap"></i> Add any school, bootcamp, etc that
        you have attended
      </p>
      <small>* = required field</small>
      <form className="form"  onSubmit={(e)=>onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="* School or Bootcamp"
            name="school"
            required
            value = {school}
            onChange={(e)=>onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Degree or Certificate"
            name="degree"
            required
            value = {degree}
            onChange={(e)=>onChange(e)}
          />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Field Of Study" name="fieldofstudy" value = {fieldofstudy}
            onChange={(e)=>onChange(e)}/>
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value = {from}
            onChange={(e)=>onChange(e)}/>
        </div>
        <div className="form-group">
          <p>
            <input type="checkbox" name="current" value = {current}
            onChange={
                (e)=>{
                    setDisableTo(!disableTo); 
                    setFormData({...formData , current:!current })
                }
            }/> Current School or Bootcamp
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input type="date" name="to" value = {to}
            onChange={(e)=>onChange(e)} disabled={disableTo}/>
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Program Description"
            value = {description}
            onChange={(e)=>onChange(e)}
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" 
           />
        <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form>
        </Fragment>
    )
}

AddEducation.propTypes = {
    addEducation:PropTypes.func.isRequired
}

export default connect(null,{addEducation})(withRouter(AddEducation))
