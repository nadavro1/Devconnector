import axios from 'axios';
import {
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_ERR,
    UPDATE_PROFILE,
    ACCOUNT_DELETED,
    CLEAR_PROFILE,
    GET_REPOS
} from './types';
import {setAlert} from './alert';

export const getCurrentProfile=()=> async dispatch=>{
    try {
        const res = await axios.get('/api/profile/me/');
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        })
    } catch (error) {
        dispatch({
            type:PROFILE_ERR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })
    }
}

export const getProfiles=()=> async dispatch=>{
    try {
        dispatch({
            type:CLEAR_PROFILE
        })
        const res = await axios.get('/api/profile');
        dispatch({
            type:GET_PROFILES,
            payload:res.data
        })
    } catch (error) {
        dispatch({
            type:PROFILE_ERR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })
    }
}

export const getProfile = (userId)=> async dispatch=>{
    try {
        const res = await axios.get(`/api/profile/user/${userId}`);
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        })
    } catch (error) {
        console.log(error)
        dispatch({
            type:PROFILE_ERR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })
    }
}

export const getGithubRepos = (username)=> async dispatch=>{
    try {
        const res = await axios.get(`/api/profile/github/${username}`);
        dispatch({
            type:GET_REPOS,
            payload:res.data
        })
    } catch (error) {
        dispatch({
            type:PROFILE_ERR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })
    }
}

export const createProfile=(formData,history,edit=false)=> async dispatch=>{
    try {
        const config= {
            header:{
                'Content-Type':'application/json'
            }
        }
        const res = await axios.post('/api/profile/',formData, config);
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        })
        dispatch(setAlert(edit? 'Profile Updated':'Profile Created','success'));
        if(!edit) history.push('/dashboard')
    } catch (error) {
        const errors= error.response.data.errors
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger',6000)));
        }
        dispatch({
            type:PROFILE_ERR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })
    }
}

export const addExperience= (formData,history)=> async dispatch=>{
    try {
        const config= {
            header:{
                'Content-Type':'application/json'
            }
        }
        const res = await axios.put('/api/profile/experience',formData, config);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(setAlert('Expirience added','success'));
        history.push('/dashboard')
    } catch (error) {
        const errors= error.response.data.errors
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger',6000)));
        }
        dispatch({
            type:PROFILE_ERR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })
    }
}

export const addEducation=  (formData,history)=> async dispatch=>{
    try {
        const config= {
            header:{
                'Content-Type':'application/json'
            }
        }
        const res = await axios.put('/api/profile/education',formData, config);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(setAlert('Education added','success'));
        history.push('/dashboard')
    } catch (error) {
        const errors= error.response.data.errors
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger',6000)));
        }
        dispatch({
            type:PROFILE_ERR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })
    }
}

export const deleteExperience = (id)=> async dispatch=>{
    try {

        await axios.delete(`/api/profile/experience/${id}`);

        dispatch({
            type:UPDATE_PROFILE
        })
    } catch (error) {
        const errors= error.response.data.errors
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger',6000)));
        }
        dispatch({
            type:PROFILE_ERR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })
    }
}

export const deleteEducation = (id)=> async dispatch=>{
    try {

        await axios.delete(`/api/profile/education/${id}`);

        dispatch({
            type:UPDATE_PROFILE
        })
    } catch (error) {
        const errors= error.response.data.errors
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,'danger',6000)));
        }
        dispatch({
            type:PROFILE_ERR,
            payload:{msg:error.response.statusText,status:error.response.status}
        })
    }
}

export const deleteAccount = ()=> async dispatch=>{
    if (window.confirm("Are you sure you want to do this?")) {
        try {

            await axios.delete(`/api/profile/`);
            dispatch({
                type:CLEAR_PROFILE
            })
            dispatch({
                type:ACCOUNT_DELETED
            })
           
            dispatch(setAlert('Your account has been deleted!'));
        } catch (error) {
            const errors= error.response.data.errors
            if(errors){
                errors.forEach(error=>dispatch(setAlert(error.msg,'danger',6000)));
            }
            dispatch({
                type:PROFILE_ERR,
                payload:{msg:error.response.statusText,status:error.response.status}
            })
        }
    }
    
}